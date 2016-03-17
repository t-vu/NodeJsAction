/**
 * http://usejsdoc.org/
 */
var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

var photos = [];
photos.push({
	name : 'Node.js Logo',
	path : 'http://nodejs.org/images/logos/nodejs-green.png'
});
photos.push({
	name : 'Ryan Speaking',
	path : 'http://nodejs.org/images/ryan-speaker.jpg'
});


exports.list = function(req, res, next) {
	Photo.find({}, function(err, photos) {
		console.log(photos)
		if (err)
			return next(err);
		res.render('photos/index', {
			title : 'Photos',
			photos : photos
		});
	});
};

exports.form = function(req, res) {
	res.render("photos/upload", {
		title : "Photo Upload"
	})
}

var multer = require("multer");
var storage = multer.diskStorage({
	destination : function(req, file, cb) {
		cb(null, './public/photos')
	},
	filename : function(req, file, cb) {
		cb(null, file.originalname)
	}
})
var upload = multer({
	storage : storage
})

exports.submit = function(dir) {
	return function(req, res, next) {
		var img = req.file;
		console.log(img);
		var name = req.body.photo.name || img.fieldname;
		console.log(name);
		Photo.create({
			name : name,
			path : "/photos/"+img.filename,
		}, function(err) {
			if (err)
				return next(err);
			res.redirect('/photos');
		});
	};
};
exports.upload = upload.single('photo[image]');