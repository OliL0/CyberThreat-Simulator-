const mainquizButton = document.getElementById("start-q");
mainquizButton.addEventListener("click", () => {
    window.location.href = "quiz.html";
});
const returnmainButton = document.getElementById("return-home");
returnmainButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

let scenarios = [];
let currentScenario = [];
let score = 0;
let wrong = 0;
let difficultyLevel = "medium";
let previousDifficulty = [];
let answeredScenario = false;

fetch ("questions/questions.json")
    .then(r => r.json())
    .then(data => {
        questions = data.scenarios;
    });


function beginQuiz() {
    scenarios = [...questions].sort(() => Math.random() - 0.5);
    currentScenario = 0;
    score = 0;
    wrong = 0;
    difficultyLevel = "medium";
    previousDifficulty = [];
    answeredScenario = false;
    loadScenario();
}

function loadScenario() {
    const q = scenarios[current];
    answeredScenario = false;

    document.getElementById("main-title").textContent = question["main-title"];
    document.getElementById("scene-info").textContent = question["scene-info"];
    document.getElementById("sender").textContent = "From: " + question.scenario.sender;
    document.getElementById("message-date").textContent = "Date: " + question.scenario["message-date"];
    document.getElementById("title").textContent = question.scenario.title;
    document.getElementById("content").innerHTML = "<p>" + question.scenario.content + "</p>";

    const feedbackBox = document.getElementById("feedback-overlay");
    if (feedbackBox) {
        feedbackBox.style.display = "none";
        feedbackBox.className = "";
    }
    document.getElementById("next-b").style.display = "none";
    const phishingButton = document.querySelector(".phishing-button");
    const legitButton = document.querySelector(".legit-button");
    phishingButton.disabled = false;
    legitButton.disabled = false;
}