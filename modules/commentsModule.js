import { showLoader, hideLoader, getCommentsFromAPI } from './apiModule.js';
import { escapeHTML, getCurrentDateTime } from './utils.js';
import { sendCommentToAPI } from './postModule.js';

let commentsData = [];
const commentsList = document.getElementById("commentList");

export function loadComments() {
  console.log('Загрузка комментариев...');
  return getCommentsFromAPI()
    .then((responseData) => {
      commentsData = responseData.comments.map((comment) => {
        return {
          author: comment.author.name,
          date: new Date(comment.date),
          likes: comment.likes,
          isLiked: false,
          text: comment.text,
        };
      });
      renderComments(commentsData);
    })
    .finally(() => {
      hideLoader();
      console.log('Комментарии загружены.');
    });
}

export function addComment() {
  console.log('Отправка комментария...');

  const addButton = document.getElementById("submitButton");
  const nameInput = document.getElementById("nameInput");
  const textInput = document.getElementById("commentInput");

  const name = nameInput.value;
  const text = textInput.value;

  if (name.trim() === "" || text.trim() === "") {
    alert("Пожалуйста, введите и имя, и комментарий!");
    return;
  }

  addButton.disabled = true;
  showLoader();

  const newComment = {
    author: escapeHTML(name),
    date: getCurrentDateTime(),
    text: escapeHTML(text),
    likes: 0,
    isLiked: false,
  };

  sendCommentToAPI(newComment)
    .then(() => {
      commentsData.push(newComment);
      renderComments(commentsData);
    })
    .catch((error) => handlePostError(error))
    .finally(() => {
      addButton.disabled = false;
      hideLoader();
      console.log('Комментарий отправлен.');
    });

  nameInput.value = "";
  textInput.value = "";

  checkFormValidity();
}

export function deleteLastComment() {
  if (commentsData.length > 0) {
    commentsData.pop();
    renderComments(commentsData);
  }
}

export function handleLikeButtonClick(button) {
  const commentIndex = button.dataset.commentIndex;
  if (commentIndex !== undefined) {
    const comment = commentsData[commentIndex];
    comment.isLiked = !comment.isLiked;
    comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;
    renderComments(commentsData);
  }
}

export function handleReplyButtonClick(button) {
  const commentIndex = button.dataset.commentIndex;
  const commentAuthor = commentsData[commentIndex].author;
  const commentText = commentsData[commentIndex].text;

  const quotedComment = `
    <div class="quote">
      <div>${commentAuthor}</div>
      <div>${commentText}</div>
    </div>
  `;

  const currentText = document.getElementById("commentInput").value;
  document.getElementById("commentInput").value = `${currentText}${quotedComment}\n`;
  document.getElementById("commentInput").focus();
}

export function handleEditButtonClick(button) {
  const commentIndex = button.dataset.commentIndex;
  const commentText = commentsData[commentIndex].text;

  const commentTextElement = document.querySelector(`.comment-text[data-comment-index="${commentIndex}"]`);
  commentTextElement.style.display = "none";

  const editTextarea = document.querySelector(`.edit-comment-textarea[data-comment-index="${commentIndex}"]`);
  editTextarea.value = commentText;
  editTextarea.style.display = "block";

  button.style.display = "none";

  const saveButton = document.querySelector(`.save-button[data-comment-index="${commentIndex}"]`);
  saveButton.style.display = "block";
}

export function handleSaveButtonClick(button) {
  const commentIndex = button.dataset.commentIndex;
  const editedText = document.querySelector(`.edit-comment-textarea[data-comment-index="${commentIndex}"]`).value;

  commentsData[commentIndex].text = escapeHTML(editedText);
  renderComments(commentsData);
}

export function checkFormValidity() {
  const addButton = document.getElementById("submitButton");
  const nameInput = document.getElementById("nameInput");
  const textInput = document.getElementById("commentInput");

  const isFormValid = nameInput.value.trim() !== "" && textInput.value.trim() !== "";
  addButton.disabled = !isFormValid;
  addButton.style.backgroundColor = isFormValid ? "#bcec30" : "#ccc";
}

function renderComments(comments) {
  commentsList.innerHTML = "";
  comments.forEach((comment, index) => {
    const newComment = document.createElement("li");
    newComment.className = "comment";
    newComment.innerHTML = `
      <div class="comment-header">
        <div>${comment.author}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text" data-comment-index="${index}" style="white-space: pre-line;">${processQuotes(comment.text)}</div>
        <textarea class="edit-comment-textarea" data-comment-index="${index}" style="display: none;">${comment.text}</textarea>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-comment-index="${index}"></button>
        </div>
        <button class="edit-button" data-comment-index="${index}">Редактировать</button>
        <button class="save-button" data-comment-index="${index}" style="display: none;">Сохранить</button>
        <button class="reply-button" data-comment-index="${index}">Ответить</button>
      </div>
    `;
    commentsList.appendChild(newComment);
  });
}

function processQuotes(text) {
  return text.replaceAll("BEGIN_QUOTE", "<div class='quote'>");
}
