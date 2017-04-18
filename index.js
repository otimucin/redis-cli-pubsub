var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require("redis");
var redisClient = redis.createClient(32768);

app.use(express.static(__dirname + '/node_modules'));  

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

var clients = [];

redisClient.subscribe("ozgun");

redisClient.on("message", function(channel, message) {
    for(i = 0; i < clients.length; i++){
        let client = clients[i];
        client.emit("broad", message);
    }    
});

io.on('connection', function(client) {  
   clients.push(client);
});

server.listen(3500);  