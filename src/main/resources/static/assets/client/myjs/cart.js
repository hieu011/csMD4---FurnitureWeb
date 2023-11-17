let cartTBody = document.getElementById('cartTBody');
function renderProductInCart(item){
    const quantity = parseInt(item.quantity);
    const price = item.productPrice;
    const priceNumber = parseInt(price.replace(/\D/g, ''), 10);
    const totalPrice = quantity * priceNumber;
    const formatTotalPrice = totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'VND' }).replace(/\₫/, '') + ' ₫';
    return `<tr class="text-center">
              <td class="product-thumbnail">
                <img src="${item.productImage}" alt="Image" class="img-fluid">
              </td>
              <td class="product-name">
                <h2 class="h5 text-black">${item.productName}</h2>
              </td>
              <td><strong>${item.productPrice}</strong></td>
              <td>
                <div class="input-group mb-3 d-flex align-items-center quantity-container" style="width: 100%;">
                  <div class="input-group-prepend">
                    <button class="btn btn-outline-black decrease" type="button">&minus;</button>
                  </div>
                  <input type="text" style="width: 20px" class="form-control text-center quantity-amount" value="${item.quantity}" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
                  <div class="input-group-append">
                    <button class="btn btn-outline-black increase" type="button">&plus;</button>
                  </div>
                </div>

              </td>
              <td><strong>${formatTotalPrice}</strong></td>
              <td>
                <button style="border: none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" cursor="pointer" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                  </svg>
                </button>
              </td>
            </tr>`
}

function getUserProductInCart(){
    let userId = localStorage.getItem('idUser');
    let existingData = JSON.parse(localStorage.getItem('cart')) || [];

    let userCart = existingData.find(user => user.userId === userId);
    return userCart.cart;
}

window.onload = () => {
    const data = getUserProductInCart();
    data.forEach(item => {
        const str = renderProductInCart(item);
        cartTBody.innerHTML += str
    })
}
