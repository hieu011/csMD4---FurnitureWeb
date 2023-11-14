let inputFullName = document.getElementById('fullName');
let inputPhoneNumber = document.getElementById('phoneNumber');
let inputEmail = document.getElementById('email');
let inputAddress = document.getElementById('address');
let inputUsername = document.getElementById('username');
let inputPassword = document.getElementById('password');


function createInput(props) {
    return `<div class="mb-3">
                <input class="form-control" 
                id="${props.name}"
                type="${props.type || 'text'}" name="${props.name}"
                ${props.pattern ? `pattern="${props.pattern}"` : ""} 
                value="${props.value || ''}"
                ${props.required ? `required="${props.required}"` : ''} 
                />
                <span class="error form-text"></span>
            </div>`
}

function createSelect(props) {
    let optionsStr = "";
    console.log(props.options)
    props.options.forEach(e => {
        if(e.value == props.value){
            optionsStr += `<option value="${e.value}" selected>${e.name}</option>`;
        }else{
            optionsStr += `<option value="${e.value}">${e.name}</option>`;
        }

    })

    return `<div "${props.classContainer || ''}">
                <label class="${props.classLabel || ''} form-label">${props.label}</label>
                <select class="input-custom form-control ${props.classSelect || ''}" 
                type="${props.type || 'text'}" name="${props.name}" 
                ${props.pattern ? `pattern=${props.pattern}` : ""} 
                value="${props.value}"
                ${props.required ? 'required' : ''}>
                    <option value>---Choose---</option>
                    ${optionsStr}
                </select>
                <span class="error ${props.classError || ''} form-text"></span>
            </div>`
}

function createFieldForm(props) {
    if (props.type === 'select') {
        return createSelect(props);
    }
    return createInput(props);
}
const onFocus = (formBody, index) => {
    const inputsForm = formBody.querySelectorAll('.input-custom')
    inputsForm[index].setAttribute("focused", "true"); // add 1 attribute focused=true.
}
function renderForm(formBody, inputs) {

    formBody.innerHTML = ""; //clear ô input cũ
    inputs.forEach((input) => {
        formBody.innerHTML += createFieldForm(input); //gen từng ô input mới
    })

    const inputElemments = formBody.querySelectorAll('.input-custom');

    // add sự kiện onFocus
    for (let i = 0; i < inputElemments.length; i++) {
        inputElemments[i].onblur = function () {
            onFocus(formBody, i)
            validateInput(inputs.at(i), inputElemments[i], i)
        }
        inputElemments[i].oninput = function () {
            validateInput(inputs.at(i), inputElemments[i], i)
        }
    }

}

document.addEventListener('invalid', (function () {
    return function (e) {
        e.preventDefault(); // chặn popup của html5
        e.target.onblur(); // call onblur của tất cả các ô input
    };
})(), true);
function validateInput(inputProp, inputElement, index) {
    const { validate, messageRequired, message, messageCustom } = inputProp;
    let error = document.getElementsByClassName('error')[index];
    const value = inputElement.value.trim();

    if (inputElement.required && value === '') {
        if(inputProp.type == 'select'){
            error.innerHTML = messageRequired;
            return;
        }
        error.innerHTML = 'This field is required!';
        return;
    }
    let errormessage = message;
    const inputPattern = new RegExp(inputElement.pattern);
    const isMatch = inputPattern.test(value)
    if( !isMatch ){
        error.innerHTML = errormessage;
    } else {
        error.innerHTML = "";
    }
}
function getDataFromForm(event, form) {
    event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}


function getDataFromForm(form) {
    // event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}

function onChangeSelect2(selector, value){
    const element = $(selector);
    element.val(value);
    element.change();
}

function getDataInput() {
    return [
        {
            name: 'fullName',
            placeholder:'FullName',
            required: true,
            pattern: "^[A-Za-zÀ-Ỷà-ỷẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯưỨứỪừỰựỬửỮữỨứỬửỰựỦủỤụỠỡỞởỢợỞởỚớỔổỒồỐốỎỏỊịỈỉỌọỈỉỊịỆệỄễỀềẾếỂểỈỉỄễỆệỂểỀề0-9 ,.()]{6,100}",
            message: "Fullname must have minimum is 6 characters and maximum is 100 characters",
        },
        {
            name: 'phoneNumber',
            placeholder:'PhoneNumber',
            required: true,
            pattern: "^(0?)(3[1-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$",
            message: "Phone number must have 10 numbers or 9 numbers without 0",
        },
        {
            name: 'email',
            placeholder:'Email',
            pattern: "/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})*$/\n",
            message: 'Enter a valid email!! Example: hieu011@gmail.com',
            required: true
        },
        {
            name: 'address',
            placeholder:'Address',
            pattern: "[1-9][0-9]{1,10}",
            message: '^[A-Za-zÀ-Ỷà-ỷẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯưỨứỪừỰựỬửỮữỨứỬửỰựỦủỤụỠỡỞởỢợỞởỚớỔổỒồỐốỎỏỊịỈỉỌọỈỉỊịỆệỄễỀềẾếỂểỈỉỄễỆệỂểỀề0-9 ,.()]{6,100}',
            required: true
        },
        {
            name: 'username',
            placeholder:'Username',
            pattern: "[a-zA-Z][a-zA-Z0-9-_]{3,32}",
            message: 'Username must have minimum 3 characters and maximum is 32 characters',
            required: true
        },
        {
            name: 'password',
            placeholder:'Password',
            pattern: "",
            message: '',
            required: true
        },
    ];
}

