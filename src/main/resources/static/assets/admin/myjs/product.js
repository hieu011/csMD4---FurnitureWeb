const productForm = document.getElementById('productForm');
const tBody = document.getElementById("tBody");
const ePagination = document.getElementById('pagination')
const eSearch = document.querySelector('#search');
const formBody = document.getElementById('formBody');

let indexOfProducts = 1;
let idImages = [];
let imageSrcDefault = "https://www.justblackmagic.com/wp-content/uploads/2020/09/cloud-computing-1990405_1280.png"
let productSelected = {};
let pageable = {
    page: 1,
    sort: 'id,asc',
    search: ''
}
let products = [];
let categories;
let materials;
let listFilesOfImagePreview = [];
productForm.onsubmit = async (e) => {
    e.preventDefault();
    await saveImageToDB();
    listFilesOfImagePreview = [];

    let data = getDataFromForm(productForm);
    data = {
        ...data,
        id: productSelected.id,
        files: idImages.map(e => {
            return {
                id: e
            }
        })
    }
    console.log(data)
    // let message = "Created"
    if (productSelected.id) {
        const response = await editProduct(data);
        if (response.ok) {
            webToast.Success({
                status: 'Sửa sản phẩm thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        } else {
            webToast.Danger({
                status: 'Không thể sửa sản phẩm',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        }

        // message = "Edited"
    } else {
        const response = await createProduct(data)
        if (response.ok) {
            idImages = [];
            webToast.Success({
                status: 'Thêm sản phẩm thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        } else {
            webToast.Danger({
                status: 'Không thể thêm sản phẩm',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        }

    }

    // alert(message);
    await renderTable();
    $('#staticModal').modal('hide');

}

function getDataFromForm(form) {
    // event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}


async function getList() {
    const sortParam = 'id,asc'
    const response = await fetch(`/api/products?page=${pageable.page - 1 || 0}&search=${pageable.search || ''}&sort=${sortParam || ''}`);

    if (!response.ok) {
        // Xử lý trường hợp không thành công ở đây, ví dụ: throw một lỗi hoặc trả về một giá trị mặc định
        throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    console.log(result)
    pageable = {
        ...pageable,
        ...result
    };
    console.log(pageable)
    genderPagination();
    renderTBody(result.content);
    return result; // Trả về kết quả mà bạn đã lấy từ response.json()
    // addEventEditAndDelete();
}

function renderTBody(items) {
    let str = '';
    items.forEach(e => {
        str += renderItemStr(e);
        indexOfProducts++;
    })
    tBody.innerHTML = str;
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


function renderItemStr(item) {
    const imagesHTML = item.images.map(imageUrl =>
        `<li
               data-bs-toggle="tooltip"
               data-popup="tooltip-custom"
               data-bs-placement="top"
               class="avatar avatar-xs pull-up"                             
         >
               <img src="${imageUrl}" alt="Avatar" class="rounded-circle" />
         </li>`).join('');
    return `<tr style="text-align: center">
                  <td>${indexOfProducts}</td>
                  <td title="${item.description}"><i class="fab fa-angular fa-lg text-danger"></i><strong>${item.name}</strong></td>
                  <td><span class="badge bg-label-info me-1">${item.category}</span></td>
                  <td><span class="badge bg-label-info me-1">${item.material}</span></td>
                  <td>${item.price}</td>
                  <td>${item.stockQuantity}</td>
                  <td>
                    <ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                      ${imagesHTML}
                    </ul>
                  </td>
                  <td>
                    <div class="dropdown">
                      <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="bx bx-dots-vertical-rounded"></i>
                      </button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="javascript:void(0);" onclick="showEdit(${item.id})"
                        ><i class="bx bx-edit-alt me-1"></i> Edit</a
                        >
                        <a class="dropdown-item" href="javascript:void(0);" onclick="deleteProduct(${item.id})"
                        ><i class="bx bx-trash me-1"></i> Delete</a
                        >
                      </div>
                    </div>
                  </td>
                </tr>`
}

window.onload = async () => {
    categories = await getListCategories();
    materials = await getListMaterials();
    await renderTable();
    renderForm(formBody, getDataInput());
}

function getDataInput() {
    return [
        {
            label: 'Name',
            name: 'name',
            value: productSelected.name,
            required: true,
            pattern: "^[A-Za-zÀ-Ỷà-ỷẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯưỨứỪừỰựỬửỮữỨứỬửỰựỦủỤụỠỡỞởỢợỞởỚớỔổỒồỐốỎỏỊịỈỉỌọỈỉỊịỆệỄễỀềẾếỂểỈỉỄễỆệỂểỀề0-9 ,.()]{6,100}",
            message: "Name of product must have minimum is 6 characters and maximum is 100 characters",
        },
        {
            label: 'Description',
            name: 'description',
            value: productSelected.description,
            required: true,
            pattern: "^[A-Za-zÀ-Ỷà-ỷẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯưỨứỪừỰựỬửỮữỨứỬửỰựỦủỤụỠỡỞởỢợỞởỚớỔổỒồỐốỎỏỊịỈỉỌọỈỉỊịỆệỄễỀềẾếỂểỈỉỄễỆệỂểỀề0-9 ,.()]{6,100}",
            message: "Description must have minimum is 6 characters and maximum is 100 characters",
        },
        {
            label: 'Price',
            name: 'price',
            value: productSelected.price,
            pattern: "[1-9][0-9]{1,10}",
            message: 'Price must bigger than 0',
            required: true
        },
        {
            label: 'StockQuantity',
            name: 'stockQuantity',
            value: productSelected.stockQuantity,
            pattern: "[1-9][0-9]{1,10}",
            message: 'StockQuantity must bigger than 0 or balance 0',
            required: true
        },
        {
            label: 'Category',
            name: 'categoryId',
            value: productSelected.category,
            type: 'select',
            options: categories,
            required: true,
            messageRequired: 'Please choose Category'
        },
        {
            label: 'Material',
            name: 'materialId',
            value: productSelected.material,
            type: 'select',
            options: materials,
            required: true,
            messageRequired: 'Please choose Material'
        },
    ];
}

async function getListCategories() {
    const response = await fetch(`/api/categories`);
    return response.json();
}

async function getListMaterials() {
    const response = await fetch(`/api/materials`);
    return response.json();
}

async function renderTable() {
    const pageable = await getList();
    indexOfProducts = 1;
    products = pageable.content;
    renderTBody(products);
}


// function clearForm() {
//     hairDetailForm.reset();
//     hairSelected = {};
// }
function clearForm() {
    idImages = [];

    const imgEle = document.getElementById("images-container");
    const imageOld = imgEle.querySelectorAll('#image');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }
    productForm.reset();
    productSelected = {};
}

function showCreate() {
    $('#staticModalLabel').text('Create Product');
    clearForm();
    renderForm(formBody, getDataInput())
}

async function createProduct(data) {
    const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res;
}

async function showEdit(id) {
    $('#staticModalLabel').text('Edit Product');
    clearForm();
    productSelected = await findById(id);
    console.log(productSelected)
    showImgInForm(productSelected.images);
    for (let i = 0; i < productSelected.images.length; i++) {

        const url = productSelected.images[i];

        // Tìm vị trí của ký tự "/" cuối cùng trong URL
        const lastSlashIndex = url.lastIndexOf("/");

        // Lấy chuỗi con bắt đầu từ vị trí sau dấu "/" cuối cùng
        const subString = url.substring(lastSlashIndex + 1);

        // Tìm vị trí của dấu "." trong chuỗi con
        const dotIndex = subString.indexOf(".");

        // Lấy chuỗi con từ đầu cho đến vị trí dấu "."
        const result = subString.substring(0, dotIndex);
        idImages.push(result)
    }
    renderForm(formBody, getDataInput());
    $('#staticModal').modal('show');
}

function showImgInForm(images) {
    const imgEle = document.getElementById("images-container");
    const imageOld = imgEle.querySelectorAll('#image');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }
    images.forEach((img, index) => {
        const imageHTML = `<label id="image" for="file" style="position: relative; margin-right:30px" class="mt-5">
                          <img class="image-preview" src="${img}" style="height: 120px; width: 120px"/>
                          <button type="button" class="btn-close" aria-label="Close" style="position: absolute; top: 0; right: 0;" onclick="removeImageInForm(this)"></button>
                        </label>`

        imgEle.innerHTML += imageHTML;
    })
}

const findById = async (id) => {
    const response = await fetch('/api/products/' + id);
    return await response.json();
}

async function editProduct(data) {
    const res = await fetch('/api/products/' + data.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res;
}

async function deleteProduct(id) {
    let confirmBox = webToast.confirm("Bạn chắc chắn muốn xóa chứ??");
    confirmBox.click(async function () {

        const res = await fetch('/api/products/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });

        if (res.ok) {

            // alert("Deleted");
            webToast.Success({
                status: 'Xóa sản phẩm thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            });

            await getList();
        } else {
            webToast.Danger({
                status: 'Không thể xóa sản phẩm',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        }
    });
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

async function previewImage(evt) {
    if (evt.target.files.length === 0) {
        return;
    }

    const imgEle = document.getElementById("images");

    // When the image is loaded, update the img element's src
    const files = evt.target.files
    // Sử dụng Promise.all để tải lên và hiển thị nhiều ảnh cùng một lúc
    const promises = Array.from(files).map(file => previewImageFile(file));
    await Promise.all(promises);
}

async function previewImageFile(file) {
    listFilesOfImagePreview.push(file);
    console.log(listFilesOfImagePreview)
    const reader = new FileReader();
    reader.onload = function () {
        const imgEle = document.getElementById("images-container");

        const label = document.createElement('label');
        label.id = "image";
        label.htmlFor = "file";
        label.style.position = "relative";
        label.style.marginRight = "30px";
        label.classList.add("mt-5");

        const img = document.createElement('img');
        img.className = "image-preview";
        img.src = reader.result;
        img.style.height = "120px";
        img.style.width = "120px";

        const closeButton = document.createElement('button');
        closeButton.type = "button";
        closeButton.className = "btn-close";
        closeButton.setAttribute("aria-label", "Close");
        closeButton.style.position = "absolute";
        closeButton.style.top = "0";
        closeButton.style.right = "0";
        closeButton.dataset.fileName = file.name; // Sử dụng thuộc tính data-file để truyền thông tin đối tượng File
        closeButton.addEventListener("click", () => removeImageInForm(closeButton)); // Truyền closeButton vào hàm removeImageInForm

        label.appendChild(img);
        label.appendChild(closeButton);

        imgEle.appendChild(label);

    };
    reader.readAsDataURL(file);
}

function removeImageInForm(closeButton) {
    // Truy cập phần tử cha (label) của nút được bấm (button)
    const label = closeButton.parentElement;

    // Truy cập phần tử cha của label (div)
    const div = label.parentElement;

    // Xóa div chứa ảnh
    div.removeChild(label);

    const fileName = closeButton.dataset.fileName
    // Xóa file tương ứng khỏi mảng listFilesOfImagePreview
    if(fileName){
        const index = listFilesOfImagePreview.findIndex(f => f.name === fileName);
        if (index !== -1) {
            listFilesOfImagePreview.splice(index, 1);
            console.log(listFilesOfImagePreview)
        }
    } else {
        const img = label.querySelector('img');
        const url = img.src;

        // Tìm vị trí của ký tự "/" cuối cùng trong URL
        const lastSlashIndex = url.lastIndexOf("/");

        // Lấy chuỗi con bắt đầu từ vị trí sau dấu "/" cuối cùng
        const subString = url.substring(lastSlashIndex + 1);

        // Tìm vị trí của dấu "." trong chuỗi con
        const dotIndex = subString.indexOf(".");

        // Lấy chuỗi con từ đầu cho đến vị trí dấu "."
        const result = subString.substring(0, dotIndex);

        const index = idImages.findIndex(i => i === result);
        if (index !== -1) {
            idImages.splice(index, 1);
        }
    }

}

// 2 hàm để tự động Disable nút SaveChange khi tải ảnh lên
function disableSaveChangesButton() {
    const saveChangesButton = document.getElementById('saveChangesButton');
    saveChangesButton.disabled = true;
}

function enableSaveChangesButton() {
    const saveChangesButton = document.getElementById('saveChangesButton');
    saveChangesButton.disabled = false;
}

async function saveImageToDB() {
    try {
        const formData = new FormData();
        console.log(listFilesOfImagePreview)
        // Thêm các tệp vào FormData
        for (const file of listFilesOfImagePreview) {
            formData.append('files', file);
        }

        // Make a POST request to upload the image
        const response = await fetch("/api/productImages", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            const result = await response.json();
            for (let i = 0; i < result.length; i++) {
                const id = result[i].id;
                idImages.push(id);
            }
        } else {
            // Handle non-OK response (e.g., show an error message)
            console.error('Failed to upload image:', response.statusText);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('An error occurred:', error);
    }
}





