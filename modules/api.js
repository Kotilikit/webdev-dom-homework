import { currentDate } from "./utils.js";
import { renderChangingMarkup } from "./render.js";

const textElementsLoad = document.querySelector(".text-load");
const inputName = document.getElementById("form-name");
const inputComments = document.getElementById("form-text");
const button = document.querySelector(".add-form-button");
const loadingElements = document.querySelector(".loading-add");

const url = "https://wedev-api.sky.pro/api/v2/daniil-kit/comments/";
const userUrl = "https://wedev-api.sky.pro/api/user/login";

export let token;
export function userToken(newToken) {
  token = newToken;
}

export let id;

export function userId(newId) {
  id = newId;
}

export let name;

export function userName(newName) {
  name = newName
}

export { arrayOfComments };

let arrayOfComments = [];

export const addedComments = () => {
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
          id: comment.id,
        };
      });

      arrayOfComments = massComments;
      renderChangingMarkup();

      console.log(arrayOfComments);
    })
};

export const addTodo = (name, text) => {
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const formElements = document.getElementById("add-form");
  const inputName = document.getElementById("form-name");
  const inputComments = document.getElementById("form-text");
  const loadingElements = document.querySelector(".loading-add");
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
      loadingElements.style.display = "none";
      formElements.style.display = "flex";
      if (error.message === "Неверный ввод") {
        alert("Имя и комментарий должны быть не короче 3 символов");
      } else if (error.message === "Ошибка сервера") {
        addTodoError();
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
        throw new Error("Сломался сервер");
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
        "Ошибка сервера. Повторный запрос."
      );
      loadingElements.style.display = "block";
      formElements.style.display = "none";
      addTodoError();
    });
}

export function deleteTodo({ id }) {
  return fetch(url + id, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    .then((response) => {
      return response.json();
    });
}

export const login = ({ login, password }) => {
  return fetch(userUrl, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((responseData) => {
    if (responseData.status === 201) {
      return responseData.json();
    } else if (responseData.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
  }).catch((error) => {
    if (error.message === "Неверный логин или пароль") {
      alert("Введен неправильный логин или пароль!")
    }
  })
};


