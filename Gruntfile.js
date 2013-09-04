/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {//useles
      all: ['test/{grunt,tasks,util}/**/*.js']
    },
    qunit: {
        all: ['node_modules/grunt-contrib-qunit/test/**/*.html']
    },
    jshint: {
		files: ['testSrc/javascript/anonymous_dashboard_old.js'],
	    options: { 
	    	curly: true,
	        eqeqeq: true,
//	        immed: true,
//	        latedef: true, 
//	        newcap: true,
	        noarg: true,
	        sub: true,
	        undef: true,
	        boss: true,
	        eqnull: true,
	        browser: true,
	        globals: {
	    		jQuery: true
	    	}
//	        ignores: ['js/jquery.js']
	    }
    	
//      gruntfile: ['Gruntfile.js'],
//      libs_n_tests: ['lib/**/*.js', '<%= nodeunit.all %>'],
//      subgrunt: ['<%= subgrunt.all %>'],
//      options: {
//        curly: true,
//        eqeqeq: true,
//        immed: true,
//        latedef: true,
//        newcap: true,
//        noarg: true,
//        sub: true,
//        undef: true,
//        unused: true,
//        boss: true,
//        eqnull: true,
//        node: true,
//        es5: true
//      }
    },
    watch: {
      gruntfile: {
        files: ['<%= jshint.gruntfile %>'],
        tasks: ['jshint:gruntfile']
      },
      libs_n_tests: {
        files: ['<%= jshint.libs_n_tests %>'],
        tasks: ['jshint:libs_n_tests', 'nodeunit']
      },
      subgrunt: {
        files: ['<%= subgrunt.all %>'],
        tasks: ['jshint:subgrunt', 'subgrunt']
      }
    },
    subgrunt: {
      all: ['test/gruntfile/*.js']
    },
    less: {//ok
    	options: {
    		paths: ["testSrc/less"],
    		yuicompress: true
	    },
	    dynamic_mappings: {
	        files: [
	          {
	            expand: true,     // Enable dynamic expansion.
	            cwd: 'testSrc/less',      // Src matches are relative to this path.
	            src: ['*.less'], // Actual pattern(s) to match.
	            dest: 'testDest/css',   // Destination path prefix.
	            ext: '.css'   // Dest filepaths will have this extension.
	          },
	        ]
	    }
	},
	cssmin: {//compress css,ok
		add_banner: {
	    options: {
	    	banner: '/* My minified css file */'
	    },
	    files: {
	    	'testDest/test/output.css': ['testSrc/test/*.css']
	    }
	  }
	},
	copy: {//copy files and folders,ok
		main: {
			files: [
//		      {expand: true, src: ['testSrc/test/*'], dest: 'testDest/', filter: 'isFile'}, // includes files in path
//		      {expand: true, src: ['testSrc/jsp/**'], dest: 'testDest/'} // includes files in path and its subdirs
		      {expand: true, cwd: 'testSrc/jsp/', src: ['**'], dest: 'testDest/jsp'} // makes all src relative to cwd
//		      {expand: true, flatten: true, src: ['testSrc/**'], dest: 'testDest/', filter: 'isFile'} // flattens results to a single level
		    ]
		},
		copygif :{
			files: [
				{expand: true, cwd: 'testSrc/images', src: ['*.gif'], dest: 'testDest/images'}, // makes all src relative to cwd
			]
		}
	},
	compress: {//compress files and folders,ok
		  main: {
			  options: {
				  archive: 'archive.zip'
			  },
			  files: [
//		          {src: ['testSrc/javascript/*'], dest: 'compress/', filter: 'isFile'}, // includes files in path
//		          {src: ['path/**'], dest: 'internal_folder2/'}, // includes files in path and its subdirs
//		          {expand: true, cwd: 'path/', src: ['**'], dest: 'internal_folder3/'}, // makes all src relative to cwd
//		          {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
			  ]
		  }
	},
	concat: {//concatenate files,ok
	    options: {
	      separator: ';'
	    },
	    dist: {
	      src: ['testSrc/javascript/dashboard.js', 'testSrc/javascript/course_area.js', 'testSrc/javascript/createPm.js'],
	      dest: 'testDest/test/built.js'
	    }
	},
	uglify: {//minify files with uglify,ok
	    my_target: {
	      files: {
	        'testDest/test/output.min.js': ['testSrc/javascript/dashboard.js', 'testSrc/javascript/course_area.js']
	      }
	    }
	},
	imagemin: {// Task,minify the images,ok
	    dist: {                            // Target
	      options: {                       // Target options
	        optimizationLevel: 3
	      },
	      files: [
              {
                expand: true,     // Enable dynamic expansion.
                cwd: 'testSrc/images',      // Src matches are relative to this path.
                src: ['*.png'], // Actual pattern(s) to match.
                dest: 'testDest/images',   // Destination path prefix.
                ext: '.png',   // Dest filepaths will have this extension.
              },
              {
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'testSrc/images',      // Src matches are relative to this path.
                  src: ['*.jpg'], // Actual pattern(s) to match.
                  dest: 'testDest/images',   // Destination path prefix.
                  ext: '.jpg',   // Dest filepaths will have this extension.
              }
	      ],
	    }
	},
	concatMin:{
		jspSrc:{
			 src: 'testDest/jsp',
	    	 ext: '.jsp'
		}
	}
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  
  grunt.loadNpmTasks('grunt-contrib'); 
  grunt.loadNpmTasks('grunt-hashres');
  grunt.loadNpmTasks('grunt-smushit');
  
  grunt.loadTasks('tasks');
  
  // "npm test" runs these tasks
  grunt.registerTask('test', ['jshint', 'nodeunit', 'subgrunt']);
  
  //压缩png、jpg，并把gif复制到目标目录，因为gif没有压缩
  grunt.registerTask('minandcopy', ['imagemin', 'copy:copygif']);

  // Default task.
  grunt.registerTask('default', ['test']);
  grunt.registerTask('lesstest', ['less:production']);

  // Run sub-grunt files, because right now, testing tasks is a pain.
  grunt.registerMultiTask('subgrunt', 'Run a sub-gruntfile.', function() {
    var path = require('path');
    grunt.util.async.forEachSeries(this.filesSrc, function(gruntfile, next) {
      grunt.util.spawn({
        grunt: true,
        args: ['--gruntfile', path.resolve(gruntfile)],
      }, function(error, result) {
        if (error) {
          grunt.log.error(result.stdout).writeln();
          next(new Error('Error running sub-gruntfile "' + gruntfile + '".'));
        } else {
          grunt.verbose.ok(result.stdout);
          next();
        }
      });
    }, this.async());
  });

};
