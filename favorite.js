const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const users = JSON.parse(localStorage.getItem('favoriteUsers'));
const dataPanel = document.querySelector("#data-panel");

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

function removeFromFavorite(id) {
  if (!users) return;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return;
  users.splice(userIndex, 1);
  localStorage.setItem('favoriteUsers', JSON.stringify(users));
  renderUserList(users);
}

// 監聽 data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".card-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

// render畫面函式
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-6 col-sm-4 col-md-3">
        <div class="mb-3">
          <div class="card">
            <img src="${item.avatar}" class="card-img-top card-show-user" alt="User Poster" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">
            <div class="card-body">
              <h5 class="card-title" id="user-card-title">${item.name}</h5>
              <h6 class="card-title" id="user-sub-title">${item.birthday}</h6>
              <button class="btn btn-danger btn-remove-favorite  float-right" style="border-radius:20px" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

// 繪製畫面
renderUserList(users);
