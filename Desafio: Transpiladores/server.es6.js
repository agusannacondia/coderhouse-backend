const express = require('express')
const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
    return res.send('Hello World!')
});

const server = app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`);
});

server.on('error', error => {
    console.log('Error: ', error);
});