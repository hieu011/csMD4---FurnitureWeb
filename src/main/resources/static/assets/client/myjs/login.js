let loginForm = $('#loginForm');

loginForm.validate({
    onkeyup: function (element) {
        $(element).valid();
    },
    onclick: false,
    onfocusout: false,
    rules: {
        username: {
            required: true
        },
        password: {
            required: true
        }
    },
    messages: {
        username: {
            required: "Nhập tên đăng nhập"
        },
        password: {
            required: "Nhập mật khẩu"
        }
    },
    showErrors: function (errorMap, errorList) {
        if (this.numberOfInvalids() > 0) {
            $("#loginForm .area-error")
                .removeClass("hide")
                .addClass("show");
        } else {
            $("#loginForm .area-error")
                .removeClass("show")
                .addClass("hide").empty();
            $("#loginForm input.error").removeClass("error");
        }
        this.defaultShowErrors();
    },
    submitHandler: () => {
        loginValid()
    }
})
loginValid = async () => {
    let username = $('#username').val();
    let password = $('#password').val();
    const data = {
        username: username,
        password: password,
    }
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        const jwtRes = await response.json();
        localStorage.setItem("idUser", jwtRes.id)
        localStorage.setItem("fullNameUser", jwtRes.fullName)
        window.location.href = '/home';
    }
}

loginForm.onsubmit = function (event) {
    event.preventDefault();
    loginForm.trigger("submit");
};

// async function submitLogin(event) {
//     event.preventDefault();
//     let username = $('#username').val();
//     let password = $('#password').val();
//     const data = {
//         username: username,
//         password: password,
//     }
//     const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//
//     if (response.ok) {
//         const jwtRes = await response.json();
//         localStorage.setItem("idUser", jwtRes.id)
//         localStorage.setItem("fullNameUser", jwtRes.fullName)
//         window.location.href = '/home';
//     }
// }
