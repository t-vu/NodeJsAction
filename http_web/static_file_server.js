/**
 * http://usejsdoc.org/
 */

var http = require("http");
var parse = require("url").parse;
var join = require("path").join;
var fs = require("fs");

var root = __dirname;

var server = http.createServer(function(req, res) {
	var url = parse(req.url);
	var path = join(root, url.pathname);
	console.log(path);

	fs.stat(path, function(err, stat) {
		if (err) {
			if ('ENOENT' == err.code) {
				res.statusCode = 404;
				res.end("File Not Found");
			} else {
				res.statusCode = 500;
				res.end("Server Internal Error");
			}
		} else {
			res.setHeader("Content-Length", stat.size);
			var stream = fs.createReadStream(path);
			req.pipe(fs.createWriteStream('./req-body.txt'))
			// stream emits data event when it read data from the specified
			// path.
			stream.on("data", function(chunked) {
				res.write(chunked);

			})
			stream.on("end", function() {
				res.end();
			})
			stream.on("error", function() {
				res.statusCode = 500;
				res.end("Server Internal Error");
			});
		}
	})

});

server.listen(3000);
//var readStream = fs.createReadStream(__dirname + "/" + "original.txt");
//var writeStream = fs.createWriteStream(__dirname + "/" + "copy.txt");
//readStream.pipe(writeStream);

console.log("server listening at 3000...");