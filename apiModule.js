const loader = document.getElementById("loader");

export function showLoader() {
  loader.style.display = "inline-block";
}

export function hideLoader() {
  loader.style.display = "none";
}

export function getCommentsFromAPI() {
  showLoader();
  return fetch("https://wedev-api.sky.pro/api/v1/daniil-kit/comments", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }
      return response.json();
    })
    .catch(handleNetworkError);
}

function handleNetworkError() {
  alert("Ошибка: Произошла проблема с сетью. Проверьте ваше интернет-соединение.");
}
