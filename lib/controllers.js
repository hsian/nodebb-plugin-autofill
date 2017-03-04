'use strict';

var nbbRequire = module.parent.parent.require;
var topics = nbbRequire('./src/topics');
var crawler = require('./crawler');
var url = require('url');

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
		gzip :  req.body.gzip || false
	}

	crawler(o,function(res){
		var $ = res.$;
		
		data.title = $(o.title).text();
		data.content = $(o.content).html();

		topics.post(data);
	})

	res.json("post success");
}

module.exports = Controllers;
