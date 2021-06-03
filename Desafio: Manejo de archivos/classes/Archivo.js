const fs = require("fs")

class Archivo {

    #fileName

    constructor(fileName) {
        try {
            fs.writeFile(`./storage/${fileName}`, '[]', {flag:"wx"}, (err) => {
                if(err) {
                    console.log("El archivo ya existía en la base de datos")
                } else {
                console.log("El archivo no existía en la base de datos y fue generado con éxito")
                }
            })
            this.#fileName = `./storage/${fileName}`
        } catch (error) {
            console.log(error)
        }
    }

    async leer() {
        try {
            const contenido = await fs.promises.readFile(this.#fileName, 'utf-8')
            const array = JSON.parse(contenido)
            console.log(array)
        } catch (error) {
            console.log(error)
        }
    }

    async guardar(dato){
        try {
            const contenido = await fs.promises.readFile(this.#fileName, 'utf-8')
            const array = JSON.parse(contenido)
            array.push({
                ...dato,
                id: array[array.length - 1]?.id + 1 || 1
            })
            await fs.promises.writeFile(this.#fileName, JSON.stringify(array))
        } catch (error) {
            console.log(error)
        }
    }

    async borrar(){
        try {
            await fs.unlink(this.#fileName, err => {
                throw err
            })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Archivo