let title = document.querySelector("#title");
let price = document.querySelector("#price");
let thumbnail = document.querySelector("#thumbnail");
let greeting = document.querySelector("#greeting");
let logout = document.querySelector("#logout");
let logoutMsg = document.querySelector("#logoutMsg");
let logoutContainer = document.querySelector("#logoutContainer");
let mainContainer = document.querySelector("#mainContainer");

let socket = io.connect();

socket.on("data", async (data) => {
    const res = await fetch("/api/auth/username", {
        method: "GET",
    });

    const response = await res.json();

    greeting.innerHTML = `Bienvenido ${response.userName}`;
    logoutMsg.innerHTML = `Hasta Luego ${response.userName}`;

    render(data);
});

const addProduct = async (e, form) => {
    e.preventDefault();
    await fetch(form.action, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });

    title.value = "";
    price.value = "";
    thumbnail.value = "";
    socket.emit("newProduct", "producto cargado!");
};

socket.on("addProduct", (data) => {
    render(data);
});

const render = (data) => {
    if (!data.error) {
        const html = `
    <div class="table-responsive">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Foto</th>
                    </tr>
                </thead>
                <tbody>
                ${data
                    .map((e) => {
                        return `
                    <tr>
                        <td>${e.title}</td>
                        <td>${e.price}</td>
                        <td>
                            <img src="${e.thumbnail}" alt="not found" width="50">
                        </td>
                    </tr>
                    `;
                    })
                    .join(" ")}
                </tbody>
            </table>
        </div>
    `;

        document.querySelector("#products").innerHTML = html;
    }
};

logout.addEventListener("click", async () => {
    await fetch("/api/auth/logout", {
        method: "GET",
    });

    logoutContainer.classList.remove("d-none");
    mainContainer.classList.add("d-none");

    setTimeout(() => {
        window.location.reload();
    }, 2000);
});
