const mainquizButton = document.getElementById("start-q");
mainquizButton.addEventListener("click", () => {
    window.location.href = "quiz.html";
});
const returnmainButton = document.getElementById("return-home");
returnmainButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

fetch ("questions.json")
