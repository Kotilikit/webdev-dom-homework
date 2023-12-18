import { showLoader, hideLoader, getCommentsFromAPI } from './apiModule.js';

export function sendCommentToAPI(comment) {
  showLoader();

  return fetch("https://wedev-api.sky.pro/api/v1/daniil-kit/comments", {
    method: "POST",
    body: JSON.stringify({
      name: comment.author,
      text: comment.text,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }
      return response.json();
    })
    .then(() => getCommentsFromAPI())
    .finally(() => {
      hideLoader();
    });
}
