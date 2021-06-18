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

socket.on('items', (items) => {
    addElementToTable(items)
})