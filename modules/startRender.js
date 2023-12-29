import { renderLogin } from "./loginPage.js";

export const startRender = ({ massComments }) => {
  console.log(massComments);
  const appElement = document.querySelector("#app");
  const arrayCommentsHtml = massComments
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
          <button data-edit="${index}" class="save-button">${item.isEdit ? "Сохранить" : "Редактировать"
        }</button>
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

  const html = ` <div class="container">   
    <ul class="comments">
      ${arrayCommentsHtml}
    </ul> <br>
      <div>Чтобы оставить комментарий <a id="link" href="#">авторизуйтесь</a></div>
      </div>`
      
  appElement.innerHTML = html

  document.getElementById('link').addEventListener('click', () => {
    renderLogin()
  })
}