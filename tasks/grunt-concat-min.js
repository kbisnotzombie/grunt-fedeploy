var fs = require('fs');
var path = require('path');

function getMatches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

module.exports = function(grunt){
	
	grunt.task.registerMultiTask('concatMin','concat js files and minify the concated files', function(){
		var jspSrc = grunt.config.get('concatMin').jspSrc;
		
//		jspSrc.forEach(function(f){
			var ext = jspSrc.ext;
			var jsLocation = jspSrc.jsLocation;
			var i = 1;
			
			grunt.file.recurse(jspSrc.src,function(abspath, rootdir, subdir, filename){
				 var extname = path.extname(filename);
				 var filenameWithoutExt = filename;
				 filenameWithoutExt = filenameWithoutExt.replace(extname,'');
				 if(extname == ext){
					 try{
						 var destContents = fs.readFileSync(abspath, "UTF-8");
						 var jsContent = getMatches(destContents,/lib\/(.+).js.*?"/g, 1);
						 var concatedJs = [];
						 
						 //not set js src and uglified path
						 jsContent.forEach(function(t){
							 concatedJs.push('testSrc/javascript/' + t + '.js'); 
						 });
						 grunt.log.ok(concatedJs); 
						 grunt.config.set('concat.dist' + i + '.src',concatedJs);
						 grunt.config.set('concat.dist' + i + '.dest','testDest/javascript/' + filenameWithoutExt + '.js');
						 grunt.config.set('uglify.my_target' + i + '.src','testDest/javascript/' + filenameWithoutExt + '.js');
						 grunt.config.set('uglify.my_target' + i + '.dest','testDest/javascript.min/' + filenameWithoutExt + 'MIN.js');
					 	 
						 //in dev and prod environment,we can store the uglified js files in javascript/minlib
						 destContents = destContents.replace(/\<duobei\:script.*?src="lib\/(.+).js.*?".*?\/\>/,'<script type="text/javascript" src="' + jsLocation + '/minlib/' + filenameWithoutExt + 'MIN.js" charset="utf-8"></script>');
						 destContents = destContents.replace(/\<duobei:script.*?src="lib\/(.+).js.*?".*?\/\>/g,'');
						 destContents = destContents.replace(/\<script.*?src=".*?lib\/(.+).js.*?".*?\>\<\/script\>/g,'');
						 destContents = destContents.replace(/\/minlib\//,'/lib/');
						 
						 fs.writeFileSync(abspath, destContents, "UTF-8");
						 grunt.log.ok("concat js files of " + abspath + " success"); 
						 i = i+1;
					 }
					 catch(e){
						 grunt.log.error("compile js files of " + abspath + " fail");
					 }
				 }
			 });
//		});
		
		grunt.task.run('concat');
		grunt.task.run('uglify');
		grunt.log.ok("concat and minify js finish");
	});
};