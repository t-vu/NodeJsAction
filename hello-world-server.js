/*
 var http = require('http');
 http.createServer(function handler(req, res) {
 res.writeHead(200, {
 'Content-Type' : 'text/plain'
 });
 res.end('Hello World\n');
 }).listen(1337, '127.0.0.1');
 console.log('Server running at http://127.0.0.1:1337/');

 var net = require('net');
 var server = net.createServer(function(socket) {
 socket.once('data', function(data) {
 socket.write("echo " + data);
 });
 });
 server.listen(8888);

 var EventEmitter = require("events").EventEmitter;
 var channel = new EventEmitter();

 channel.on("join", function() {
 console.log("hello");
 });
 channel.emit("join");

*/

var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('join', function(id, client) {
	//console.log("JOINED EVENT ");
	this.clients[id] = client;
	//console.log(this.clients);
	this.subscriptions[id] = function(senderId, message) {
		if (id != senderId) {
			this.clients[id].write(message);
		}
		console.log("subcription: "+ message);
	}
	//add eventlistener to array of event listeners
	this.on('broadcast', this.subscriptions[id]);

});

// server 遶九■荳翫￡繧� -> client will first fire "connection" event, then "data" next
var server = net.createServer(function(client) {
	var id = client.remoteAddress + ':' + client.remotePort;
	//console.log(id);
	channel.emit('join', id, client);
	client.on('connect', function() {
		console.log("connected");
		//channel.emit('join', id, client);
	});
	client.on('data', function(data) {
		data = data.toString();
		console.log("DATA ON 9999 " +data);
		channel.emit('broadcast', id, data);
	});
});
server.listen(9999);


var net = require('net');

var HOST = '127.0.0.1';
var PORT = 9999;

var client = new net.Socket();
client.connect( PORT,HOST, function() {

	//console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	// Write a message to the socket as soon as the client is connected, the
	// server will receive it as message from the client
	//client.write('I am Chuck Norris!');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {

	//console.log('DATA: ' + data);
	// Close the client socket completely
	//client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
	//console.log('Connection closed');
});



/*
 * Example take from github
 In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
 server, but for some reason omit a client connecting to it.  I added an 
 example at the bottom.
 Save the following server in example.js:
 */

/*
var net = require('net');

var server = net.createServer(function(socket) {
//	console.log(socket);
	socket.write('Echo server\r\n');
//	socket.pipe(socket);
	socket.on('data', function(data) {
		console.log('Received on server: ' + data);
		socket.write(reverse(data));
		//client.destroy(); // kill client after server's response
	});
});

server.listen(1337, '127.0.0.1');

*/

/*
 * And connect with a tcp client from the command line using netcat, the *nix
 * utility for reading and writing across tcp/udp network connections. I've only
 * used it for debugging myself. $ netcat 127.0.0.1 1337 You should see: > Echo
 * server
 */

/*
 * Or use this example tcp client written in node.js. (Originated with example
 * code from http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.)
 */

/*
var net = require('net');

var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received in client: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
*/
// s is Buffer, convert to string first !
function reverse(s){
	//console.log(s);
    return s.toString().split("").reverse().join("");
}

//require("./Nimble_ex.js");

//require("./random_story.js");
//require("./word_count.js");
//require("./http_web/static_file_server.js");

//require("./http_web/to-do-list.js");
require("./http_web/upload_files.js");
