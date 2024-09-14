// Utility Functions
const $ = (e) => document.querySelector(e);
const print = (e) => console.log(e);
const commas = (e) => parseInt(e).toLocaleString();
const format = (e) => "$" + commas(e);
const time = (e) => e.replace(/(.{2})(.{2})(.{2})/, '$1:$2:$3');
const get = (e) => localStorage.getItem(e);
const save = (e, x) => localStorage.setItem(e, x);
const sh = () => save(historyVersion, JSON.stringify(history));
const unformat = (e) => e.replace(/[$, ]/g, '');
// Variables
const historyVersion = "historyV1";
let result = [
    minute = 0,
    hour = 0,
    day = 0,
    elapsed = 0,
]
let history = JSON.parse(get(historyVersion)) || {};
let selected = "minute";
let historyTemplate = "<div onclick='viewHistory();' oncontextmenu='historyDelete(); return false;' class='history'><h1>$name</h1><h1>$result</h1></div>";
// Elements
const title = $("h1.title");
const label = $("input.name");
const display = [$("h1.display"), $("h2.display")];
const results = [$("button.minute"), $("button.hour"), $("button.day")];
const historyContainer = $(".history-container");
const clearHistory = $(".clearHistory");
const calculate = $(".calculate");
const dates = [$("input[type='date'].start"), $("input[type='date'].end")];
const times = [$("input[type='time'].start"), $("input[type='time'].end")];
const money = [$("input[type='text'].start"), $("input[type='text'].end")];
const files = [$("input[type='file'].start"), $("input[type='file'].end")];
// Fade-In Animation
setTimeout(() => { document.body.style.opacity = "1" }, 1000);
// Update Elements
times[0].value = "12:30:00"; times[1].value = "13:30:00";
results.forEach(el => el.addEventListener("click", () => {toggleResult(el)}));
money.forEach(el => el.addEventListener("focus", () => {if(el.value !== "") {formatInputs(el, false)}}))
money.forEach(el => el.addEventListener("blur", () => {if(el.value !== "") {formatInputs(el, true)}}))
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

function setResult(money, time) {
    result["minute"] = money;
    result["hour"] = money * 60;
    result["day"] = money * 1440;
    result["elapsed"] = time;
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
    let gain = parseInt(unformat(money[1].value)) - parseInt(unformat(money[0].value));
    let time = [new Date(dates[0].value + " " + times[0].value), new Date(dates[1].value + " " + times[1].value)]
    let elapsed = (time[1] - time[0]) / 60000;
    if(isNaN(gain / elapsed)) {
        throw new Error("Code: 0, Invalid input data");
    }
    setResult(gain / elapsed, elapsed * 60)
    update();
    addHistory();
}

function addHistory() {
    history[Object.keys(history).length] = [label.value || "Blank", Math.floor(result["minute"]), result["elapsed"]];
    updateHistory();
}

function updateHistory() {
    historyContainer.innerHTML = "";
    for(i = 0; i < Object.keys(history).length; i++) {
        let html = historyTemplate.replace("$name", "Label: " + history[i][0]);
        html = html.replace("$result", "Result: " + format(history[i][1]));
        html = html.replace("y()", `y("${history[i][1]}", "${history[i][2]}")`);
        html = html.replace("e()", `e(${i})`);
        historyContainer.innerHTML = historyContainer.innerHTML + html;
    }
    sh();
}

function historyDelete(key){
    let confirmation = confirm("Are you sure you want to delete this history entry?");
    if(confirmation) {
        delete history[key]; // rest in peace history entry :(
        updateHistory();
    } else {
        return false;
    }
}

function viewHistory(money, time) {
    setResult(money, time);
    update();
}

function removeHistory() {
    history = "";
    localStorage.clear();
    updateHistory();
}

function formatInputs(input, type) {
    if(type){
        input.value = format(input.value);
    } else {
        input.value = unformat(input.value);
    }
}

files.forEach((el, i) => el.addEventListener("change", () => {
    const fileName = el.files[0].name;
    if (fileName) {
        let [d, t] = [fileName.slice(11, 21), time(fileName.slice(22, 28))]
        dates[i].value = d, times[i].value = t;
        magic(el, i);
    } else {
        el.value = null;
    }
}))

async function magic(input, index) {
    const imageFile = input.files[0];
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
            headers: {
                'apikey': 'K81112434088957', // guys please dont steal my api key :(
            },
        });
        const result = await response.json();
        if(!result.ParsedResults) {
            console.log("%c NO IMAGE ? ?? ??? ??????? (Code 2) (!!!!)", "color: red; font-weight: bold;");
            return false; // this should NOT happen
        }
        // if(isNaN(parseInt(unformat(result.ParsedResults[0].ParsedText)))) {
        //     throw new Error("OCR Text Misregonization (Code 1)")
        // }
        const formatted = format(unformat(result.ParsedResults[0].ParsedText)); // listen, this is weird but it works
        print(formatted);
        money[index].value = formatted;
    } catch (error) {
        console.error(error);
    }
}