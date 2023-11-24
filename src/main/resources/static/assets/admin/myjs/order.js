const orderForm = document.getElementById('orderForm');
const tBody = document.getElementById("tBody");
const ePagination = document.getElementById('pagination')
const eSearch = document.querySelector('#search');
let modalTbody = document.getElementById('modalTbody');
let orderId = document.getElementById('orderId');
let orderDay = document.getElementById('orderDay');
let status = document.getElementById('status');
let customerName = document.getElementById('customerName');
let customerPhone = document.getElementById('customerPhoneNumber');
let customerEmail = document.getElementById('customerEmail');
let orderAddress = document.getElementById('orderAddress');
let productImg = document.getElementById('productImg');
let productName = document.getElementById('productName');
let productPrice = document.getElementById('productPrice');
let productQuantity = document.getElementById('productQuantity');
let productTotalPrice = document.getElementById('productTotalPrice');
let subtotal = document.getElementById('subtotal');
let totalAmount = document.getElementById('totalAmount');
let orders = [];
let pageable = {
    page: 1,
    sort: 'id,asc',
    search: ''
}

async function getList() {
    const sortParam = 'id,asc'
    const response = await fetch(`/api/order?page=${pageable.page - 1 || 0}&search=${pageable.search || ''}&sort=${sortParam || ''}`);

    const result = await response.json();
    pageable = {
        ...pageable,
        ...result
    };
    genderPagination();
    renderTBody(result.content);
    return result; // Trả về kết quả mà bạn đã lấy từ response.json()
    // addEventEditAndDelete();
}

const searchInput = document.querySelector('#search');
searchInput.addEventListener('search', async () => {
    await onSearch(event)
});

const onSearch = async (e) => {
    e.preventDefault()
    pageable.search = eSearch.value;
    pageable.page = 1;
    await getList();
}

function renderTBody(items) {
    let str = '';
    items.forEach(e => {
        str += renderItemStr(e);
    })
    tBody.innerHTML = str;
}

async function renderTable() {
    const pageable = await getList();
    orders = pageable.content;
    renderTBody(orders);
}

function renderItemStr(item) {
    // Chuỗi ngày giờ đầu vào
    let localDateTimeString = item.orderDate;

// Chuyển đổi sang đối tượng Date
    let dateObject = new Date(localDateTimeString);

// Định dạng ngày giờ theo "YY-MM-DD time"
    let formattedDate = dateObject.getFullYear().toString().substr(-2) + '-' +
        ('0' + (dateObject.getMonth() + 1)).slice(-2) + '-' +
        ('0' + dateObject.getDate()).slice(-2) + ' ' + '-' + ' '+
        ('0' + dateObject.getHours()).slice(-2) + ':' +
        ('0' + dateObject.getMinutes()).slice(-2) + ':' +
        ('0' + dateObject.getSeconds()).slice(-2);

    let totalPrice = formatPrice(item.totalPrice);


    return `<tr style="text-align: center">
                  <td>${item.id}</td>
                  <td><i class="fab fa-angular fa-lg text-danger"></i><strong>${item.user.fullName}</strong></td>
                  <td>${totalPrice}</td>
                  <td>${formattedDate}</td>
                  <td><span class="badge bg-label-info me-1">${item.status}</span></td>
                  <td>
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" onclick="showOrder(${item.id})">
                        <i class="bx bx-dots-vertical-rounded"></i>
                     </button>
                  </td>
                </tr>`
}

async function showOrder(id){
    const response = await fetch('/api/order/' + id);
    const data = await response.json();
    orderId.textContent = data.id;
    orderDay.textContent = formatDay(data.orderDate);
    customerName.textContent = data.user.fullName;
    customerEmail.textContent = data.user.email;
    customerPhone.textContent = data.user.phoneNumber;
    for (const item of data.products) {
        const str = renderItemInBill(item);
        console.log(str)
        modalTbody.innerHTML += str;
    }
    let formatTotal = data.totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
    }).replace(/\₫/, '') + ' ₫';
    subtotal.textContent = formatTotal;
    totalAmount.textContent = formatTotal;
    $('#staticModal').modal('show');
}

function renderItemInBill(obj){
    let totalPrice = obj.price * obj.quantity;
    const formatPrice = obj.price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
    }).replace(/\₫/, '') + ' ₫';
    const formatTotalPrice = totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
    }).replace(/\₫/, '') + ' ₫';
    return`<tr>
                <td><img src="${obj.file}" style="width: 100px; height: 100px"/></td>
                <td><strong>${obj.name}</strong></td>
                <td>${formatPrice}</td>
                <td>${obj.quantity}</td>
                <td><strong>${formatTotalPrice}</strong></td>
            </tr>`
}
const genderPagination = () => {
    ePagination.innerHTML = '';
    let str = '';
    // Cập nhật indexOfProducts
    if (pageable.page === 1) {
        indexOfProducts = 1;
    }
    //generate preview truoc
    str += `<li class="page-item ${pageable.first ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>`
    //generate 1234

    for (let i = 1; i <= pageable.totalPages; i++) {
        str += ` <li class="page-item ${(pageable.page) === i ? 'active' : ''}" aria-current="page">
      <a class="page-link" href="#">${i}</a>
    </li>`
    }
    //
    //generate next truoc
    str += `<li class="page-item ${pageable.last ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Next</a>
            </li>`
    //generate 1234
    ePagination.innerHTML = str;

    const ePages = ePagination.querySelectorAll('li'); // lấy hết li mà con của ePagination
    const ePrevious = ePages[0];
    const eNext = ePages[ePages.length - 1]

    ePrevious.onclick = () => {
        if (pageable.page === 1) {
            return;
        }
        pageable.page -= 1;
        getList();
    }
    eNext.onclick = () => {
        if (pageable.page === pageable.totalPages) {
            return;
        }
        pageable.page += 1;
        // Update indexOfProducts based on the current page
        indexOfProducts = (pageable.page - 1) * 5 + 1;
        getList();
    }
    for (let i = 1; i < ePages.length - 1; i++) {
        if (i === pageable.page) {
            continue;
        }
        ePages[i].onclick = () => {
            pageable.page = i;
            // Update indexOfProducts based on the current page
            indexOfProducts = (pageable.page - 1) * 5 + 1;
            getList();
        }
    }
}

function formatPrice(price) {
    // Chuyển đổi số thành chuỗi và đảm bảo nó là một số nguyên
    price = parseInt(price, 10);

    // Sử dụng hàm toLocaleString để định dạng số thành chuỗi có dấu phân cách hàng nghìn
    var formattedPrice = price.toLocaleString('vi-VN');

    // Thêm ký tự 'đ' ở cuối
    formattedPrice += ' đ';

    return formattedPrice;
}

function formatDay(day){
    // Chuyển đổi sang đối tượng Date
    let dateObject = new Date(day);
    // Định dạng ngày giờ theo "YY-MM-DD time"
    let formattedDate = dateObject.getFullYear().toString().substr(-2) + '-' +
        ('0' + (dateObject.getMonth() + 1)).slice(-2) + '-' +
        ('0' + dateObject.getDate()).slice(-2) + ' ' + '-' + ' '+
        ('0' + dateObject.getHours()).slice(-2) + ':' +
        ('0' + dateObject.getMinutes()).slice(-2) + ':' +
        ('0' + dateObject.getSeconds()).slice(-2);
    return formattedDate;
}



window.onload = async () => {
    await renderTable();
}