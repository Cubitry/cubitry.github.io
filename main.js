import { randomScrambleForEvent as scramble } from "https://cdn.cubing.net/v0/js/cubing/scramble";
function timer() {
    document.querySelector("#seconds").value = `${Math.floor((Date.now()-start)/60000)}:${((Date.now()-start)/1000 % 60).toFixed(2).padStart(5, "0")}`;
}
async function startTimer() {
    document.querySelector("#start").textContent = "Stop";
    start = Date.now();
    interval = setInterval(timer, 4);
    canstart = "started";
}
async function stopTimer() {
    timer();
    times.push(document.querySelector("#seconds").value);
    document.querySelector("#start").textContent = "Start";
    clearInterval(interval);
    document.querySelector("#scramble").textContent = await scramble(document.querySelector("#scrtype").value);
    canstart = false;
}
let start = 0; let interval; let space; let hold = false; let canstart = false;
const toTitleCase = str => str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
let times = localStorage.getItem("times").split(",") || [];
window.onload = async () => {
    document.querySelector("#scramble").textContent = await scramble("333");
}
window.addEventListener("keydown", async (event) => {
    if (event.code == "Space") {
        document.querySelector("#start").blur();
        document.querySelector("#loadcomp").blur();
        if (event.repeat) return;
        if (canstart == "started") {
            await stopTimer();
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
window.addEventListener("keyup", async (event) => {
    if (event.code == "Space") {
        hold = false;
        document.querySelector("#seconds").style.color = "oklch(0.9973 0.0014 286.37)";
        clearTimeout(space);
        if (canstart) {
            await startTimer();
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
    } else if (document.querySelector("#start").textContent == "Start") {await startTimer();}
    else {await stopTimer();}
}
document.querySelector("#seconds").oninput = () => {document.querySelector("#start").textContent = "Submit"}
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
document.querySelector("#loadcomp").onclick = async () => {
    const comp = document.querySelector("#comp").value.trim().replace(/[^a-zA-Z0-9 ]/g, "");
    if (comp) {
        const response = await fetch(`https://cubitry.scratchy271.workers.dev/competition/${comp}`);
        const text = await response.text();
        const data = (() => {try {return JSON.parse(text);} catch {return text;}})();
        if (response.ok) {
            document.querySelector("#cname").textContent = comp;
            document.querySelector("#ctype").textContent = `${toTitleCase(data.event)} and ${toTitleCase(data.type)} Competition, ${data.started ? "Started" : "Not Started"}`;
            document.querySelector("#csolves").textContent = `${data.solves} solves per group`;
            document.querySelector("#cbetween").textContent = `${data.between} seconds between solves`;
            document.querySelector("#cgroups").textContent = `${data.groups} groups`;
            document.querySelector("#cgroup").textContent = `${data.group} seconds between groups`;
        }
    }
    document.querySelector("#join").onclick = () => {
        const socket = new WebSocket(`wss://cubitry.scratchy271.workers.dev/competitions/${comp}`);
        socket.addEventListener("open", () => {
        	console.log("Connected!");
        });
        socket.addEventListener("message", (event) => {
        	console.log("Server:", event.data);
        });
        socket.addEventListener("close", () => {
        	console.log("Disconnected");
        });
        socket.addEventListener("error", (error) => {
        	console.error("WebSocket error:", error);
        });
    }
}
