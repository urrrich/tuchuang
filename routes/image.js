var express = require('express');
var router = express.Router();

var Imagemin = require('imagemin')
var formidable = require('formidable')
var fs = require('fs')
/*
router.post('/upload',function(req, res, next){   
  var files = []
  var form = formidable.IncomingForm()
  form.keepExtensions = false
  form.uploadDir = 'upload'
  form.maxFieldsSize = 2*1024*1024
  form.multiples = true

  form.on('file', function(field, file) {
    if(file.name){  
      files.push(file)
      //fs.renameSync(file.path,'upload/'+file.name)
      new Imagemin().src(file.path).dest('upload/').run(function(err,files){ 
        console.log(files[0])     
      })
    }else{  
      fs.unlink(file.path)
    }
  })
  form.on('progress',function(bytesReceived,bytesExpected){ 
      
  })
  form.on('end',function(){ 
    var result = {}
    if(files.length){ 
      result.message = "upload success"
    }else{  
      result.message = "please choose a pic"
      result.error = true
    }
    res.send(result)
  })
  form.on('error',function(err){  

  })
  form.parse(req)
})
*/

router.post('/upload',function(req, res, next){     
    var form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.uploadDir = "upload/";
    form.parse(req, function(error, fields, files) {
        var file = files.file
        new Imagemin().src(file.path).dest('upload/').run(function(err,files){ 
               
        })
  });
})

module.exports = router;
