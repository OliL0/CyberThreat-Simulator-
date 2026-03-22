//Array to store scenarios when loaded from JSON
let emailScenarios = [];
let transcriptScenarios = [];
// the tab that is active when starting 
let selectedTab = 'email';
//No scenario is active when starting 
let currentScenario = null;
//the game variables at the start 
let score = 0;
let completedScenarios =0;
let ScenariosCompleted = 0;
let susElementsFound = 0;
//state of the current gameplay
let attemptsLeft = 5;
let foundsusElements = [];
let wrongClicks = 0;

//Loads the scenarios from the json files and renders it into the inbox 
async function loadScenarios() {
    try {
        const [emailResponse, transcriptResponse] = await Promise.all([
            fetch('scenarios/email.json'),//gets both the scenario JSON files 
            fetch('scenarios/transcript.json')
        ]);
        emailScenarios = await emailResponse.json();
        transcriptScenarios = await transcriptResponse.json();

        ScenariosCompleted = emailScenarios.length + transcriptScenarios.length;
        displayInbox();
    }catch (error) {
        console.error('Cant load scenarios', error);//returns an error in console if cant load
        alert('Fail cant load');//popup of fail cant load when trying to do loadScenaios within console
    }
}

function displayInbox() {
    const inboxList = document.getElementById('inboxList');
    const scenarios = selectedTab === 'email' ? emailScenarios : transcriptScenarios ;
    inboxList.innerHTML = scenarios.map(scenario => {
        const isComplete = scenario.completed || false;
        return `
            <div class="inbox-item ${scenario.unread ? 'unread' : ''} ${isComplete ? 'complete' : ''}"
                 onclick="chooseScenario(${scenario.id})">
                <span class="scenario-type ${selectedTab}">
                    ${selectedTab === 'email' ? 'email' : 'calls'}
                </span>
                <div class="inbox-sender">${scenario.sender || scenario.caller}</div>
                <div class="inbox-subject">${scenario.subject || scenario.callType}</div>
                <div class="inbox-preview">${scenario.preview}</div>
                <div class="inbox-time">${scenario.time}${scenario.duration ? ' • ' + scenario.duration : ''}</div>
            </div>
        `;   
    }).join('');
}

//Tab switching for the email and call tabs
function changeTab(tab) {
    try{
    selectedTab = tab;
    document.getElementById('emailTab').classList.toggle('active', tab === 'email');
    document.getElementById('transcriptTab').classList.toggle('active', tab === 'transcript');

    document.getElementById('inboxTitle').textContent = tab === 'email' ? 'Inbox' : 'Calls';

    document.getElementById('placeholder').style.display = 'flex';
    document.getElementById('scenarioContent').classList.remove('active');
    displayInbox();
    } catch(error) {
    console.error("failed to change tab:", error)//returns an error if it cant switch tabs or load other content 
    }
}

function chooseScenario(id) {
    try{
    const scenarios = selectedTab === 'email' ? emailScenarios : transcriptScenarios;
    currentScenario = scenarios.find(scenario => scenario.id === id);

    attemptsLeft = 5;
    susElementsFound = [];
    wrongClicks = 0;

    document.querySelectorAll ('.inbox-item').forEach((item, index) => {
        item.classList.remove('active');
        if (scenarios[index] && scenarios[index].id === id) {
            item.classList.add('active');
        }
    });

    document.getElementById('placeholder').style.display = 'none';
    const scenarioContent = document.getElementById('scenarioContent');
    scenarioContent.classList.add('active');

    loadInteractiveEmail(scenarioContent);
    loadInteractiveScenarios();
}catch (error) {
    console.error("failed to load scenario:", currentScenario, error)
}
}

function loadInteractiveScenarios() {
    const scenarioContent = document.getElementById('scenarioContent');

    const badgeType = {
        'critical': 'badge-critical',
        'high': 'badge-high',
        'medium': 'badge-medium',
        'low': 'badge-low'
    };
    let badgeClass;
    if (badgeType[currentScenario.riskLevel]) {
        badgeClass = badgeType[currentScenario.riskLevel];
    } else {
        badgeClass = 'badge-medium';
    }
    let riskLevel;
    if (currentScenario.riskLevel === 'critical') {
        riskLevel = 'Critical';
    } else if (currentScenario.riskLevel === 'high') {
        riskLevel = 'High';
    } else if (currentScenario.riskLevel === 'medium') {
        riskLevel = 'Medium';
    } else {
        riskLevel = 'Low';
    }
    if (selectedTab === 'email') {
        loadInteractiveEmail(scenarioContent, badgeClass, riskLevel)
    }
}

