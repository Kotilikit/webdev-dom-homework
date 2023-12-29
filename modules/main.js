import { startRender } from "./startRender.js";
// import { currentDate } from "./utils.js";
import { format } from "date-fns";

const textElementsLoad = document.querySelector(".text-load");
textElementsLoad.style.display = "block";

export const now = new Date()
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
                    date: format(now, 'yyyy-MM-dd hh.mm.ss'),
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




