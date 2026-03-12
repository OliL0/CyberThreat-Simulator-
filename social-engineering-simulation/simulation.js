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
let totalScenariosComplete = 0;
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

        totalScenariosComplete = emailScenarios.length + transcriptScenarios.length;
        displayInbox();
    }catch (error) {
        console.error('Cant load scenario', error);//returns an error in console if cant load
        alert('fail cant load');//popup of fail cant load when trying to do loadScenaios within console
    }
}

function displayInbox() {
    const inboxList = document.getElementById('inboxList');
    const scenarios = selectedTab === 'email' ? emailScenarios : transcriptScenarios ;
    inboxList.innerHTML = scenarios.map(scenario => {
        const isComplete = scenario.completed || false;
        return `
            <div class="inbox-item ${scenario.unread ? 'unread' : ''} ${isComplete ? 'complete' : ''}"
                 onclick="selectScenario(${scenario.id})">
                <span class="scenario-type ${selectedTab === 'email' ? 'email' : 'calls'}">
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
    selectedTab = tab;
    document.getElementById('emailTab').classList.toggle('active', tab === 'email');
    document.getElementById('transcriptTab').classList.toggle('active', tab === 'transcript');

    document.getElementById('inboxTitle').textContent = tab === 'email' ? 'inbox' : 'transcripts';

    document.getElementById('placeholder').style.display = 'flex';
    document.getElementById('scenarioContent').classList.remove('active');
    displayInbox();
}