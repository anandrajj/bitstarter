#!/usr/bin/env node
var rest = require('restler');
var cheerio = require('cheerio');
var program = require('commander');
var fs = require('fs');
var HTMLURL_DEFAULT = 'http://limitless-falls-8683.herokuapp.com';
var CHECKSFILE_DEFAULT = 'checks.json';
var HTMLFILE_DEFAULT = 'index.html';


var checkHtmlUrl = function(htmlurl, checksfile) {
rest.get(htmlurl.toString()).once('complete', function(result){
   if(!(result instanceof Error)){
    $ = cheerio.load(result);
    var checks = JSON.parse(fs.readFileSync(checksfile));
    var out ={};
    for(var ii in checks){
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
       }
    console.log(out);
    }
});
};

var assertUrlExists = function(htmlurl) {
    rest.get(htmlurl.toString()).once('complete', function(result, response){
     if(result instanceof Error || response.statusCode != 200){process.exit(1);}
    }
);
  return htmlurl.toString();
};

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    return fn.bind({});
};


if(require.main == module) {
   console.error('Inside the code');
   program
      .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
      .option('-u, --url <url_line>', 'Url link to htlml', clone(assertUrlExists))
     .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
      .parse(process.argv);
    if(program.file){
      console.log('Detected file');
      var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    }
    if(program.url){
      console.log('Detected Url');
      checkHtmlUrl(program.url,program.checks);
    }
}else {
  exports.checkHtmlUrl = checkHtmlUrl;
}
