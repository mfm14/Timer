// Utility Functions
const $ = (e) => document.querySelector(e);
const print = (e) => console.log(e);
const commas = (e) => parseInt(e).toLocaleString();
const format = (e) => "$" + commas(e);
const get = (e) => localStorage.getItem(e);
const save = (e, x) => localStorage.setItem(e, x);
// Variables
let result = [
    minute = 0,
    hour = 0,
    day = 0,
    elapsed = 0,
]
const historyVersion = "historyV1";
let history = JSON.parse(get(historyVersion)) || {};
let selected = "minute";
let historyTemplate = "<div class='history'><h1>$name</h1><h1>$result</h1></div>";
// Elements
const title = $("h1.title");
const label = $("input.name");
const dates = [$("input[type='date'].start"), $("input[type='date'].end")];
const times = [$("input[type='time'].start"), $("input[type='time'].end")];
const money = [$("input[type='text'].start"), $("input[type='text'].end")];
const display = [$("h1.display"), $("h2.display")];
const results = [$("button.minute"), $("button.hour"), $("button.day")];
const historyContainer = $(".history-container");
const clearHistory = $(".clearHistory")
const calculate = $(".calculate")
// Fade-In Animation
setTimeout(() => { document.body.style.opacity = "1" }, 1000);
// Update Elements
times[0].value = "12:30:00"; times[1].value = "13:30:00";
results.forEach(el => el.addEventListener("click", () => {toggleResult(el)}));
calculate.addEventListener("click", () => {perform()});
clearHistory.addEventListener("click", removeHistory)
updateHistory();
// Main Code
function toggleResult(choice) {
    results.forEach(element => element.classList.remove("selected"));
    choice.classList.add("selected");
    selected = choice.classList[0];
    update();
}

function formatTime(secs) {
    const d = Math.floor(secs / (3600 * 24)).toString().padStart(2, "0"),
        h = Math.floor((secs % (3600 * 24)) / 3600).toString().padStart(2, "0"),
        m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0"),
        s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${d}:${h}:${m}:${s}`;
}

function update() {
    if(isNaN(result[selected])) {
        display[0].innerText = "Result: [Blank]"
        display[1].innerText = "Time: [Blank]"
    } else {
        display[0].innerText = "Result: " + format(result[selected]);
        display[1].innerText = "Time: " + formatTime(result["elapsed"]);
    }
}

function perform() {
    let gain = money[1].value - money[0].value;
    let time = [new Date(dates[0].value + " " + times[0].value), new Date(dates[1].value + " " + times[1].value)]
    let elapsed = (time[1] - time[0]) / 60000;
    if(isNaN(gain / elapsed)) {
        return false;
    }
    result["minute"] = gain / elapsed, result["hour"] = gain / (elapsed / 60), result["day"] = gain / (elapsed / 1440), result["elapsed"] = elapsed * 60;
    update();
    addHistory();
}

function addHistory() {
    history[Object.keys(history).length] = [label.value || "Blank", Math.floor(result["minute"]), result["elapsed"]];
    updateHistory();
    save(historyVersion, JSON.stringify(history));
}

function updateHistory() {
    historyContainer.innerHTML = "";
    for(i = 0; i < Object.keys(history).length; i++) {
        let html = historyTemplate.replace("$name", "Label: " + history[i][0]);
        html = html.replace("$result", "Result: " + format(history[i][1]));
        historyContainer.innerHTML = historyContainer.innerHTML + html;
    }
}

function removeHistory() {
    history = "";
    localStorage.clear();
    updateHistory();
}