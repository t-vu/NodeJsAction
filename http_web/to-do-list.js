/**
 * http://usejsdoc.org/
 */

var http = require("http");
var items = [];
var qs = require('querystring');

var server = http.createServer(function(req, res) {
//	console.log(req.url);
	if ("/" == req.url) {
		var method = req.method;
		switch (method) {
		case 'GET':
			show(res);
			break;
		case 'POST':
			add(req, res);
			break;
		default:
			res.statusCode = 400;
			res.end("Bad Request");
		}
	} else {
		res.statusCode = 404;
		res.end("File not found");
	}
})

server.listen(3000);

function show(res) {
	var html = '<html><head><title>Todo List</title></head><body>'
			+ '<h1>Todo List</h1>' + '<ul>' + items.map(function(item) {
				return '<li>' + item + '</li>'
			}).join('') + '</ul>' + '<form method="post" action="/">'
			+ '<p><input type="text" name="item" /></p>'
			+ '<p><input type="submit" value="Add Item" /></p>'
			+ '</form></body></html>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}

function add(req, res) {
	var body = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk) {
		body += chunk
	});
	req.on('end', function() {
		console.log(body);
		var obj = qs.parse(body);
		console.log(obj);
		items.push(obj.item);
		show(res);
	});
}

console.log("Server listening at 3000");