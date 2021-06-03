const Archivo = require("./classes/Archivo");

(async () => {
    // Instancio la clase con el nombre del archivo que voy a usar
    let archivo = new Archivo("personas2.txt")

    // Leo el archivo
    await archivo.leer();
    
    // Guardo un objeto
    await archivo.guardar({
        title: "Cartuchera",
		price: 123.45,
		thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    })

    // Leo el archivo nuevamente
    await archivo.leer();

    // Lo elimino
    // await archivo.borrar()
})()