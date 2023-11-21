let fullName = document.getElementById('fullName');
let email = document.getElementById('email');
let phoneNumber = document.getElementById('phoneNumber');
let province = document.getElementById('province');
let district = document.getElementById('district');
let ward = document.getElementById('ward');
let address = document.getElementById('address');

async function getUserInfo(){
    let idUser = localStorage.getItem('idUser');
    const response = await fetch('/api/user/' + idUser)
    return await response.json();
}

async function renderUserInfo(){
    const data = await getUserInfo();
    fullName.value = data.fullName;
    email.value = data.email;
    phoneNumber = data.phoneNumber;
    address = data.address;
}

