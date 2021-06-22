const socket = io()

function cleanForm() {
    const titleInput = document.getElementById('title')
    const priceInput = document.getElementById('price')
    const thumbnailInput = document.getElementById('thumbnail')

    titleInput.value = ""
    priceInput.value = ""
    thumbnailInput.value = ""
}

function send(e,form) {
    e.preventDefault();
    fetch(form.action, {
        method:'POST', 
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    socket.emit('post item', Object.fromEntries(new FormData(form)))
    cleanForm()
}

function addElementToTable(items) {
    const table = document.getElementById('table')
    table.innerHTML = `
            <table class="table table-dark">
                <tr> 
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>
                ${items.map((item) => `
                    <tr>
                        <td>${item.title}</td>
                        <td>$${item.price}</td>
                        <td><img width="50" src=${item.thumbnail} alt="not found"></td>
                    </tr>
                `).join("")}
            </table>
    `
}

function cleanMessageForm() {
    const messageTextInput = document.getElementById('message_text')

    messageTextInput.value = ""
}

function addMessage(e) {
    e.preventDefault();
    
    const email = document.getElementById('message_email')
    const text = document.getElementById('message_text')

    socket.emit('post message', {
        email: email.value,
        text: text.value,
        date: (new Date).toLocaleString("es-AR")
    })
    cleanMessageForm()
}

function addMessageToTable(messages) {
    const messagesTable = document.getElementById('messages')
    messagesTable.innerHTML = `
        ${messages.map((item) => `
            <div class="message-container">
                <p class="message-email">${item.email} </p>
                <span class="message-date">[${item.date}]:</span>
                <span class="message-text">${item.text}</span>
            </div>
        `).join("")}
    `

    messagesTable.scrollTop = messagesTable.scrollHeight - messagesTable.clientHeight;
}

function writeEmail(e, input) {
    if(input.value !== '') {
        const messageTextInput = document.getElementById('message_text')
        const messageSendButton = document.getElementById('message_send')

        messageTextInput.disabled = false
        messageSendButton.disabled = false
    }
}

socket.on('items', (items) => {
    addElementToTable(items)
})

socket.on('messages', (messages) => {
    addMessageToTable(messages)
})