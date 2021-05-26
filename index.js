const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 12;

const users = [];
let filteredUsers = [];

let searchSelector = 'name';
const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator");
const searchSelect = document.querySelector('#search-select');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users;
  const startIndex = (page - 1) * USERS_PER_PAGE;
  return data.slice(startIndex, startIndex + USERS_PER_PAGE);
}

function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title");
  const modalAvatar = document.querySelector("#user-modal-avatar");
  const modalGender = document.querySelector("#user-gender");
  const modalAge = document.querySelector("#user-age");
  const modalRegion = document.querySelector("#user-region");
  const modalBirthday = document.querySelector("#user-birthday");
  const modalEmail = document.querySelector("#user-email");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      modalTitle.innerText = data.name + " " + data.surname;
      modalAvatar.innerHTML = `<img src="${data.avatar}" alt="user-poster" class="rounded mx-auto d-block">`;
      modalGender.innerText = "Gender: " + data.gender;
      modalAge.innerText = "Age: " + data.age;
      modalRegion.innerText = "Region: " + data.region;
      modalBirthday.innerText = "Birthday: " + data.birthday;
      modalEmail.innerHTML = `<a href='mailto:${data.email}'>Email: ${data.email}</a>`;
    })
    .catch((err) => console.log(err));
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || [];
  if (list.some((user) => user.id === id)) {
    return alert('The User has been added!');
  }
  const addUser = users.find((user) => user.id === id);
  list.push(addUser);
  localStorage.setItem('favoriteUsers', JSON.stringify(list));
}

// 監聽 data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".card-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

// 監聽分頁器
paginator.addEventListener("click", function onPaginatorClick(event) {
  if (event.target.tagName !== 'A') return;

  const page = Number(event.target.dataset.page);
  renderUserList(getUsersByPage(page));
});

// 監聽 searchSelect
searchSelect.addEventListener("change", function onSearchSelectChange(event) {
  searchSelector = event.target.value;
});

// 監聽 searchSubmit
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  searchInput.value = '';
  filteredUsers = users.filter((user) => {
    if (searchSelector === 'birthday') {
      return user.birthday.toLowerCase().includes(keyword);
    } else {
      return user.name.toLowerCase().includes(keyword);
    }
  });
  if (filteredUsers.length === 0) {
    return alert(`Not found any user's ${searchSelector} about ${keyword}`);
  }

  renderPaginator(filteredUsers.length);
  renderUserList(getUsersByPage(1));
});

// render畫面函式
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE);
  let rawHTML = '';
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-6 col-sm-4 col-md-3">
        <div class="mb-3">
          <div class="card">
            <img src="${item.avatar}" class="card-img-top card-show-user" alt="User Poster" data-toggle="modal"  data-target="#user-modal" data-id="${item.id}">
            <div class="card-body">
              <h5 class="card-title" id="user-card-title">${item.name}</h5>
              <h6 class="card-title" id="user-sub-title">${item.birthday}</h6>
              <button class="btn btn-info btn-add-favorite float-right" style="border-radius:20px" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

// 取得資料繪製畫面
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderPaginator(users.length);
    renderUserList(getUsersByPage(1));
  })
  .catch((err) => console.log(err));
