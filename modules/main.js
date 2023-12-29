import { startRender } from "./startRender.js";
import { currentDate } from "./utils.js";

const textElementsLoad = document.querySelector(".text-load");
textElementsLoad.style.display = "block";

const url = "https://wedev-api.sky.pro/api/v2/daniil-kit/comments";
export const startPage = () => {
    return fetch(url, {
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

            console.log(massComments);
            startRender({ massComments })

        })
        .catch((error) => {
            alert("Произошла проблема с сетью. Проверьте ваше интернет-соединение.");
            console.error(error);
        });
};

startPage()




