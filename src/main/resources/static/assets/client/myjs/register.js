let registerForm = $('#registerForm');

registerForm.validate({
    onkeyup: function (element) {
        $(element).valid()
    },
    onclick: false,
    onfocusout: false,
    rules: {
        fullName: {
            required: true,
            minlength:5
        },
        phoneNumber: {
            required: true,
            number:true
        },
        email: {
            required: true,
            email:true
        },
        address: {
            required: true,
            minlength:5
        },
        username: {
            required: true,
            minlength:5
        },
        password: {
            required: true,
            // password:true
        }

    },
    messages: {
        fullName: {
            required: 'Vui lòng nhập tên',
            minlength: 'Tối thiểu 5 kí tự'
        },
        phoneNumber: {
            required: 'Vui lòng nhập số điện thoại',
            number: 'Vui lòng nhập đúng kí tự số'
        },
        email: {
            required: 'Vui lòng nhập email',
            email: 'Vui lòng nhập đúng định dạng email'
        },
        address: {
            required: 'Vui lòng nhập địa chỉ',
            minlength: 'Tối thiểu 5 kí tự'
        },
        username: {
            required: 'Vui lòng nhập tên đăng nhập',
            minlength: 'Tối thiểu 5 kí tự'
        },
        password: {
            required: 'Vui lòng nhập mật khẩu',
            // password: 'Mật khẩu phải chứa ít nhất một số và một ký tự và dài ít nhất 6 ký tự'
        }
    },
    showErrors: function (errorMap, errorList) {
        if (this.numberOfInvalids() > 0) {
            $("#registerForm .area-error")
                .removeClass("hide")
                .addClass("show");
        } else {
            $("#registerForm .area-error")
                .removeClass("show")
                .addClass("hide").empty();
            $("#registerForm input.error").removeClass("error");
        }
        this.defaultShowErrors();
    },
    submitHandler: () => {
        registerValid()
    }
})


registerValid = async () => {
    let fullName = $('#fullName').val();
    let phoneNumber = $('#phoneNumber').val();
    let email = $('#email').val();
    let username = $('#username').val();
    let password = $('#password').val();
    let address = $('#address').val();

    const data = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        username: username,
        password: password,
        address: address,
    }
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    console.log(response)
    if (response.ok) {

        webToast.Success({
            status: `Đăng kí tài khoản thành công`,
            message: '',
            delay: 2000,
            align: 'topright'
        });
        registerForm[0].reset();
    }
}

registerForm.onsubmit = function (event) {
    event.preventDefault();
    registerForm.trigger("submit");
}
