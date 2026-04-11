// ====== UI SETUP ======
const body = document.body;

body.style.display = "flex";
body.style.justifyContent = "center";
body.style.alignItems = "center";
body.style.height = "100vh";
body.style.background = "#e6ecf0";

const calculator = document.createElement("div");
calculator.style.background = "#fff";
calculator.style.padding = "20px";
calculator.style.borderRadius = "12px";
calculator.style.width = "260px";

// Display
const display = document.createElement("input");
display.type = "text";
display.disabled = true;
display.style.width = "100%";
display.style.height = "60px";
display.style.fontSize = "24px";
display.style.marginBottom = "10px";
display.style.textAlign = "right";

// Buttons container
const buttons = document.createElement("div");
buttons.style.display = "grid";
buttons.style.gridTemplateColumns = "repeat(4, 1fr)";
buttons.style.gap = "8px";

// ====== FUNCTIONS ======
function append(val) {
    display.value += val;
}

function clearDisplay() {
    display.value = "";
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function toggleSign() {
    let exp = display.value;
    if (!exp) return;

    let i = Math.max(
        exp.lastIndexOf('+'),
        exp.lastIndexOf('-'),
        exp.lastIndexOf('*'),
        exp.lastIndexOf('/')
    );

    let num = exp.substring(i + 1);
    let before = exp.substring(0, i + 1);

    if (num.startsWith("(-") && num.endsWith(")")) {
        num = num.slice(2, -1);
    } else {
        num = "(-" + num + ")";
    }

    display.value = before + num;
}

function percentage() {
    if (display.value) {
        display.value = (parseFloat(display.value) / 100).toString();
    }
}

// ====== CALL CLOUD FUNCTION ======
async function calculate() {
    try {
        const res = await fetch(
            "https://us-central1-final-15ec5.cloudfunctions.net/calculator",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    expression: display.value
                })
            }
        );

        const data = await res.text();
        display.value = data;

    } catch {
        display.value = "Error";
    }
}

// ====== BUTTON CREATOR ======
function createBtn(text, handler, color) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.style.padding = "14px";
    btn.style.fontSize = "18px";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";

    if (color === "op") {
        btn.style.background = "#ff9f43";
        btn.style.color = "#fff";
    } else if (color === "eq") {
        btn.style.background = "#2ecc71";
        btn.style.color = "#fff";
    } else if (color === "clear") {
        btn.style.background = "#e74c3c";
        btn.style.color = "#fff";
    } else if (color === "special") {
        btn.style.background = "#bdc3c7";
    } else {
        btn.style.background = "#f1f1f1";
    }

    btn.onclick = handler;
    return btn;
}

// ====== BUTTON LAYOUT ======
const layout = [
    ["AC", "X", "+/-", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["%", "0", ".", "="]
];

// ====== RENDER BUTTONS ======
layout.forEach(row => {
    row.forEach(b => {
        let btn;

        if (b === "AC") btn = createBtn(b, clearDisplay, "clear");
        else if (b === "X") btn = createBtn(b, backspace, "special");
        else if (b === "+/-") btn = createBtn(b, toggleSign, "special");
        else if (b === "%") btn = createBtn(b, percentage, "special");
        else if (b === "=") btn = createBtn(b, calculate, "eq");
        else if (["+", "-", "*", "/"].includes(b))
            btn = createBtn(b, () => append(b), "op");
        else
            btn = createBtn(b, () => append(b), "num");

        buttons.appendChild(btn);
    });
});

// ====== BUILD UI ======
calculator.appendChild(display);
calculator.appendChild(buttons);
body.appendChild(calculator);