function loadInteractiveEmail (container, badgeClass, riskLevel) {
    console.log(currentScenario)
    try {
    const scenarioContent = document.getElementById('scenarioContent')
    const interactiveText = makeTextClickable(currentScenario.body, currentScenario.suspiciousElements);
    container.innerHTML = `
        <div class = "scenario-header">
            <div class = "scenario-subject">
                ${currentScenario.subject}
                <span class = "badge ${badgeClass}">${riskLevel}Risk </span>
            </div>
            <div class = "scenario-meta">
                <span><strong>From: </strong> ${currentScenario.sender}</span>
                <span><strong>Time: </strong> ${currentScenario.time}</span>
                ${currentScenario.emailAddress ? `<span><strong>Email:</strong>${currentScenario.emailAddress}</span>` : ''}
            </div>
        </div>
        <div class = "game-instructions">
            <div class = "instruction-text">
                <strong>Click any phrases you think are suspicious</strong> 
                Find all ${currentScenario.suspiciousElements.length} suspicious elements
            </div>
            <div class = "attempts-display">
                <span class = "attempt-label"> Wrong Clicks: </span>
                <div class = "attempt-dots" id = "attemptDots">
                    <div class = "attempt-dot"></div>
                    <div class = "attempt-dot"></div>
                    <div class = "attempt-dot"></div>
                    <div class = "attempt-dot"></div>
                    <div class = "attempt-dot"></div>
                </div>
            </div>
        </div>
        <div id="scenario-body">
            <div class = "scenario-t" id = "interactiveBody">
                ${interactiveText}
            </div>
        </div>
        
        <div class = "progress-section">
            <div class = "progress-bar-containter">
                <div class = "progress-label">
                    <span>Suspicious Elements Found: </span>
                    <span id = "progressText" >0 / ${currentScenario.suspiciousElements.length}</span>
                </div>
                <div class = "progress-bar">
                    <div class = "progress-fill" id = "progressFill" style = "width: 0%"></div>
                </div>
            </div>
        </div>

        <div class = "scenario-actions">
            <button class = " button button-primary" onclick = "submitScenario()" id = "submitButton">
                Submit scenario
            </button>
        </div>
   `;
   clickListeners();
   }catch (error) {
    console.error("failed to load email section:", error)
   }
}

function makeTextClickable(text, suspiciousElements){
    const susElementPosition = [];
    if (suspiciousElements && suspiciousElements.length > 0) {
        suspiciousElements.forEach((suselementText, index) => {
        const regex = new RegExp(escapeRegex(suselementText), 'gi')
        let match;
        while ((match = regex.exec(text)) !== null) {
            susElementPosition.push({
                start:match.index,
                end: match.index + match [0].length,
                index : index,
                text : match[0]
            })
        }
        })
    }



    susElementPosition.sort(function(a, b) {//sorts the suspicious elements by position 
        return a.start - b.start;
    });

    let result = '';//makes all the text into clickable elements so that it would make cheating not possible
    let lastIndex =0;
    const phrases = text.split(/([.!?\n]+)/)//splits the sentences in the body using the special characters
    let currentPosition = 0;

    phrases.forEach(function(phrase) {
        if (phrase.trim().length === 0) {
        result += phrase;
        currentPosition += phrase.length;
        return;
    }

    const element = susElementPosition.find(function(f) {
        return f.start >= currentPosition && f.end <= currentPosition + phrase.length;
    });
        if (element) {
            const start = element.start - currentPosition;
            const end = element.end - currentPosition;
            const before = phrase.slice(0, start);
            const suselementText = phrase.slice(start, end);
            const after = phrase.slice(end);

        if (before.trim()) result += `<span class="clickable" data-safe="true">${before}</span>`;
        result += `<span class="clickable" data-sus="${element.index}">${suselementText}</span>`;
        if (after.trim()) result += `<span class="clickable" data-safe="true">${after}</span>`;
    } else {
        result += `<span class="clickable" data-safe="true">${phrase}</span>`;
    }
    currentPosition += phrase.length;
    });

    return result;
}
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function clickListeners() {
    const clickableElement = document.querySelectorAll('.clickable');
    clickableElement.forEach(function(element) {
        element.addEventListener('click', function() {
            handleSusClick(this);
        });
    });
}
function completeScenario(success) {
    const susTotal = currentScenario.suspiciousElements.length;
    const foundCount =  foundsusElements.length;
    let points = 0 
    if (success){
        if (wrongClicks === 0){
            points = 100;
        }else{
            points = 100 - (wrongClicks * 10);
            if (points < 50){
                points= 50;
            }
        }
    }else {
        points = foundCount * 10;
    }
    score += points;
    currentScenario.completed = true;
    completedScenarios++;

    showModalFeedback(success, points, foundCount, susTotal);
}


function handleSusClick(element) {
    console.log("clicked!", element);
    console.log(element.getAttribute('data-sus'));
    if (element.classList.contains('found')) {
        return;
    }
    if (element.classList.contains('wrong')) {
        return;
    }
    const susValue = element.getAttribute('data-sus');
    if (susValue !== null) {
        const index= parseInt(susValue);
        if(!foundsusElements.includes(index)) {
            foundsusElements.push(index);
            element.classList.add('found');
            susElementsFound++;
            updateProgress();
            if (foundsusElements.length === currentScenario.suspiciousElements.length) {
                completeScenario(true);
            }
        }
    }else {
        element.classList.add('wrong');
        wrongClicks++;
        attemptsLeft--;
        updateAttempts();
        setTimeout(function(){
            element.classList.remove('wrong');
        }, 500);

        if (attemptsLeft <= 0){
            completeScenario(false);
        }
    }
}
function updateAttempts() {//changes the colour of the attempt dots and changes them when wrong click// 
    const dots = document.querySelectorAll('.attempt-dot');
    const used = 5 - attemptsLeft;
    dots.forEach(function(dot, index) {
        if (index < wrongClicks) {
            dot.classList.add('used');
        }
    });
}
//function to change the progress bar and found flags display //
function updateProgress(){
    const susTotal = currentScenario.suspiciousElements.length;
    const percentage = (foundsusElements.length / susTotal) * 100;

    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = foundsusElements.length + '/' + susTotal;
}



document.addEventListener('DOMContentLoaded', loadScenarios);