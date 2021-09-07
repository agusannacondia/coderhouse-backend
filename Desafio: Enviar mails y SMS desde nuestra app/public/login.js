const login = async (e, form) => {
    e.preventDefault();
    await fetch(form.action, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
};

const loginWithFacebook = async () => {
    await fetch("/auth/facebook", {
        method: "GET",
        mode: "no-cors",
    })
        .then((res) => {
            console.log(res);
            if (res.redirected) {
                window.location.href = res.url;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
