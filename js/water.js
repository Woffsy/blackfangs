const waterButton = document.getElementById("hydrate-button");
const dehydrateButton = document.getElementById("dehydrate-button");
const waterOverlay = document.getElementById("water-overlay");

let waterLevel = 0;

waterButton.addEventListener("click", () => {
    waterLevel += 10;

    if (waterLevel > 100) {
        waterLevel = 100;
    }

    waterOverlay.classList.add("active");
    waterOverlay.style.height = `${waterLevel}%`;
});

dehydrateButton.addEventListener("click", () => {
    waterLevel -= 10;

    if (waterLevel <= 0) {
        waterLevel = 0;
        waterOverlay.classList.remove("active");
    }

    waterOverlay.style.height = `${waterLevel}%`;
});

// lmao bro idk why i made this