import { randomScrambleForEvent as scramble } from "https://cdn.cubing.net/v0/js/cubing/scramble";
function timer() {
    document.querySelector("#seconds").textContent = ((Date.now()-start)/1000).toFixed(2);
}
let start = 0; let interval;
window.onload = async () => {
    document.querySelector("#scramble").textContent = await scramble("333");
}
document.querySelector("#scrtype").oninput = async () => {
    document.querySelector("#scramble").textContent = await scramble(document.querySelector("#scrtype").value);
}
document.querySelector("#start").onclick = () => {
    if (document.querySelector("#start").textContent == "Start") {
        document.querySelector("#start").textContent = "Stop";
        start = Date.now();
        interval = setInterval(timer, 4);
    } else {
        document.querySelector("#start").textContent = "Start";
        clearInterval(interval);
        document.querySelector("#seconds").textContent = ((Date.now()-start)/1000).toFixed(2);
    }
}
