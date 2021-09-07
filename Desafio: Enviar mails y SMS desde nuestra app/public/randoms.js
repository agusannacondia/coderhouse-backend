process.on("message", ({ cant }) => {
    let res = [];
    console.log(process.argv.join(" - "));

    for (let i = 0; i < cant; i++) {
        let randomNumber = Math.floor(Math.random() * 1000) + 1;
        if (!res.includes(randomNumber)) {
            res[randomNumber] = 1;
        } else {
            res[randomNumber]++;
        }
    }

    process.send(res);
});
