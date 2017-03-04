'use strict';

var Crawler = require("crawler");

function craw(opt,callback){
    var o = opt || {};
    var c = new Crawler({});

    c.queue([{
            uri: o.url,
            gzip : o.gzip,
            callback: function(error,res,done) {
                if(error){
                    console.log(error);
                }else{
                    callback(res)
                }

                done();
            }
    }]);
}

module.exports = craw;

