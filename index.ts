import * as express from 'express';
import { AddressInfo } from 'net';
import * as path from 'path';

const app = express();
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/bootstrap-dark', express.static('node_modules\\@forevolve\\bootstrap-dark\\dist\\css'));

const listener = app.listen(8889, function() {
    console.log('Listening on port ' + (listener.address() as AddressInfo).port);
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/command', async function(req, res) {
    // const chatCommand = req.body.chatCommand;
    // let output = '';
    // const messageMock = MakeMessage(chatCommand, chat => (output += chat));
    // await chatCommandManager.Handle(messageMock.object);
    // output = cleanMarkdownCodeBreak(output, OutputType.JSON);
    // output = cleanMarkdownCodeBreak(output, OutputType.YAML);
    // res.send(output);
});
