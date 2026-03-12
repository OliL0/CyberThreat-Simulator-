//Array to store scenarios when loaded from JSON
let emailScenarios = [];
let transcriptScenarios = [];
// the tab that is active when starting 
let activeTab = 'email';
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

async function loadScenarios() {
    try {
        const [eResponse, cResponse] = await Promise.all([
            fetch('email.json'),
            fetch('transcript.json')
        ]);
        email = await eResponse.json();
        transcript = await cResponse.json();

        totalScenarios = emailScenario.length + callScenario.length;
        renderInbox();
    }catch (error) {
        console.error('Cant load scenario', error);
        alert('fail');
    }
}