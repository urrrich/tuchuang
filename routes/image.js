var express = require('express');
var router = express.Router();

var Imagemin = require('imagemin')
var formidable = require('formidable')
var fs = require('fs')
//tinypng
/*
var tinify = require("tinify")
tinify.key = 'GhNK2t4QbD1VelTSJxHzo1oNEVNYNteH'
*/

var uploadTempDir = 'upload_temp'
var uploadDir = 'upload'

router.post('/upload',function(req, res, next){ 

    var form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.uploadDir = uploadTempDir;
    form.parse(req, function(error, fields, files) {
        if(error){  
            return res.send({code:1})    
        }
        var file = files.file
        var dest = uploadDir
        var output = file.path.replace(uploadTempDir,uploadDir)
        
        var imgmin = new Imagemin()
        .src(file.path)
        .dest(dest)
        .use(Imagemin.jpegtran({progressive: true}))
        .use(Imagemin.gifsicle())
        .use(Imagemin.optipng({optimizationLevel: 3}))
        .run(function(err, data){    
            if(err){    
                return res.send({code:1})                     
            }
            res.send({  
                code:0,
                input: {    
                    size: file.size,
                    type: file.type
                },
                output: {
                    size: data[0].contents.length,
                    type: file.type,
                    name: file.name,
                    url: output
                }
            })
       })
           
    });
})

router.post('/download',function(req, res, next){ 
    
})

router.post('/downloadzip',function(req, res, next){    
    
})

module.exports = router;
