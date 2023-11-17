let province = document.getElementById('province');
let district = document.getElementById('district');
let ward = document.getElementById('ward');
const urlApiProvince = 'https://vapi.vnappmob.com/api/province/';
const urlApiDistrict = 'https://vapi.vnappmob.com/api/province/district/';
const urlApiWard = 'https://vapi.vnappmob.com/api/province/ward/';
let registerForm = document.getElementById('registerForm');

async function getAllProvinces(){
    const response = await fetch(urlApiProvince);
    const data = await response.json();
    const provinces = data.results;
    for (let item of provinces) {
        const str = renderOptionProvince(item);
        province.innerHTML += str;
    }
}

async function getAllDistrictsByProvinceId(provinceID){
    const response = await fetch(urlApiDistrict + provinceID);
    const data = await response.json()
    const districts = data.results;
    district.innerHTML = '';
    for (let item of districts) {
        const str = renderOptionDistrict(item);
        district.innerHTML += str;
    }
}

async function getAllWardsByDistrictId(districtID){
    const response = await fetch(urlApiWard + districtID);
    const data = await response.json();
    const wards = data.results;
    ward.innerHTML = '';
    for (let item of wards) {
        const str = renderOptionWard(item);
        ward.innerHTML += str;
    }
}

province.onchange = function () {
    const provinceID = this.value;
    getAllDistrictsByProvinceId(provinceID).then(data => {
        const districtID = district.value;
        getAllWardsByDistrictId(districtID);
    } );
}

district.onchange = function () {
    const districtID = this.value;
    getAllWardsByDistrictId(districtID).then(data => {
    });
}

const renderOptionProvince = (obj) => {
    return `<option value="${obj.province_id}">${obj.province_name}</option>`;
}

const renderOptionDistrict = (obj) => {
    return `<option value="${obj.district_id}">${obj.district_name}</option>`;
}

const renderOptionWard = (obj) => {
    return `<option value="${obj.ward_id}">${obj.ward_name}</option>`;
}

registerForm.onsubmit = async function (event) {
    event.preventDefault();
    let fullName = document.getElementById('fullName').value;
    let phoneNumber = document.getElementById('phoneNumber').value;
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let provinceId = province.selectedOptions[0].value;
    let provinceName = province.selectedOptions[0].textContent;
    let districtId = district.selectedOptions[0].value;
    let districtName = district.selectedOptions[0].textContent;
    let wardId = ward.selectedOptions[0].value;
    let wardName = ward.selectedOptions[0].textContent;
    let address = document.getElementById('address').value;
    const location = {
        provinceId: provinceId,
        provinceName: provinceName,
        districtId: districtId,
        districtName: districtName,
        wardId: wardId,
        wardName: wardName,
        address: address
    }
    const data ={
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        username: username,
        password: password,
        address: address,
        location: location
    }
    const response = await fetch('/api/auth/register',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    console.log(response)
    if(response.ok){
        registerForm.reset();
        webToast.Success({
            status: `Đăng kí tài khoản thành công`,
            message: '',
            delay: 2000,
            align: 'topright'
        });
    }
}

window.onload = () => {
    getAllProvinces().then(data => {
        const provinceID = province.value;
        getAllDistrictsByProvinceId(provinceID).then(data => {
            const districtID = district.value;
            getAllWardsByDistrictId(districtID);
        } );
    } )
}