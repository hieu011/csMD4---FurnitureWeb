let cartTBody = document.getElementById('cartTBody');
let subtotal = document.getElementById('subtotal');
let total = document.getElementById('total');
let checkOutBtn = document.getElementById('checkOutButton');
let checkout = document.getElementById('checkout');
let formCart = document.getElementById('formCart');
let buttonWhenCartIsNotEmpty = document.getElementById('buttonWhenCartIsNotEmpty');

async function renderProductInCart(item) {
    const stockQuantity = await getStockQuantity(item.productId);
    const stockQuantityStr = `Stock Quantity: ${stockQuantity}`;
    const quantityStr = item.quantity.toString();
    const quantity = parseInt(item.quantity);
    const price = item.productPrice;
    const priceNumber = parseInt(price.replace(/\D/g, ''), 10);
    const totalPrice = quantity * priceNumber;
    const formatTotalPrice = totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
    }).replace(/\₫/, '') + ' ₫';
    return `<tr class="text-center">
              <td class="product-thumbnail">
                <img src="${item.productImage}" alt="Image" class="img-fluid">
              </td>
              <td class="product-name">
                <h2 class="h5 text-black" data-value="${item.productId}">${item.productName}</h2>
              </td>
              <td><strong id="productPrice">${item.productPrice}</strong></td>
              <td>
                <div class="text-center text-info mb-3">
                    <span id="stockQuantity">${stockQuantityStr}</span>
                </div>
                
                <div class="input-group mb-3 d-flex align-items-center quantity-container justify-content-center" style="width: 100%;">
                  <div class="input-group-prepend">
                    <button class="btn btn-outline-black decrease" type="button">&minus;</button>
                  </div>
                  <input type="text" style="width: 100px; border-radius: 10px; flex: none" class="form-control text-center quantity-amount" value="${quantityStr}" id="quantityId">
                  <div class="input-group-append">
                    <button class="btn btn-outline-black increase" type="button">&plus;</button>
                  </div>
                </div>
                
                <div class="text-center text-danger">
                    <span id="errorQuantity"></span>
                </div>

              </td>
              <td><strong id="totalProductPrice">${formatTotalPrice}</strong></td>
              <td>
                <button style="border: none" class="removeButton" onclick="deleteProductFromCart(this)" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" cursor="pointer" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                  </svg>
                </button>
              </td>
            </tr>`
}

function getUserProductInCart() {
    let userId = localStorage.getItem('idUser');
    let existingData = JSON.parse(localStorage.getItem('cart')) || [];

    let userCart = existingData.find(user => user.userId === userId);
    return userCart.cart;
}

async function getStockQuantity(id) {
    const response = await fetch('/api/products/' + id);
    const data = await response.json();
    const stockQuantity = data.stockQuantity;
    return stockQuantity;
}

function increaseValue(event, quantityAmount) {
    value = parseInt(quantityAmount.value, 10);
    value = isNaN(value) ? 0 : value;
    ++value;
    quantityAmount.setAttribute('value',value);
    if(!checkValidQuantity(quantityAmount)){
        return;
    }
    changeTotalProduct(quantityAmount);
    changeTotalPriceInBill();
}

function decreaseValue(event, quantityAmount) {
    value = parseInt(quantityAmount.value, 10);

    value = isNaN(value) ? 0 : value;
    if (value == 1){
        deleteProductFromCart(quantityAmount)
    }
    if (value > 0 && value != 1) value--;
    quantityAmount.setAttribute('value',value)
    if(!checkValidQuantity(quantityAmount)){
        return;
    }
    changeTotalProduct(quantityAmount);
    changeTotalPriceInBill();
}

function checkValidQuantity(ele){
    let trEle = ele.closest('tr');
    let stockQuantityStr
        = trEle.querySelector(`#stockQuantity`).textContent;
    let stockQuantity = parseInt(stockQuantityStr.split(":")[1].trim());
    let quantity = parseInt(ele.value)
    let errorQuantity
        = trEle.querySelector('#errorQuantity')
    if(quantity > stockQuantity){
        errorQuantity.textContent = "The quantity is bigger than stock quantity!";
        disabledBtnCheckOut()
        return false;
    } else {
        errorQuantity.textContent = "";
        enabledBtnCheckOut()
        return true;
    }
}

function disabledBtnCheckOut(){
    checkOutBtn.classList.add("disabled-button");
}

function enabledBtnCheckOut(){
    checkOutBtn.classList.remove("disabled-button");
}

function deleteProductFromCart(ele){
    let checkQuantityEqualOne = true;
    let confirmBox = webToast.confirm("Are you sure to delete this product?")
    confirmBox.click( () => {
        checkQuantityEqualOne = false,
            webToast.Success({
                status: 'This product is removed',
                message: '',
                delay: 2000,
                align: 'topright'
            } );
        if(!checkQuantityEqualOne){
            // Find the parent tr element
            let trElement = ele.closest('tr')

            // Find the h2 element with data-value attribute
            let h2Element = trElement.querySelector('h2');

            // Get the product ID
            let productIdRemove = h2Element.getAttribute('data-value');

            let existingCart = localStorage.getItem('cart');
            let cartObject = JSON.parse(existingCart);
            let idUser = localStorage.getItem('idUser');
            let userCart = {};
            let indexOfExistingCart = 0;

            for (let i = 0; i < cartObject.length ; i++){
                if(idUser == cartObject[i].userId){
                    indexOfExistingCart = i;
                    userCart = cartObject[i].cart;
                    console.log(userCart)
                }
            }

            for (let i = 0; i < userCart.length; i++){
                if(productIdRemove == userCart[i].productId){
                    // Find the index of the element to remove
                    let indexToRemove = userCart.findIndex(product => product.productId === productIdRemove);
                    if (indexToRemove !== -1) {
                        // Use splice to remove the element at the found index
                        userCart.splice(indexToRemove, 1);
                        cartObject[indexOfExistingCart].cart = userCart;
                        localStorage.setItem('cart',JSON.stringify(cartObject));
                        let tbodyElement = trElement.closest('tbody');
                        tbodyElement.removeChild(trElement);
                    } else {
                        console.log("Element not found");
                    }
                }
            }
        }
    })
    changeTotalPriceInBill();
}

