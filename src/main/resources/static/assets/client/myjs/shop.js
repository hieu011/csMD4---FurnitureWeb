let decreaseButton = document.getElementById("decreaseQty");
let increaseButton = document.getElementById("increaseQty");
let quantityInModal = document.getElementById("quantityInModal");
const ePagination = document.getElementById('pagination');
const eSearch = document.getElementById('search');
const tBody = document.getElementById("tBody");
const searchInput = document.querySelector('#search');
let productName = document.getElementById('productName');
let productDescription = document.getElementById('productDescription');
let productPrice = document.getElementById('productPrice');
let productCategory = document.getElementById('productCategory');
let productMaterial = document.getElementById('productMaterial');
let productStockQuantity = document.getElementById('productStockQuantity');
let carouselImage = document.getElementById('carousel-productImage');
let iconUser = document.getElementById('iconUser');
let dropDownMenu = document.getElementById('dropDownMenu');
let pageable = {
    page: 1,
    sort: 'id,desc',
    search: ''
}

let products = [];
let productSelected = {};

window.onload = async () => {
    await renderTable();
    showQuantityOfProductOnCartIcon();
}

increaseButton.onclick = function (){
    const quantity = +quantityInModal.value + 1;
    quantityInModal.value = quantity;
    checkQuantity();
}

decreaseButton.onclick = function (){
    if(+quantityInModal.value == 1){
        document.getElementById('errorQuantityHTML').style.display = 'block';
        document.getElementById('errorQuantity').innerHTML = 'Vui lòng chọn số lượng từ 1 trở lên';
        return;
    }
    const quantity = +quantityInModal.value - 1;
    quantityInModal.value = quantity
    checkQuantity();
}

function getDataFromForm(form) {
    // event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}
async function getList(){
    const sortParam = 'id,asc'
    const response = await fetch(`/api/products/client?page=${pageable.page - 1 || 0}&search=${pageable.search || ''}&sort=${sortParam || ''}`);

    if (!response.ok) {
        // Xử lý trường hợp không thành công ở đây, ví dụ: throw một lỗi hoặc trả về một giá trị mặc định
        throw new Error("Failed to fetch data");
    }

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

const genderPagination = () => {
    ePagination.innerHTML = '';
    let str = '';
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
    const eNext = ePages[ePages.length-1]

    ePrevious.onclick = () => {
        if(pageable.page === 1){
            return;
        }
        pageable.page -= 1;
        getList();
    }
    eNext.onclick = () => {
        if(pageable.page === pageable.totalPages){
            return;
        }
        pageable.page += 1;
        getList();
    }
    for (let i = 1; i < ePages.length - 1; i++) {
        if(i === pageable.page){
            continue;
        }
        ePages[i].onclick = () => {
            pageable.page = i;
            getList();
        }
    }
}

function renderTBody(items) {
    let str = '';
    items.forEach(e => {

        str += renderItemStr(e);
    })
    tBody.innerHTML = str;
}

function renderItemStr(item) {
    let formatPrice = item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return `<div class="col-12 col-md-4 col-lg-3 mb-5" onclick="showModal(${item.id})">
        <a class="product-item" href="#">
          <img src="${item.images[0]}" class="img-fluid product-thumbnail">
          <h3 class="product-title">${item.name}</h3>
          <strong class="product-price">${formatPrice}</strong>

          <span class="icon-cross">
				<img src="/assets/client/images/cross.svg" class="img-fluid">
		  </span>
        </a>
      </div>`
}

async function renderTable() {
    const pageable = await getList();
    products = pageable.content;
    renderTBody(products);
}

const findById = async (id) => {
    const response = await fetch('/api/products/client/' + id);
    return await response.json();
}

function clearModal() {
    productName.innerHTML = '';
    productDescription.innerHTML = '';
    productPrice.innerHTML = '';
    productCategory.innerHTML = '';
    productMaterial.innerHTML = '';
    productStockQuantity.innerHTML = '';
    carouselImage.innerHTML = '';
    quantityInModal.value = 1;
}
async function showModal(id) {
    clearModal();
    productSelected = await findById(id);
    showInfoInModal(productSelected);
    $('#staticModal').modal('show');
}

function showInfoInModal(product){
    const imagesFirstHTML = `<div class="carousel-item active">
                  <img src="${product.images[0]}" class="d-block w-100" alt="">
                </div>`;
    product.images.splice(0,1);
    let imagesHTML = product.images.map(imageUrl => `<div class="carousel-item">
                  <img src="${imageUrl}" class="d-block w-100" alt="">
                </div>`).join('');
    imagesHTML += imagesFirstHTML;
    productName.innerHTML = product.name;
    productName.setAttribute('id',product.id);
    productDescription.innerHTML = product.description;
    let formatPrice = product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    console.log(formatPrice)
    productPrice.innerHTML = formatPrice;
    productCategory.innerHTML = product.category;
    productMaterial.innerHTML = product.material;
    productStockQuantity.innerHTML = product.stockQuantity;
    carouselImage.innerHTML = imagesHTML;
}

async function addProductToCart() {
    const userId = localStorage.getItem("idUser");
    const item = {
        productId: productName.id,
        productName: productName.textContent,
        productPrice: productPrice.textContent,
        productImage: carouselImage.querySelector('img').src,
        quantity: quantityInModal.value,
    }

    let existingData = JSON.parse(localStorage.getItem('cart')) || [];

    let userCart = existingData.find(user => user.userId === userId);
    if (!userCart) {
        userCart = { userId: userId, cart: [] };
        userCart.cart.push(item);
        existingData.push(userCart);
    } else {
        let cartBefore = userCart.cart.find(cart => cart.productId === item.productId);
        if(cartBefore){
            let quantityInCart = parseInt(cartBefore.quantity);
            let quantityAdd = parseInt(item.quantity);
            let newQuantity = quantityInCart + quantityAdd;
            cartBefore.quantity = newQuantity.toString();
        } else {
            userCart.cart.push(item)
        }
    }
    console.log(existingData);

    localStorage.setItem('cart', JSON.stringify(existingData));


    webToast.Success({
            status: `Thêm sản phẩm thành công`,
            message: '',
            delay: 3000,
            align: 'topright'
    });

    showQuantityOfProductOnCartIcon();
    $('#staticModal').modal('hide');
}

function disableAddToCartButton() {
    const saveChangesButton = document.getElementById('addToCartButton');
    saveChangesButton.disabled = true;
}

function enableAddToCartButton() {
    const saveChangesButton = document.getElementById('addToCartButton');
    saveChangesButton.disabled = false;
}


function checkQuantity(){
    if(+quantityInModal.value > +productStockQuantity.textContent){
        document.getElementById('errorQuantityHTML').style.display = 'block';
        document.getElementById('errorQuantity').innerHTML = 'Số lượng vượt số hàng hiện có';
        disableAddToCartButton();
    } else {
        document.getElementById('errorQuantityHTML').style.display = 'none';
        enableAddToCartButton();
    }
}


searchInput.addEventListener('search', () => {
    onSearch(event)
});
const onSearch = (e) => {
    e.preventDefault()

    pageable.search = eSearch.value;
    pageable.page = 1;
    getList();
}

function showQuantityOfProductOnCartIcon(){
    const userId = localStorage.getItem("idUser");
    let existingData = JSON.parse(localStorage.getItem('cart')) || [];

    let userCart = existingData.find(user => user.userId === userId);
    quantityOnCartIcon.innerHTML = userCart.cart.length.toString();
}








