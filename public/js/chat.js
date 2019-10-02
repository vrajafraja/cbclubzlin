const webToken = 'CBCLUBZLIN_CHAT_TOKEN';

class Chat {
    constructor() {
        this._showMessages();
        this._webToken = window.localStorage.getItem(webToken);
        if (!this._webToken) {
            window.localStorage.setItem(webToken, this._generateToken());
            this._webToken = window.localStorage.getItem(webToken);
        }
    }

    _generateToken() {
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    }

    async _loadMessages() {
        const response = await fetch('/api/messages');
        return await response.json();
    }

    async _showMessages() {
        const messages = await this._loadMessages();
        if (messages.length > 0) {
            for (var message of messages) {
                const line = this.createLineDOMElement(message);
                document.getElementById("messages").appendChild(line);
            }
        } else {
            const emptyMessage = document.createElement('p');
            emptyMessage.innerHTML = "Místo pro zanechání vzkazu. Zatím tu žádný není.";
            document.getElementById("messages").appendChild(emptyMessage);
        }
    }

    reloadMessages() {
        document.getElementById("messages").innerHTML = "";
        this._showMessages();
    }

    createLineDOMElement(lineData) {
        const line = document.createElement('div');
        line.className = 'message';
        if (lineData.webToken === this._webToken) {
            const deleteButton = document.createElement('button');
            deleteButton.name = lineData['id'];
            deleteButton.innerHTML = 'Smazat';
            deleteButton.className = 'message__delete-button';
            deleteButton.onclick = (e) => CHAT.deleteMessage(e);
            line.appendChild(deleteButton);
        }

        const date = document.createElement('div');
        date.innerHTML = new Date(lineData['date']).toLocaleDateString();
        date.className = 'message__date';
        line.appendChild(date);


        const name = document.createElement('div');
        name.innerHTML = lineData['author'];
        name.className = 'message__author';
        line.appendChild(name);

        const message = document.createElement('div');
        message.innerHTML = lineData['message'];
        message.className = 'message__message';
        line.appendChild(message);

        return line;
    }

    sendMessage(context) {
        const author = context.form[0].value;
        const message = context.form[1].value;
        if (author && message) {
            const data = { author, message, webToken: this._webToken };
            fetch('api/message', {
                method: 'POST', body: JSON.stringify(data), headers: {
                    'Content-Type': 'application/json'
                }
            }).then(resp => this.reloadMessages());
            context.form.reset();
        }
    }

    deleteMessage(e) {
        let id = e.target.name;
        fetch(`api/message/${id}`, { method: 'DELETE' }).then(response => this.reloadMessages());
    }
}

let CHAT = new Chat();
