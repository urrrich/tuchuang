var express = require('express');
var router = express.Router();

var Imagemin = require('imagemin')
var formidable = require('formidable')
var fs = require('fs')
var archiver = require('archiver')
//tinypng
/*
var tinify = require("tinify")
tinify.key = ''
*/

var staticDir = 'output/'
var uploadTempDir = 'upload_temp/'
var uploadDir = staticDir + 'upload/'
var zipDir = staticDir + 'zip/'

router.post('/upload',function(req, res, next){

    var form = new formidable.IncomingForm();
    form.keepExtensions = true
    if (!fs.existsSync(uploadTempDir)) {
        fs.mkdirSync(uploadTempDir)
    }
    form.uploadDir = uploadTempDir;
    form.parse(req, function(error, fields, files) {
        if(error){
            return res.send({code:1})
        }
        var file = files.file
        var output = file.path.replace(/\\/,'/')
        output = output.replace(uploadTempDir,uploadDir)
        output = output.replace(staticDir,'')

        var imgmin = new Imagemin()
        .src(file.path)
        .dest(uploadDir)
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

router.get('/download',function(req, res, next){
    var q = req.query
    var filepath = q.p
    var filename = q.n
    if(filename && filepath){
        res.setHeader('Content-disposition', 'attachment; filename=' + filename)
        var filestream = fs.createReadStream(staticDir + filepath)
        filestream.on('data', function(chunk) {
            res.write(chunk)
        });
        filestream.on('end', function() {
            res.end()
        });
    }else{
        res.send('check your params')
    }
})

router.post('/downloadzip',function(req, res, next){
    var files = JSON.parse(req.body.q)
    var zippath = zipDir + Date.now() + '.zip'
    var output = fs.createWriteStream(zippath)
    var archive = archiver('zip')
    archive.on('end',function(){
        res.send({
            code: 0,
            url: zippath.replace(staticDir,'')
        })
    })
    archive.pipe(output)
    files.forEach(function(e){
        archive.append(fs.createReadStream(staticDir + e.p),{name:e.n})
    })
    archive.finalize()
})

module.exports = router;
