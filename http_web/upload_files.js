/**
 * http://usejsdoc.org/
 */

var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function(req, res) {
	switch (req.method) {
	case 'GET':
		show(req, res);
		break;
	case 'POST':
		upload(req, res);
		break;
	}
});

function show(req, res) {
	var html = ''
			+'<meta http-equiv="Content-Type" content="text/html; charset=iso-2022-jp">'
			+ '<form method="post" action="/" enctype="multipart/form-data">'
			+ '<p><input type="text" name="name" /></p>'
			+ '<p><input type="file" name="file" /></p>'
			+ '<p><input type="submit" value="Upload" /></p>' + '</form>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}
function upload(req, res) {
	if(!isFormData(req)){
		res.statusCode = 400;
		res.end('Bad Request: expecting multipart/form-data');
		return ;
	}
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		console.log(fields);
		console.log(files);
//		files.pipe(res);
		res.end("Upload completed");
	});
	form.on("progress", function(bytesReceived, bytesExpected){
		console.log(bytesReceived + " vs " + bytesExpected);
		var percent = Math.floor(bytesReceived / bytesExpected * 100);
		console.log(percent);
	})
}

function isFormData(req) {
	var type = req.headers["content-type"] || "";
	return 0 == type.indexOf('multipart/form-data');
}

server.listen(3000);
console.log("server now listening at 3000...");