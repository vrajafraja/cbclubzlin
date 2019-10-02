const fs = require('fs');
const path = require('path');
const express = require('express');
const formidable = require('express-formidable');

const app = express();
app.use(formidable());
const port = 3001;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')));

app.post('/api/message', async (req, res) => {
    const body = req.fields;
    const messages = getMessages();
    body.id = messages.length;
    body.date = new Date();
    messages.push(body);
    fs.writeFile('messages.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                throw err;
            }
            res.sendStatus(200);
        });
    });

app.delete('/api/message/:id', async (req, res) => {
    const body = req.fields;
    const id = req.params.id;
    const messages = getMessages();
    const updatedMessages = messages.filter(message => message.id != id );
    fs.writeFile('messages.json', JSON.stringify(updatedMessages, null, 2), (err) => {
            if (err) {
                throw err;
            }
            res.sendStatus(200);
        });
    });

app.get('/api/messages', (req, res) => {
    const messages = getMessages();
    res.send(JSON.stringify(messages.reverse(), null, 4)); 
});

function getMessages() {
    let messages = [];
    try {
        const rawData = fs.readFileSync('messages.json');
        messages = JSON.parse(rawData);
    } catch (err) {
        if (err.code !== "ENOENT") {
            throw err;
        }
    }
    return messages;
}
