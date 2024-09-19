const instructions_container = $(".instructions-container");
const calculation_container = $(".form-container");
const mysterious_container_seriously_I_dont_even_know_what_it_is_why_did_I_make_the_website_like_this = $(".form");
const start_instructions_button = $(".start-instructions");
const skip_instructions_button = $(".skip-instructions");

const instructions_title = $(".instructions-title");
const instructions_description = $(".descriptions-title");
const initialize_division = $(".initalize")
const instructions_display = $(".instructions > .display");
const instructions_image = $(".image-instructions");
const last_page = $(".last-instructions");
const next_page = $(".next-instructions");
const instructions_counter = $(".instructions-counter");
const reopen_instruction_button = $(".instruction-opener");

const viewed = localStorage.getItem("viewed");
let page = 1;

if(viewed === "1") {
    initalize();
}

skip_instructions_button.addEventListener("click", () => {
    end_instructions();
})

start_instructions_button.addEventListener("click", () => {
    start_instructions();
})

reopen_instruction_button.addEventListener("click", () => {
    localStorage.removeItem("viewed");
    window.location.reload();
});

last_page.addEventListener("click", () => {
    if(page > 0) {
        page -= 1;
        change_page();
    } else {
        return false;
    }
})

next_page.addEventListener("click", () => {
    page += 1;
    change_page();
})

function initalize() {
    instructions_container.style.display = "none";
    mysterious_container_seriously_I_dont_even_know_what_it_is_why_did_I_make_the_website_like_this.style.display = "inline";
}

function transition() {
    instructions_display.style.opacity = "0";
    setTimeout(() => {
        instructions_counter.innerText = `${page}/4`;
        instructions_display.style.opacity = "1";
        if(page === 4) {
            next_page.innerText = "Start!";
        }
    }, 500)
}

function end_instructions() {
    save("viewed", 1);
    window.location.reload();
}

function start_instructions() {
    change_page();
}

function change_page() {
    transition();
    switch (page) {
        case 1:
            stage1();
            break;
        case 2:
            stage2();
            break;
        case 3:
            stage3();
            break;
        case 4:
            stage4();
            break;
        case 5:
            end_instructions();
            break;
        default:
            page = 1;
            start_instructions();
            break;
    }
}

function stage1() {
    initialize_division.style.opacity = "0";
    setTimeout(() => {
        initialize_division.style.display = "none";
        instructions_title.innerHTML = "First take your screenshots of <br> your money!";
        instructions_description.innerHTML = "Be sure to use windows snipping<br> tool as I coded it to be compatible<br> with that! It should look like this:";
        instructions_image.src = "images/image1.png";
        instructions_image.width = "200";
        instructions_image.height = "60";
    }, 500)
}

function stage2() {
    setTimeout(() => {
        instructions_title.innerHTML = "Then select them in the website!";
        instructions_description.innerHTML = "Click on 'Choose File', it will open a prompt and then find your screenshot of your money!";
        instructions_image.src = "images/image2.png";
        instructions_image.width = "300";
        instructions_image.height = "120";
    }, 500);
}

function stage3() {
    setTimeout(() => {
        instructions_title.innerHTML = "That's it! The inputs and everything should fill out by itself!";
        instructions_description.innerHTML = "Check to make sure everything is filled out just incase!";
        instructions_image.src = "images/image3.png";
        instructions_image.width = "300";
        instructions_image.height = "225";
    }, 500);
}

function stage4() {
    setTimeout(() => {
        instructions_title.innerHTML = "What if its not filled out properly?";
        instructions_description.innerHTML = "You'll have to fill it out manually, sorry! (I can't fix it myself unfortunately, the OCR just has trouble reading the theme park tycoon 2 font.)";
        instructions_image.style.display = "none";
    }, 500);
}