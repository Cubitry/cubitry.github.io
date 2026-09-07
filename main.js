import { randomScrambleForEvent as scramble } from "https://cdn.cubing.net/v0/js/cubing/scramble";
window.onload = async () => {
    document.querySelector("#scramble").textContent = await scramble("333");
}