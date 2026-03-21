let scenarios = [];
let currentScenario = 0;
let score = 0;
let wrong = 0;
let difficultyLevel = "medium";
let previousDifficulty = [];
let answeredScenario = false;
let questions = [];

const mainquizButton = document.getElementById("start-q");
if (mainquizButton) {
    mainquizButton.addEventListener("click", () => {
        window.location.href = "quiz.html";
    });
}

document.addEventListener('DOMContentLoaded', function(){
    fetch ("questions/questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            beginQuiz();
    })
    .catch(error => {
        console.error("failed to load the scenarios:", error);
    });
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
    try {
    const questions = scenarios[currentScenario];
    answeredScenario = false;
    console.log(questions);
    console.log(questions.scenario);

    document.getElementById("main-title").textContent = questions["main-title"];
    document.getElementById("scene-info").textContent = questions["scene-info"]    
    document.getElementById("scenario-header").textContent = questions["main-title"];
    document.getElementById("scene-title").textContent = questions.scenario.title;
    document.getElementById("scenario-content").innerHTML = "<p>" + questions.scenario.content + "</p>";

    const feedbackBox = document.getElementById("feedbackBox");
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
    if (answeredScenario) return;
    answeredScenario =true;
    const question = scenarios[currentScenario];
    const correct = (phishingAnswer === question.isPhishing);
    const phishingB = document.querySelector(".phishing-button");
    const legitB = document.querySelector(".legit-button");
    phishingB.disabled = true;
    legitB.disabled =true;

    if (phishingAnswer) {
        if (correct) {
            phishingB.classList.add("correct");
    } else {
            phishingB.classList.add("wrong");
            legitB.classList.add("correct");
        }
    }else {
        if (correct){
            legitB.classList.add("correct");
    } else{
            legitB.classList.add("wrong");
            phishingB.classList.add("correct");
        }
    }
    if (correct) {
        score++;
    }else {
        wrong++;
    }
    document.getElementById("next-b").style.display ="block"
adaptiveDifficulty(correct);

    const feedback = document.getElementById("feedbackBox");
    if (feedback) {
        feedback.style.display = "block";
        if (correct) {
            feedback.className = "feedbackBox correct";
            feedback.innerHTML = "<strong>Correct </strong>" + question.explanation;
        }else{
            feedback.className = "feedbackBox wrong";
            feedback.innerHTML = "<strong>Wrong </strong>"+ question.explanation;
        }
    }
document.getElementById("next-b").style.display ="block"
}

function adaptiveDifficulty(correct) {
    if (correct) {
        if (difficultyLevel === "easy") {
            difficultyLevel = "medium";
        }else if (difficultyLevel === "medium") {
            difficultyLevel ="hard";
        } 
    }else {
        if (difficultyLevel === "hard") {
            difficultyLevel = "medium";
        }else if(difficultyLevel === "medium") {
            difficultyLevel ="easy";
        }
    }
    previousDifficulty.push (difficultyLevel);
}

function nextScenario (){
    currentScenario++;
    if(currentScenario >= scenarios.length){
        document.body.innerHTML= "<h1>Quiz finished</h1> <p> Your score: " + score +" out of " + scenarios.length + "</p>";
    } else{
        loadScenario();
    }
}