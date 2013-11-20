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
			var concatJsDest = jspSrc.concatJsDest;
			var uglifiedJsDest = jspSrc.uglifiedJsDest;
			var staticDomain = jspSrc.staticDomain;
			var i = 1;
			
			grunt.file.recurse(jspSrc.src,function(abspath, rootdir, subdir, filename){
				 var extname = path.extname(filename);
				 var filenameWithoutExt = filename;
				 filenameWithoutExt = filenameWithoutExt.replace(extname,'');
				 if(extname === ext && filenameWithoutExt !== 'footer'){
					 try{
						 var destContents = fs.readFileSync(abspath, "UTF-8");
						 var jsContent = getMatches(destContents,/lib\/(.+).js.*?"/g, 1);
						 var concatedJs = [];
//						 grunt.log.ok(filename+':'+jsContent);
						 
						 if(jsContent.length > 0){
							 jsContent.forEach(function(t){
								 concatedJs.push(jsLocation + '/' + t + '.js'); 
							 });
//							 grunt.log.ok(concatedJs); 
							 grunt.config.set('concat.dist' + i + '.src',concatedJs);
							 grunt.config.set('concat.dist' + i + '.dest',concatJsDest+ '/' + filenameWithoutExt + '.js');
							 
//							 sourceMap set start.  create new map use function(path){return path.replace('.js','.map');}, the change use staticDomain + '/javascript/lib/' + filenameWithoutExt + 'MIN.map'
							 grunt.config.set('uglify.my_target' + i + '.options.sourceMap',function(path){return path.replace('.js','.map');});
//							 grunt.config.set('uglify.my_target' + i + '.options.sourceMap',staticDomain + '/javascript/lib/' + filenameWithoutExt + 'MIN.map');
							 grunt.config.set('uglify.my_target' + i + '.options.sourceMapRoot',staticDomain + '/javascript/concatJs/');
//							 sourceMap set end
							 
							 grunt.config.set('uglify.my_target' + i + '.src',concatJsDest+ '/' + filenameWithoutExt + '.js');
							 grunt.config.set('uglify.my_target' + i + '.dest',uglifiedJsDest + '/' + filenameWithoutExt + 'MIN.js');
						 	 
							 //in dev and prod environment,we can also store the uglified js files in javascript/lib
							 destContents = destContents.replace(/lib\/(.+).js.*?"/,'libmin/' + filenameWithoutExt + 'MIN.js"');
							 destContents = destContents.replace(/\<duobei:script.*?src="lib\/(.+).js.*?".*?\/\>/g,'');
							 destContents = destContents.replace(/\<script.*?src=".*?lib\/(.+).js.*?".*?\>\<\/script\>/g,'');
							 destContents = destContents.replace(/libmin\//g,'lib/'); 
							 
							 fs.writeFileSync(abspath, destContents, "UTF-8");
							 grunt.log.ok("concat js files of " + abspath + " success"); 
							 i = i+1;
							 
//							 if(i>200){
//								 grunt.task.run('concat');
//								 grunt.task.run('uglify');
//								 i = 1;
//							 }
						 }
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
	
	
	grunt.task.registerMultiTask('changeSourceMapPath','change sourceMappingUrl in .js files and source in .map files', function(){
		var staticSrc = grunt.config.get('changeSourceMapPath').targetSrc.staticSrc;
		var staticDomain = grunt.config.get('changeSourceMapPath').targetSrc.staticDomain;
		
		grunt.file.recurse(staticSrc,function(abspath, rootdir, subdir, filename){
			var extname = path.extname(filename);
			
			if(extname === '.map'){
				var destContents = fs.readFileSync(abspath, "UTF-8");
				var filenameWithoutExt = filename.replace(extname,'').replace('MIN','');
				
				destContents = destContents.replace(/\"sources\":\[\".*?\"\]/g,'"sources":["' + filenameWithoutExt + '.js"]');
				destContents = destContents.replace(/\"file\":\".*?\"/g,'"file":"' + filenameWithoutExt + 'MIN.js"');
				fs.writeFileSync(abspath, destContents, "UTF-8"); 
			}
			
			if(extname === '.js'){
				var destContents = fs.readFileSync(abspath, "UTF-8");
				var filenameWithoutExt = filename.replace(extname,'');
				
				destContents = destContents.replace(/sourceMappingURL=.*?\.map/g,'sourceMappingURL=' + staticDomain + '/javascript/lib/' + filenameWithoutExt + '.map');
				fs.writeFileSync(abspath, destContents, "UTF-8");
			}
			
		});
		
		grunt.log.ok("changeSourceMapPath finish");
	});
	
};