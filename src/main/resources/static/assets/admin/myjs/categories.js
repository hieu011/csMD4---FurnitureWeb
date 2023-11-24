const categoryForm = document.getElementById('categoryForm');
const tBody = document.getElementById("tBody");
const ePagination = document.getElementById("pagination");
const eSearch = document.querySelector('#search');
const formBody = document.getElementById('formBody');

let indexOfCategories = 1;
let categorySelected = {};
let pageable = {
    page: 1,
    sort: 'id,asc',
    search: ''
}

let categories = [];

categoryForm.onsubmit = async (e) => {
    e.preventDefault();
    let data = getDataFromForm(categoryForm);
    data = {
        ...data,
        id: categorySelected.id
    }
    if (categorySelected.id) {
        const response = await editCategory(data);
        if (response.ok) {
            webToast.Success({
                status: 'Sửa thể loại thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            })
        } else {
            webToast.Danger({
                status: 'Không thể sửa thể loại',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        }
    } else {
        const response = await createCategory(data)
        if (response.ok) {
            idImages = [];
            webToast.Success({
                status: 'Thêm thể loại thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        } else {
            webToast.Danger({
                status: 'Không thể thêm thể loại',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        }

    }
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
    const response = await fetch(`/api/categories?page=${pageable.page - 1 || 0}&search=${pageable.search || ''}&sort=${sortParam || ''}`);

    if (!response.ok) {
        // Xử lý trường hợp không thành công ở đây, ví dụ: throw một lỗi hoặc trả về một giá trị mặc định
        throw new Error("Failed to fetch data");
    }

    const result = await response.json();
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
        indexOfCategories++;
    })
    tBody.innerHTML = str;
}

const genderPagination = () => {
    ePagination.innerHTML = '';
    let str = '';
    // Cập nhật indexOfProducts
    if (pageable.page === 1) {
        indexOfCategories = 1;
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
        indexOfCategories = (pageable.page - 1) * 5 + 1;
        getList();
    }
    for (let i = 1; i < ePages.length - 1; i++) {
        if (i === pageable.page) {
            continue;
        }
        ePages[i].onclick = () => {
            pageable.page = i;
            // Update indexOfProducts based on the current page
            indexOfCategories = (pageable.page - 1) * 5 + 1;
            getList();
        }
    }
}

function renderItemStr(item) {
    return `<tr style="text-align: center" >
                  <td>${indexOfCategories}</td>
                  <td title="${item.description}">
                    <i class="fab fa-angular fa-lg text-danger"></i>
                    <strong>${item.name}</strong>
                  </td>
                  <td>
                    <i class="fab fa-angular fa-lg text-danger"></i>
                      <strong>${item.description}</strong>
                  </td>
                  <td>
                    <div class="dropdown">
                      <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="bx bx-dots-vertical-rounded"></i>
                      </button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="javascript:void(0);" onclick="showEdit(${item.id})">
                        <i class="bx bx-edit-alt me-1"></i> Edit</a>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="deleteCategory(${item.id})">
                        <i class="bx bx-trash me-1"></i> Delete</a>
                      </div>
                    </div>
                  </td>
                </tr>`
}


window.onload = async () => {
    await renderTable();
    renderForm(formBody, getDataInput());
}


function getDataInput() {
    return [
        // {
        //     label: 'Id',
        //     name: 'id',
        //     value: categorySelected.id,
        //     readonly: true,
        //     disabled: true
        // },
        {
            label: 'Name',
            name: 'name',
            value: categorySelected.name,
            required: true,
            pattern: "^[A-Za-zÀ-Ỷà-ỷẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯưỨứỪừỰựỬửỮữỨứỬửỰựỦủỤụỠỡỞởỢợỞởỚớỔổỒồỐốỎỏỊịỈỉỌọỈỉỊịỆệỄễỀềẾếỂểỈỉỄễỆệỂểỀề0-9 ,.()]{6,100}",
            message: "Name of category must have minimum is 6 characters and maximum is 100 characters",
        },
        {
            label: 'Description',
            name: 'description',
            value: categorySelected.description,
            required: true,
            pattern: "^[A-Za-zÀ-Ỷà-ỷẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯưỨứỪừỰựỬửỮữỨứỬửỰựỦủỤụỠỡỞởỢợỞởỚớỔổỒồỐốỎỏỊịỈỉỌọỈỉỊịỆệỄễỀềẾếỂểỈỉỄễỆệỂểỀề0-9 ,.()]{6,100}",
            message: "Description must have minimum is 6 characters and maximum is 100 characters",
        }
    ];
}


async function renderTable() {
    const pageable = await getList();
    indexOfCategories = 1;
    categories = pageable.content;
    renderTBody(categories);
}

function clearForm() {
    categoryForm.reset();
    categorySelected = {};
}

function showCreate() {
    $('#staticModalLabel').text('Create Category');
    clearForm();
    renderForm(formBody, getDataInput())
}

async function createCategory(data) {
    const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res;
}

async function showEdit(id) {
    $('#staticModalLabel').text('Edit Category');
    clearForm();
    categorySelected = await findById(id);
    console.log(categorySelected)
    renderForm(formBody, getDataInput());
    $('#staticModal').modal('show');
}

const findById = async (id) => {
    console.log(id)
    const response = await fetch('/api/categories/' + id);
    return await response.json();
}

async function editCategory(data) {
    const res = await fetch('/api/categories/' + data.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res;
}

async function deleteCategory(id) {
    let confirmBox = webToast.confirm("Bạn chắc chắn muốn xóa chứ??");
    confirmBox.click(async function () {

        const res = await fetch('/api/categories/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });

        if (res.ok) {

            // alert("Deleted");
            webToast.Success({
                status: 'Xóa thể loại thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            });

            await getList();
        } else {
            webToast.Danger({
                status: 'Không thể xóa thể loại',
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
