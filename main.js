import { randomScrambleForEvent as scramble } from "https://cdn.cubing.net/v0/js/cubing/scramble";
function timer() {
    document.querySelector("#seconds").value = `${Math.floor((Date.now()-start)/60000)}:${((Date.now()-start)/1000 % 60).toFixed(2).padStart(5, "0")}`;
}
function startTimer() {
    document.querySelector("#start").textContent = "Stop";
    start = Date.now();
    interval = setInterval(timer, 4);
    canstart = "started";
}
function stopTimer() {
    document.querySelector("#start").textContent = "Start";
    clearInterval(interval);
    document.querySelector("#seconds").value = ((Date.now()-start)/1000).toFixed(2);
    document.querySelector("#scramble").textContent = await scramble(document.querySelector("#scrtype").value);
    canstart = false;
}
let start = 0; let interval; let space; let hold = false; let canstart = false;
window.onload = async () => {
    document.querySelector("#scramble").textContent = await scramble("333");
}
window.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.code == "Space") {
        if (event.repeat) return;
        if (canstart == "started") {
            stopTimer();
        }
        hold = true;
        canstart = false;
        document.querySelector("#seconds").style.color = "oklch(0.6486 0.2995 28.96)";
        space = setTimeout(() => {
            if (hold) {
                document.querySelector("#seconds").style.color = "oklch(0.8488 0.3685 145.64)";
                canstart = true;
            }
        }, 500);
    }
});
window.addEventListener("keyup", (event) => {
    if (event.code == "Space") {
        hold = false;
        document.querySelector("#seconds").style.color = "oklch(0.9973 0.0014 286.37)";
        clearTimeout(space);
        if (canstart) {
            startTimer();
        }
    }
})
document.querySelector("#scrtype").oninput = async () => {
    document.querySelector("#scramble").textContent = await scramble(document.querySelector("#scrtype").value);
}
document.querySelector("#start").onclick = async () => {
    if (document.querySelector("#start").textContent == "Submit") {
        document.querySelector("#start").textContent = "Start";
        document.querySelector("#scramble").textContent = await scramble(document.querySelector("#scrtype").value);
    } else if (document.querySelector("#start").textContent == "Start") {startTimer();}
    else {stopTimer();}
}
document.querySelector("#seconds").onclick = () => {document.querySelector("#start").textContent = "Submit"}
document.querySelector("#timer").onclick = () => {
    document.querySelector("#timer").classList.add("selected");
    document.querySelector("#comps").classList.remove("selected");
    document.querySelector(".timer").style.display = "block";
    document.querySelector(".comps").style.display = "none";
}
document.querySelector("#comps").onclick = () => {
    document.querySelector("#timer").classList.remove("selected");
    document.querySelector("#comps").classList.add("selected");
    document.querySelector(".timer").style.display = "none";
    document.querySelector(".comps").style.display = "block";
}
