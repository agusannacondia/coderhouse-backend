const fs = require('fs')

class JSON {

    #path

    constructor(path = "") {
        this.#path = path
    }

    getJSONFromFile() {
        fs.readFile(this.#path, 'utf8', (err, jsonString) => {
            if (err) {
                return { error: err }
            }
            try {
                const json = JSON.parse(jsonString)
                return json
        } catch(err) {
                return { error: err }
            }
        })
    }

    saveJSONIntoFile(json) {
        fs.readFile(this.#path, 'utf8', (err, jsonArray) => {
            if (err) {
                return { error: err }
            }
            try {
                const array = JSON.parse(jsonArray)
                array.push(json)
                fs.writeFile(this.#path, 'utf8', JSON.stringify(array), function (err) {
                    return { error: err }
                  });
        } catch(err) {
                return { error: err }
            }
        })
    }
}

module.exports = {
  JSON
} 