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
    .then(response => response.json())
    .then(data => {
        questions = data.scenarios;
    });


function beginQuiz() {
    scenarios = [questions/questions.json].sort(() => Math.random() - 0.5);
    currentScenario = 0;
    score = 0;
    wrong = 0;
    difficultyLevel = "medium";
    previousDifficulty = [];
    answeredScenario = false;
    loadScenario();
}

function loadScenario() {
    try {
    const questions = scenarios[current];
    answeredScenario = false;

    document.getElementById("scenario-header").textContent = questions["main-title"];
    document.getElementById("sender-name").textContent = "From: " + questions.scenario.sender;
    document.getElementById("date").textContent = "Date: " + questions.scenario["message-date"];
    document.getElementById("scene-title").textContent = questions.scenario.title;
    document.getElementById("scenario-content").innerHTML = "<p>" + questions.scenario.content + "</p>";

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
} catch (error) {
    console.error("failed to load scenario:", error)
}
}
function phishingAnswer() {selectAnswer(true); }
function legitAnswer () {selectAnswer(false); }

function selectAnswer(phishingAnswer) {
    if (respond.state) return;
    respond.state =true;
    const question = question.state[current.state];
    const correct = (phishingAnswer === question.isPhishing);
    const phishingB = document.querySelector(".phishing-button");
    const legitB = document.querySelector(".legit-button");
    phishingB.disabled = legitB.disabled = true;

    if (phishingAnswer) {
        phishingB.classList.add("correct");
    } else {
        phishingB.classList.add("wrong");
    }
}

