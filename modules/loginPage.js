import { login, userName, userToken, addedComments, userId } from "./api.js";

export function renderLogin() {
  const appElement = document.querySelector("#app");
  const loginHtml = `<div class="container">
    <div class="add-form">
      <h3>Авторизация</h3>
      <input
        id="login-input"
        type="text"
        class="add-form-name"
        placeholder="Введите ваш логин"
      /><br />
      <input
        id="login-password"
        type="text"
        class="add-form-name"
        placeholder="Введите ваш пароль"
      />
      <div class="add-form-row">
        <button id="login-button" class="add-form-button">Войти</button>
      </div>
    </div>
  </div>`;

  appElement.innerHTML = loginHtml;
  console.log(appElement.innerHTML);

  const lohinInputElement = document.querySelector("#login-input");
  const loginPasswordElement = document.querySelector("#login-password");
  const loginButtonElement = document.querySelector("#login-button");

  loginButtonElement.addEventListener("click", clickButton);

  function clickButton() {
    login({
      login: lohinInputElement.value,
      password: loginPasswordElement.value,
    })
      .then((responseData) => {
        userToken(responseData.user.token);
        console.log(responseData.user.token);
        userName(responseData.user.name);
        console.log(responseData.user.name);
        userId(responseData.user._id)
      })
      .then(() => {
        addedComments();
      });
  }
}

