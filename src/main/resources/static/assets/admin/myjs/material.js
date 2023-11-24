const materialForm = document.getElementById('materialForm');
const tBody = document.getElementById("tBody");
const ePagination = document.getElementById("pagination");
const eSearch = document.querySelector('#search');
const formBody = document.getElementById('formBody');

let indexOfMaterials = 1;
let materialSelected = {};
let pageable = {
    page: 1,
    sort: 'id,asc',
    search: ''
}

let materials = [];

materialForm.onsubmit = async (e) => {
    e.preventDefault();
    let data = getDataFromForm(materialForm);
    data = {
        ...data,
        id: materialSelected.id
    }
    if (materialSelected.id) {
        const response = await editMaterial(data);
        if (response.ok) {
            webToast.Success({
                status: 'Sửa vật liệu thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            })
        } else {
            webToast.Danger({
                status: 'Không thể sửa vật liệu',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        }
    } else {
        const response = await createMaterial(data)
        if (response.ok) {
            idImages = [];
            webToast.Success({
                status: 'Thêm vật liệu thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            });
        } else {
            webToast.Danger({
                status: 'Không thể thêm vật liệu',
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
    const response = await fetch(`/api/materials?page=${pageable.page - 1 || 0}&search=${pageable.search || ''}&sort=${sortParam || ''}`);

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
        indexOfMaterials++;
    })
    tBody.innerHTML = str;
}

const genderPagination = () => {
    ePagination.innerHTML = '';
    let str = '';
    // Cập nhật indexOfProducts
    if (pageable.page === 1) {
        indexOfMaterials = 1;
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
        indexOfMaterials = (pageable.page - 1) * 5 + 1;
        getList();
    }
    for (let i = 1; i < ePages.length - 1; i++) {
        if (i === pageable.page) {
            continue;
        }
        ePages[i].onclick = () => {
            pageable.page = i;
            // Update indexOfProducts based on the current page
            indexOfMaterials = (pageable.page - 1) * 5 + 1;
            getList();
        }
    }
}

function renderItemStr(item) {
    return `<tr style="text-align: center">
                  <td>${indexOfMaterials}</td>
                  <td title="${item.description}">
                    <i class="fab fa-angular fa-lg text-danger"></i>
                    <strong>${item.name}</strong>
                  </td>
                  <td>
                    <div class="dropdown">
                      <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="bx bx-dots-vertical-rounded"></i>
                      </button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="javascript:void(0);" onclick="showEdit(${item.id})">
                        <i class="bx bx-edit-alt me-1"></i> Edit</a>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="deleteMaterial(${item.id})">
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
        {
            label: 'Name',
            name: 'name',
            value: materialSelected.name,
            required: true,
            pattern: "^[A-Za-zÀ-Ỷà-ỷẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯưỨứỪừỰựỬửỮữỨứỬửỰựỦủỤụỠỡỞởỢợỞởỚớỔổỒồỐốỎỏỊịỈỉỌọỈỉỊịỆệỄễỀềẾếỂểỈỉỄễỆệỂểỀề0-9 ,.()]{6,100}",
            message: "Name of material must have minimum is 6 characters and maximum is 100 characters",
        }
    ];
}


async function renderTable() {
    const pageable = await getList();
    indexOfMaterials = 1;
    materials = pageable.content;
    renderTBody(materials);
}

function clearForm() {
    materialForm.reset();
    materialSelected = {};
}

function showCreate() {
    $('#staticModalLabel').text('Create Material');
    clearForm();
    renderForm(formBody, getDataInput())
}

async function createMaterial(data) {
    const res = await fetch('/api/materials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res;
}

async function showEdit(id) {
    $('#staticModalLabel').text('Edit Material');
    clearForm();
    materialSelected = await findById(id);
    console.log(materialSelected)

    renderForm(formBody, getDataInput());
    $('#staticModal').modal('show');
}

const findById = async (id) => {
    const response = await fetch('/api/materials/' + id);
    return await response.json();
}

async function editMaterial(data) {
    const res = await fetch('/api/materials/' + data.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res;
}

async function deleteMaterial(id) {
    let confirmBox = webToast.confirm("Bạn chắc chắn muốn xóa chứ??");
    confirmBox.click(async function () {

        const res = await fetch('/api/materials/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });

        if (res.ok) {

            // alert("Deleted");
            webToast.Success({
                status: 'Xóa vật liệu thành công',
                message: '',
                delay: 2000,
                align: 'topright'
            });

            await getList();
        } else {
            webToast.Danger({
                status: 'Không thể xóa vật liệu',
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