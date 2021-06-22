const fs = require('fs')

class Messages {

    #messages

    constructor() {
        this.#messages = [];
        try {
            fs.writeFile(`./storage/messages.json`,'[]', { flag:'wx' }, err => {
                console.log(err ? 'File already exists' : 'File has been created correctly')
            });
        } catch (error) {
            throw error
        }
    }

    async getMessages() {
        try {
            const data = await fs.promises.readFile('./storage/messages.json', 'utf-8')
            return JSON.parse(data);
        } catch (error) {
            throw new Error('No hay mensajes!')
        }
    }

    async addMessage(message) {
        try {
            const array = await this.getMessages()
            array.push(message)
            await fs.promises.writeFile('./storage/messages.json',JSON.stringify(array));
        } catch (error) {
            throw error
        }
    }
}

module.exports = {
  Messages
} 