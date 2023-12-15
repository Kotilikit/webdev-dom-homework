import { loadComments, addComment, deleteLastComment, handleLikeButtonClick, handleReplyButtonClick, handleEditButtonClick, handleSaveButtonClick, checkFormValidity } from './commentsModule.js';

document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("submitButton");
  const deleteButton = document.getElementById("deleteLastCommentButton");
  const nameInput = document.getElementById("nameInput");
  const textInput = document.getElementById("commentInput");

  addButton.addEventListener("click", function () {
    addComment(nameInput.value, textInput.value);
  });

  deleteButton.addEventListener("click", deleteLastComment);
  nameInput.addEventListener("input", checkFormValidity);
  textInput.addEventListener("input", checkFormValidity);

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("like-button")) {
      handleLikeButtonClick(target);
    }

    if (target.classList.contains("reply-button")) {
      handleReplyButtonClick(target);
    }

    if (target.classList.contains("edit-button")) {
      handleEditButtonClick(target);
    }

    if (target.classList.contains("save-button")) {
      handleSaveButtonClick(target);
    }

    if (!target.closest(".comment-footer") && !target.classList.contains("edit-comment-textarea")) {
      const commentIndex = target.closest(".comment") ? target.closest(".comment").querySelector(".reply-button").dataset.commentIndex : null;
      if (commentIndex !== null) {
        handleReplyButtonClick(target.closest(".comment").querySelector(`.reply-button[data-comment-index="${commentIndex}"]`));
      }
    }
  });

  loadComments();
});