function changeTotalProduct(ele){
    let trEle = ele.closest('tr')
    let productPriceStr
        = trEle.querySelector(`#productPrice`).textContent
// Loại bỏ ký tự dấu phẩy và ký tự đồng tiền
    let priceWithoutSymbols = productPriceStr.replace(/[.,₫]/g, "");
// Chuyển đổi thành số
    let productPrice = parseFloat(priceWithoutSymbols);
    let quantity = ele.value;
    let newTotalPrice = productPrice * parseInt(quantity);
    const formatTotalPrice = newTotalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
    }).replace(/\₫/, '') + ' ₫';
    let totalProductPrice
        = trEle.querySelector(`#totalProductPrice`)
    totalProductPrice.innerHTML = formatTotalPrice;
    updateCartInLocalStorage(trEle,quantity);
}

function updateCartInLocalStorage(ele,quantity){
    let existingCart = localStorage.getItem('cart');
    let cartObject = JSON.parse(existingCart);
    let idUser = localStorage.getItem('idUser');
    let userCart = cartObject.find(cart => cart.userId === idUser).cart;
    let productId
        = ele.querySelector('h2').getAttribute('data-value');
    let indexOfUserCart = cartObject.findIndex(cart => cart.userId === idUser);

    for (let i = 0; i < userCart.length; i++){
        if(productId == userCart[i].productId){
            userCart[i].quantity = quantity;
            break;
        }
    }
    cartObject[indexOfUserCart].cart = userCart;
    localStorage.setItem('cart',JSON.stringify(cartObject));
}

function changeTotalPriceInBill(){
    let trEle = cartTBody.querySelectorAll('#totalProductPrice');
    let totalPrice = 0;
    trEle.forEach(function(element) {
        let textContent = element.textContent;
        // Loại bỏ ký tự dấu phẩy và ký tự đồng tiền
        let totalPriceWithoutSymbols = textContent.replace(/[.,₫]/g, "");
    // Chuyển đổi thành số
        let price = parseFloat(totalPriceWithoutSymbols);
        totalPrice += price;
    });
    const formatTotalPrice = totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
    }).replace(/\₫/, '') + ' ₫';
    subtotal.textContent = formatTotalPrice;
    total.textContent = formatTotalPrice;
}
function createBindings() {
    let quantityContainer = document.getElementsByClassName('quantity-container');
    for (let i = 0; i < quantityContainer.length; i++){
        let quantityAmount = quantityContainer[i].getElementsByClassName('quantity-amount');
        let increase = quantityContainer[i].getElementsByClassName('increase');
        let decrease = quantityContainer[i].getElementsByClassName('decrease');
        increase[0].addEventListener('click', function (e) { increaseValue(e, quantityAmount[0]); });
        decrease[0].addEventListener('click', function (e) { decreaseValue(e, quantityAmount[0]); });
    }
}

function addEventToCheckOutBtn(){
    checkOutBtn.onclick = () => {
        if(checkOutBtn.classList.contains('disabled-button')){
            webToast.Danger({
                status: 'Please check the quantity of product!',
                message: '',
                delay: 3000,
                align: 'topcenter'
            });
        } else {
            location.href = '/checkout'
        }
    }
}

function alertWhenCartIsEmpty(){
    let  alertElement  = document.createElement('div');
    const alert =  `<div class="container">
        <div class="row">
            <div class="col-md-12 text-center pt-5">
          <span class="display-3 thankyou-icon text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-cart-x-fill" viewBox="0 0 16 16">
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7.354 5.646 8.5 6.793l1.146-1.147a.5.5 0 0 1 .708.708L9.207 7.5l1.147 1.146a.5.5 0 0 1-.708.708L8.5 8.207 7.354 9.354a.5.5 0 1 1-.708-.708L7.793 7.5 6.646 6.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </span>
                <h2 class="display-3 text-danger">Oops!</h2>
                <p class="lead mb-5">Your cart is empty.</p>
                <a href="/shop">
                    <button class="btn btn-black btn-sm btn-block" id="updateCartButton">Update Cart</button>
                </a>
            </div>
        </div>
    </div>`;
    alertElement.innerHTML = alert
    formCart.replaceWith(alertElement);
    buttonWhenCartIsNotEmpty.innerHTML = "";
}


window.onload = async () => {
    showQuantityOfProductOnCartIcon();
    addEventToCheckOutBtn();
    const data = await getUserProductInCart();
    if(data.length > 0){
        for (let item of data) {
            const str = await renderProductInCart(item);
            cartTBody.innerHTML += str
        }
        createBindings();
        changeTotalPriceInBill();
    } else {
        alertWhenCartIsEmpty()
    }
}


