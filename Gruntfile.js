/*global module:false*/
module.exports = function(grunt) {
  var project = grunt.file.readJSON('duobei-portal-fe.json');
  var jspSrc = project.feProjectDir + "/" +project.prod.jspDir,
  	  jspDest = project.beProjectDir + "/" + project.prod.jspDir,	
  	  publicResourceSrc = project.feProjectDir + "/" + project.prod.publicResource,
  	  publicResourceDest = project.beProjectDir + "/" + project.prod.publicResource,
  	  tomcatDir = project.prod.tomcatDir,
  	  deployStaticDir = project.prod.webStaticDir,
  	  deployStaticImgDir = project.prod.webImgDir,
  	  optimizationResourceSrc = project.feProjectDir + "/static", 
  	  lessSrc = project.feProjectDir + "/" + project.prod.lessDir,
  	  localLessDir = project.lessDir,
  	  lessBuildCssDest = project.feProjectDir + "/" + project.prod.lessBuildCssDir,
  	  imgDomain = project.prod.imgDomain,
  	  imgDir = project.imgDir,
  	  staticDomain = project.prod.staticDomain;
  	  
  grunt.initConfig({
    pkg: '<duobei-portal-fe.json>',
    
    copy: {
    	  jsp: {
			  files: [
			        {expand: true, cwd: jspSrc, src: ['**'], dest: jspDest} // makes all src relative to cwd
//					{expand: true, cwd: 'WebContent/WEB-INF/jsp/', src: ['**'], dest: 'WebContent/WEB-INF/test/'}
			  ]
    	  },
    	  copyPublic: {
    	  	files: [
		            {expand: true, cwd: publicResourceSrc, src: ['**'], dest: publicResourceDest} // makes all src relative to cwd
		    ]
      	  },
      
    	  copyStatic:{
      	  		files:[
				  {expand: true, cwd: optimizationResourceSrc+'/styles', src: ['**'], dest: deployStaticDir+'/styles/'}, // makes all css src relative to cwd
				  {expand: true, cwd: publicResourceSrc+'/flash', src: ['**'], dest: deployStaticDir+'/flash/'}, // makes all flash src relative to cwd
				  {expand: true, cwd: publicResourceSrc+'/javascript', src: ['**'], dest: deployStaticDir+'/javascript/'}, // makes all js src relative to cwd
				  {expand: true, cwd: optimizationResourceSrc+'/images', src: ['**'], dest: deployStaticImgDir} // makes all img src relative to cwd
				]
    	  },
    	  depoyFront:{
    	  	files: [
  		        {expand: true, cwd: jspDest, src: ['**'], dest: tomcatDir+'/WEB-INF/jsp/'} // makes all img src relative to cwd
  		    ]
    	  }
    },
    
    less: {
    	options: {
    		yuicompress: true
	    },
	    dynamic_mappings: {
	        files: [
	          {
	            expand: true,     // Enable dynamic expansion.
//	            cwd: 'WebContent/resources/public/styles/less',      // Src matches are relative to this path.
	            cwd:lessSrc,
	            src: ['*.less'], // Actual pattern(s) to match.
//	            dest: 'WebContent/resources/public/tempCss',   // Destination path prefix.
	            dest:lessBuildCssDest,
	            ext: '.css'   // Dest filepaths will have this extension.
	          },
	        ]
	    }
	},
	
	replace:{
		dist:[
			{
				  src: optimizationResourceSrc+'/styles/',
				  ext: '.css',
				  replacetoken: '../../../images',
				  replacevalue: imgDomain
			},
    	    {
    	    	  src: optimizationResourceSrc+'/styles/',
    	    	  ext: '.css',
    	    	  replacetoken: '../../images',
    	    	  replacevalue: imgDomain
    	     }
    	]
	},
	
	smushit:{
		destination:{
//	        src: publicResourceSrc +'/images',
//	        dest: optimizationResourceSrc+'/images'
//			src: 'WebContent/resources/public/images',
//	        dest: 'static/images'
	        src: 'WebContent/resources/public/temp1',
	        dest:'WebContent/resources/public/temp2'
	    }
	},
	
	replaceJspStatic: {
		dist:[
		      {
		    	  src: jspDest+ '/',
    	    	  ext: '.jsp'
		      }
		],
		lessDist: optimizationResourceSrc + "/styles",
		jsDist: publicResourceSrc +"/javascript/lib",
		staticDomain: staticDomain
	},
	concat: {//concatenate files,ok
	    options: {
	      separator: ';'
	    }
//	    dist: {
//	      src: ['testSrc/javascript/dashboard.js', 'testSrc/javascript/course_area.js', 'testSrc/javascript/createPm.js'],
//	      dest: 'testDest/test/built.js'
//	    }
	},
	uglify: {//minify files with uglify,ok
//	    my_target: {
//	      files: {
//	        'testDest/test/output.min.js': ['testSrc/javascript/dashboard.js', 'testSrc/javascript/course_area.js']
//	      }
//	    }
	},
	clean: {
		options: { force: true },
		minCssSrc:[deployStaticDir+'/styles/']
	},
	concatMin:{
		jspSrc:{
//			 src: 'testDest/jsp',
			 src: jspDest+ '/',
	    	 ext: '.jsp', 
	    	 jsLocation: publicResourceSrc+'/javascript/lib',
	    	 concatJsDest:publicResourceSrc + '/javascript/concatJs',
	    	 uglifiedJsDest:publicResourceSrc+'/javascript/lib',
	    	 staticDomain:staticDomain
		}
	},
	changeSourceMapPath:{
		targetSrc:{
			staticSrc:deployStaticDir+'/javascript/lib',
			staticDomain:staticDomain
		}
	},
	findUselessImg:{
    	dist:{
			src:imgDir, 
			lessDir:localLessDir,
			localJspDir:'WebContent/WEB-INF/jsp/portal'
		}
	},
	cssmin: {
	  minify: {
	    expand: true,
	    cwd: deployStaticDir+'/styles/',
	    src: ['*.css'],
	    dest:deployStaticDir+'/styles/',
	    ext: '.min.css'
	  }
	},
	
	min: {
		files: {
	      src: [
	      '<%= project.prod.publicResource %>/javascript/lib/*.js'
	      ],
	      dest: 'test/'
	    }
	},
	    
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    
	mincss:{
		dist:{
			src: '<%= project.cssDir %>/*.css',
			dest: '<%= project.mincssDir %>/all.min.css'
		}
	},
	
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
    	 files: ['grunt.js', '<%= project.jsDir %>/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
    
  });

  // Default task.
  grunt.registerTask('prod', ['copy:jsp', 'less', 'replace', 'concatMin', 'replaceJspStatic', 'clean', 'copy:copyStatic', 'changeSourceMapPath']);
  grunt.registerTask('deploy', ['copy:jsp', 'less', 'replace', 'concatMin', 'replaceJspStatic', 'clean', 'copy:copyStatic', 'changeSourceMapPath','copy:depoyFront']);
  
  grunt.loadNpmTasks('grunt-contrib'); 
  grunt.loadNpmTasks('grunt-hashres');
  grunt.loadNpmTasks('grunt-smushit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.loadTasks( 'tasks');
};

