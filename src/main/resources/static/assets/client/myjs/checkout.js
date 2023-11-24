let fullName = document.getElementById('fullName');
let email = document.getElementById('email');
let phoneNumber = document.getElementById('phoneNumber');
let address = document.getElementById('address');
let province = document.getElementById('province');
let district = document.getElementById('district');
let ward = document.getElementById('ward');
let tBody = document.getElementById('tBody');
let formCart = document.getElementById('formCart');

const urlApiProvince = 'https://vapi.vnappmob.com/api/province/';
const urlApiDistrict = 'https://vapi.vnappmob.com/api/province/district/';
const urlApiWard = 'https://vapi.vnappmob.com/api/province/ward/';



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

async function getUserInfo(){
    let idUser = localStorage.getItem('idUser');
    const response = await fetch('/api/user/' + idUser)
    return await response.json();
}

async function getUserProvince(id) {
    const response = await fetch(urlApiProvince);
    const data = await response.json();
    const provinces = data.results;
    const userProvince = provinces.find(item => item.province_id === id)
    const userProvinceStr = renderOptionProvince(userProvince);
    province.innerHTML += userProvinceStr
    const indexOfUserProvince = provinces.findIndex(item => item.province_id === id)
    provinces.splice(indexOfUserProvince,1);
    for (let item of provinces) {
        const str = renderOptionProvince(item);
        province.innerHTML += str;
    }
}

async function getUserDistrict(districtId,provinceId) {
    const response = await fetch(urlApiDistrict + provinceId);
    const data = await response.json();
    const districts = data.results;
    const userDistrict = districts.find(item => item.district_id === districtId)
    const userDistrictStr = renderOptionDistrict(userDistrict);
    district.innerHTML += userDistrictStr
    const indexOfUserDistrict = districts.findIndex(item => item.district_id === districtId)
    districts.splice(indexOfUserDistrict,1);
    for (let item of districts) {
        const str = renderOptionDistrict(item);
        district.innerHTML += str;
    }
}

async function getUserWard(wardId,districtId) {
    const response = await fetch(urlApiWard + districtId);
    const data = await response.json();
    const wards = data.results;
    const userWard = wards.find(item => item.ward_id === wardId)
    const userWardStr = renderOptionWard(userWard);
    ward.innerHTML += userWardStr
    const indexOfUserWard = wards.findIndex(item => item.ward_id === wardId)
    wards.splice(indexOfUserWard,1);
    for (let item of wards) {
        const str = renderOptionWard(item);
        ward.innerHTML += str;
    }
}

async function renderUserInfo(){
    const res = await getUserInfo();
    fullName.value = res.fullName;
    email.value = res.email;
    phoneNumber.value = res.phoneNumber;
    address.value = res.address;
    getUserProvince(res.provinceId).then(data => {
        const provinceID = province.value;
        getUserDistrict(res.districtId,provinceID).then(data => {
            const districtID = district.value;
            getUserWard(res.wardId,districtID);
        } );
    } )
}

function renderUserProduct(obj) {
    let priceStr = obj.productPrice;
    let priceWithoutSymbols = priceStr.replace(/[.,₫]/g, "");
    let price = parseFloat(priceWithoutSymbols);
    let totalPrice = price * parseInt(obj.quantity);
    const formatTotalPrice = totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
    }).replace(/\₫/, '') + ' ₫';
    return      `<tr>
                  <td>${obj.productName}<strong class="mx-2">x</strong>${obj.quantity}</td>
                  <td id="totalProductPrice">${formatTotalPrice}</td>
                </tr>`
}

function showTotalPrice(){
    let total = document.getElementById('total');
    let subtotal = document.getElementById('subtotal');
    let totalProductPriceNodes = tBody.querySelectorAll('#totalProductPrice');
    let totalProductPricesArray = Array.from(totalProductPriceNodes).map(element => element.textContent);
    let totalPrice = 0;
    for (const item of totalProductPricesArray) {
        let priceWithoutSymbols = item.replace(/[.,₫]/g, "");
        let price = parseFloat(priceWithoutSymbols);
        totalPrice += price
    }

    const formatTotalPrice = totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
    }).replace(/\₫/, '') + ' ₫';
    total.textContent = formatTotalPrice
    subtotal.textContent = formatTotalPrice
}

function showUserBill() {
    let idUser = localStorage.getItem('idUser');
    let carts = localStorage.getItem('cart');
    let cartsObj = JSON.parse(carts);
    let userCart = cartsObj.find(item => item.userId === idUser).cart;
    let html = '';
    for (const item of userCart) {
        const str = renderUserProduct(item);
        html += str;
    }
    tBody.innerHTML = html + tBody.innerHTML;
}

async function submitOrder(){

    let address = document.getElementById('address').value;
    let provinceName = province.selectedOptions[0].textContent;
    let districtName = district.selectedOptions[0].textContent;
    let wardName = ward.selectedOptions[0].textContent;
    let idUser = localStorage.getItem('idUser');
    let totalOrderStr= total.textContent;
    let totalOrderNoSymbols = totalOrderStr.replace(/[.,₫]/g, "");
    let totalOrder = parseFloat(totalOrderNoSymbols);
    let carts = localStorage.getItem('cart');
    let cartsObj = JSON.parse(carts);
    let userCart = cartsObj.find(item => item.userId === idUser).cart;
    let products = userCart.map(product => {
        return {
            productId: product.productId,
            quantity: product.quantity
        }
    })
    let confirmBox = webToast.confirm('Please check again your order! If is okay, confirm the order ')
    confirmBox.click(async function (){
        const data = {
            idUser:idUser,
            provinceName: provinceName,
            districtName: districtName,
            wardName: wardName,
            address: address,
            totalPrice: totalOrder,
            products:products
        }
        const response = await fetch('/api/order',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.ok){
            let indexOfUserCart = cartsObj.findIndex(item => item.userId === idUser);
            cartsObj.splice(indexOfUserCart,1);
            localStorage.setItem('cart',JSON.stringify(cartsObj))
            location.href = '/thank-you';
        } else {
            console.log('Không thể tạo đơn hàng!')
        }
    })
}

window.onload = async () => {
    showQuantityOfProductOnCartIcon()
    await renderUserInfo();
    showUserBill();
    showTotalPrice()
}

