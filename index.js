"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var config = require('./config').configuration;
var app = express();
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/bootstrap-dark', express.static('node_modules\\@forevolve\\bootstrap-dark\\dist\\css'));
var listener = app.listen(8889, function () {
    console.log('Listening on port ' + listener.address().port);
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/command', function (req, res) {
    // const chatCommand = req.body.chatCommand;
    // let output = '';
    // const messageMock = MakeMessage(chatCommand, chat => (output += chat));
    // await chatCommandManager.Handle(messageMock.object);
    // output = cleanMarkdownCodeBreak(output, OutputType.JSON);
    // output = cleanMarkdownCodeBreak(output, OutputType.YAML);
    // res.send(output);
    res.send('Hello World!');
});
//# sourceMappingURL=index.js.map