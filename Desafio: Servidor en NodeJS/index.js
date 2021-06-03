var http = require("http")

var server = http.createServer((req, res) => {
    const id = Math.floor(Math.random() * (10 - 1)) + 1;
    res.end(JSON.stringify({
        id: id,
        title: `Producto ${id}`,
        price: Math.round(Math.random() * (10000 - 1) * 100) / 100,
        thumbnail: `Foto ${id}`
    }))
})

server.listen(3000, () => {
    console.log("Tu servidor esta listo")
})