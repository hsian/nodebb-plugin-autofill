'use strict';

var nbbRequire = module.parent.parent.require;
var topics = nbbRequire('./src/topics');
var crawler = require('./crawler');
var config = require('../config');

var http = require("http");
var path = require("path");
var url = require('url');
var Log = require("log");
var moment = require("moment");
var fs = require("fs");
var async = require('async');

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	/*
		Make sure the route matches your path to template exactly.

		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/

	res.render('admin/plugins/autofill',{});
};

Controllers.autofillPost = function(req, res, next){

	var data = { title: 'example',
	  content: 'example',
	  thumb: '',
	  cid: '1',
	  tags: [],
	  uid: 1,
	  req: 
	   { uid: 1,
	     params: undefined,
	     method: undefined,
	     body: undefined,
	     ip: '127.0.0.1',
	     host: '0.0.0.0:4567',
	     protocol: 'http',
	     secure: false,
	     url: 'http://0.0.0.0:4567/category/1/announcements',
	     path: '/category/1/announcements',
	     headers: 
	      { host: '0.0.0.0:4567',
		'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0',
		accept: '*/*',
		'accept-language': 'en-US,en;q=0.5',
		'accept-encoding': 'gzip, deflate',
		referer: 'http://0.0.0.0:4567/category/1/announcements',
		cookie: 'express.sid=s%3AcP39JOZXrzBqUKgTwWrtR8o9JqY_H6yF.MUZdYDS5L0tnlF%2BFxq4JHaV%2FcR%2Bno084vG3cmMEvIH8; io=_7KHdEYpnP38PPN4AAAA',
		connection: 'keep-alive' }
		 },
		timestamp: new Date().getTime()
	}

	var o = {
		url  :  req.body.url,
		title : req.body.title,
		content : req.body.content,
		gzip :  req.body.gzip
	}

	crawler(o,function(res){
		var $ = res.$;
		
		data.title = $(o.title).text();
		data.content = $(o.content).html();

		insertPost(data,$);
	})

	res.json("post success");
}

/*init folder*/
function initFolder(){
	var folder_img = path.join(__dirname.replace(config.BASE_DIR,config.IMG_DIR));
	var folder_log = path.join(__dirname.replace(config.BASE_DIR,config.LOG_DIR));
	
	_createFolder(folder_img);
	_createFolder(folder_log);

	function _createFolder(path){
		var exist = fs.existsSync(path);
		if(!exist){
			fs.mkdirSync(path);
		}
	}
}

/* insert post */
function insertPost(data,$){
	var images = $(data.content).find("img");
	var length = images.length;
	var index = 0;

	if(length){
		images.each(function(i,e){
			var url = $(e).attr("src");
			downloadImg(url,function(newurl){
				index++;
				data.content = data.content.replace(url,newurl) ;
				if(index == length){
					topics.post(data);
				}
			});
		});
	}else{
		topics.post(data);
	}

	insertLog(" NEW POST - " +  data.title);
}


var downloadImg = (function(){

	return function(url,fn){
		var newname = new Date().getTime() + url.substring(url.lastIndexOf('/') + 1, url.length);
		var filepath = config.IMG_DIR + newname;
		var dir = path.join(__dirname.replace(config.BASE_DIR,filepath));
  		var file = fs.createWriteStream( dir );
		var request = http.get(url,function(response){
			response.pipe(file);

			file.on("finish",function(){

				// callback
				fn(config.DISPLAY_DIR + newname)
				process.stdout.write("store success");
			})
		}).on("error",function(){
			process.stdout.write("store error");
		});
	}
}())

/**
* create and valify log file according today
*/

initFolder();

var insertLog = (function(){
	var filename = moment().format("YYYY-MM-DD") + ".log";
	var dir = path.join(__dirname.replace(config.BASE_DIR,config.LOG_DIR + filename));
	var isExsite = fs.existsSync(dir);

	if(isExsite){
		fs.renameSync(dir,dir + "_");
	}

	var log = new Log('info', fs.createWriteStream(dir));

	return function(){
		log.info(arguments[0]);
	}
	
}());

module.exports = Controllers;
