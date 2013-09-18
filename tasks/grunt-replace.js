var fs = require('fs');
var path = require('path');
var utils = require('./hashresUtils');

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
	grunt.task.registerMultiTask('replace','replace function use replace token', function(){
		var dist = grunt.config.get('replace').dist;
		dist.forEach(function(f){
			var ext = f.ext,
				replacetoken = f.replacetoken,
				replacevalue = f.replacevalue;
			
			grunt.file.recurse(f.src,function(abspath, rootdir, subdir, filename){
				 var extname = path.extname(filename);
				 console.log(extname);
				 console.log(replacetoken);
				 console.log(replacevalue);
				 if(extname == ext){
					 var destContents = fs.readFileSync(abspath, "UTF-8");
					 var regexp = new RegExp(replacetoken,"g");
					 destContents = destContents.replace(regexp, replacevalue);
					 fs.writeFileSync(abspath, destContents, "UTF-8");
					 grunt.log.ok("write file " + abspath + " success");
				 }
			 });
		});
	});
	
	grunt.task.registerMultiTask('replaceJspStatic','replaceJspStatic replace jsp file to file path', function(){
		var dist = grunt.config.get('replaceJspStatic').dist;
		var lessBuildCssDir = grunt.config.get('replaceJspStatic').lessDist;
		var jsDir = grunt.config.get('replaceJspStatic').jsDist;
		var staticDomain = grunt.config.get('replaceJspStatic').staticDomain;
		
		dist.forEach(function(f){
			var ext = f.ext;
			
			grunt.file.recurse(f.src,function(abspath, rootdir, subdir, filename){
				 var extname = path.extname(filename);
				 if(extname == ext){
					 try{
						 var destContents = fs.readFileSync(abspath, "UTF-8");
						 
						 destContents = destContents.replace(/less\/(\w+).(less|css).*?"/g, 'static/styles/$1.css"')
						                            .replace(/static\/styles\/(\w+).(less|css).*?"/g,'static/styles/$1.css"')
						 							.replace(/src="lib\/(.+).js.*?"/g, 'src="lib/$1.js"')
						 							.replace(/stylesheet\/less/g,'stylesheet'); 
						 var lessContent = getMatches(destContents,/static\/styles\/(\w+).(less|css).*?"/g, 1);
						 var jsContent = getMatches(destContents,/lib\/(.+).js.*?"/g, 1);
						 
						 lessContent.forEach(function(t){
							 var hashCode = utils.md5(lessBuildCssDir+ '/' + t + '.css').slice(0, 10);
							 destContents = destContents.replace(t + '.css', t + '.min.css?v=' + hashCode);
						 });
						 destContents = destContents.replace(/static\/styles\//g,'').replace('${duobei_styles}',staticDomain+ '/styles');
						 
						 jsContent.forEach(function(t){
							 var hashCode = utils.md5(jsDir+ '/' + t + '.js').slice(0, 8);
							 destContents = destContents.replace("lib/"+ t + '.js', "lib/"+ t + '.js?v=' + hashCode);
						 });
						 
						 fs.writeFileSync(abspath, destContents, "UTF-8");
						 grunt.log.ok("write file " + abspath + " success");
					 }
					 catch(e){
						 grunt.log.error("write file " + abspath + " fail");
					 }
				 }
			 });
		});
		
		grunt.log.ok("replaceJspStatic finish");
	});
	
	grunt.task.registerMultiTask('findUselessImg','a function that find out useless images', function(){
		var dist = grunt.config.get('findUselessImg').dist;
		var uselessNum = 0;
		var imgNum = 0;
		
		grunt.file.recurse(dist.src,function(abspath, rootdir, subdir, filename){
			var extname = path.extname(filename);
			var imgName = filename;
			var useful = false;
			
			imgNum++;
			if(extname === '.png' || extname === '.jpg' || extname === '.gif'){//if the file is image
				grunt.file.recurse(dist.lessDir,function(abspath, rootdir, subdir, filename){
					var contents = fs.readFileSync(abspath, "UTF-8");
					var matchResult = contents.match(imgName);
					if(matchResult){
						useful = true;
					}
				}); 
				
				grunt.file.recurse(dist.localJspDir,function(abspath, rootdir, subdir, filename){
					var contents = fs.readFileSync(abspath, "UTF-8");
					var matchResult = contents.match(imgName);
					if(matchResult){
						useful = true;
					}
				});
			}
			else{//if the file isnot image
				useful = true;
			}
			if(!useful){
				uselessNum = uselessNum + 1;
				fs.unlinkSync(dist.src + '/' + filename);
				grunt.log.ok(imgName + " is useless,has been deleted");
			}
		});
		
		grunt.log.ok(imgNum + " images exist");
		grunt.log.ok(uselessNum + " images are useless");
	});
};