import { arrayOfComments, name, sedingsServer, deleteTodo, addedComments, id } from "./api.js";
import { disablingButton } from "./utils.js";
import { addingLikes } from "./utils.js";
import { enterInput } from "./utils.js";
import { changesComments } from "./utils.js";
import { commentЕditor } from "./utils.js";

export const renderChangingMarkup = () => {
  const appElement = document.querySelector("#app");
  const arrayCommentsHtml = arrayOfComments
    .map((item, index) => {
      return `<ul class="comments">
      <li class="comment" data-delete="${index}">
        <div class="comment-header">
          <div>${item.name}</div>
          <div>${item.date}</div>
        </div>
        <div class="comment-body" data-edit="${index}">
        ${item.isEdit
          ? `<textarea type="textarea" class='add-form-text' rows="4">${item.text}</textarea>`
          : `<div class="comment-text data-div=${index}">
          ${item.text}
        </div>`
        }
        </div>
        <button data-edit="${index}" class="save-button ">${item.isEdit ? "Сохранить" : "Редактировать"
        }</button> <br>
         <button data-id="${item.id}" id="form-button-delete" class="delete-button">Удалить</button>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${item.likes}</span>
            <button class="like-button ${item.islover ? "-active-like" : ""
        }" data-index="${index}"></button>
          </div>
        </div>  
      </li>
    </ul>`;
    })

    .join("");

  const appHtml = ` <div class="container">
    <div id="load" class="text-load">
      <p>Обновление ленты комментариев, пожалуйста подождите!</p>
    </div>
    <ul class="comments">
      ${arrayCommentsHtml}
    </ul>
    <br />
    <div style="display: none; color: rgb(255, 255, 255)" class="loading-add">
      <p>Комментарий добавляется</p>
    </div>
    <div id="add-form" class="add-form">
      <input value="${name}" readonly id="form-name" type="text" class="add-form-name" placeholder="Введите ваше имя" />
      <textarea
      id="form-text"
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш коментарий"
        rows="4"
      ></textarea>
      <div class="add-form-row">
        <button id="form-button" class="add-form-button">Написать</button>
        
      </div>
    </div>
  </div>`;

  appElement.innerHTML = appHtml;

  addingLikes();
  enterInput();
  commentЕditor();
  changesComments();
  disablingButton();

  const inputName = document.getElementById("form-name");
  const inputComments = document.getElementById("form-text");
  const button = document.getElementById("form-button");
  const buttonDelete = document.querySelectorAll("#form-button-delete");

  button.addEventListener("click", () => {
    console.log(1);
    inputName.classList.remove("error");
    if (inputName.value === "") {
      inputName.classList.add("error");
    }
    inputComments.classList.remove("error");
    if (inputComments.value === "") {
      inputComments.classList.add("error");
      return;
    }

    sedingsServer();

  });
  for (const buttonDeletes of buttonDelete) {
    buttonDeletes.addEventListener("click", (event) => {
      event.stopPropagation()

      const id = buttonDeletes.dataset.id;

      deleteTodo({ id }).then(() => {
        addedComments();
      });
    });
  }

  inputComments.addEventListener("input", disablingButton);
};


