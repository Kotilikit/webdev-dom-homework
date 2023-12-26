import { currentDate } from "./utils.js";
import { renderChangingMarkup } from "./render.js";
const textElementsLoad = document.querySelector(".text-load");
const inputName = document.querySelector(".add-form-name");
const inputComments = document.querySelector(".add-form-text");
const button = document.querySelector(".add-form-button");
const loadingElements = document.querySelector(".loading-add");
const formElements = document.querySelector(".add-form");

export { arrayOfComments };

let arrayOfComments = [];

export const addedComments = () => {
  return fetch("https://wedev-api.sky.pro/api/v1/daniil-kit/comments", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      textElementsLoad.style.display = "none";
      return response;
    })
    .then((responseCommets) => {
      const massComments = responseCommets.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: currentDate(new Date(comment.date)),
          text: comment.text,
          likes: comment.likes,
          islover: false,
          isEdit: false,
        };
      });

      arrayOfComments = massComments;
      renderChangingMarkup();
      console.log(arrayOfComments);
    })
    .catch((error) => {
      alert("Произошла проблема с сетью. Проверьте ваше интернет-соединение.");
      console.error(error);
    });
};

export const addTodo = (name, text) => {
  return fetch("https://wedev-api.sky.pro/api/v1/daniil-kit/comments", {
    method: "POST",
    body: JSON.stringify({
      text: text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      name: name
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      forceError: true,
    }),
  });
};

export const sedingsServer = () => {
  loadingElements.style.display = "block";
  formElements.style.display = "none";

  addTodo(inputName.value, inputComments.value)
    .then((response) => {
      return response;
    })
    .then((responseData) => {
      if (responseData.status === 201) {
        return responseData.json();
      } else if (responseData.status === 400) {
        throw new Error("Неверный ввод");
      } else if (responseData.status === 500) {
        console.log(responseData.status);
        throw new Error("Ошибка сервера");
      } else {
        throw new Error("Произошла проблема с сетью. Проверьте ваше интернет-соединение.");
      }
    })
    .then(() => {
      return addedComments();
    })
    .then(() => {
      button.disabled = true;
      inputName.value = "";
      inputComments.value = "";
      loadingElements.style.display = "none";
      formElements.style.display = "flex";
    })
    .catch((error) => {
      loadingElements.style.display = "block";
      formElements.style.display = "none";
      if (error.message === "Неверный ввод") {
        alert("Имя и комментарий должны быть не короче 3 символов");
      } else if (error.message === "Ошибка сервера") {
        addTodoError();
      } else {
        alert("Произошла проблема с сетью. Проверьте ваше интернет-соединение.");
      }
    });
};

export function addTodoError() {
  addTodo(inputName.value, inputComments.value)
    .then((response) => {
      return response;
    })
    .then((responseData) => {
      console.log(responseData);
      if (responseData.status === 500) {
        throw new Error("Ошибка сервера");
      } else {
        return responseData.json();
      }
    })
    .then(() => {
      return addedComments();
    })
    .then(() => {
      button.disabled = true;
      inputName.value = "";
      inputComments.value = "";
      loadingElements.style.display = "none";
      formElements.style.display = "flex";
    })
    .catch((error) => {
      alert(
        "Проблема с сервером, делается повторный запрос."
      );
      loadingElements.style.display = "block";
      formElements.style.display = "none";
      addTodoError();
    });
}