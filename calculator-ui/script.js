let display = document.getElementById("display");

// Append values
function append(value) {
    display.value += value;
}
function backspace() {
    display.value = display.value.slice(0, -1);
}
// Clear display
function clearDisplay() {
    display.value = "";
}

// Toggle +/-
function toggleSign() {

    let exp = display.value;

    if (!exp) return;

    // Find last operator position
    let lastOpIndex = Math.max(
        exp.lastIndexOf('+'),
        exp.lastIndexOf('-'),
        exp.lastIndexOf('*'),
        exp.lastIndexOf('/')
    );

    let number = exp.substring(lastOpIndex + 1);
    let before = exp.substring(0, lastOpIndex + 1);

    // If already negative → remove (- )
    if (number.startsWith("(-") && number.endsWith(")")) {
        number = number.slice(2, -1);
    } else {
        number = "(-" + number + ")";
    }

    display.value = before + number;
}

// Percentage
function percentage() {
    if (display.value) {
        display.value = (parseFloat(display.value) / 100).toString();
    }
}

// Calculate (calls backend)
async function calculate() {

    let expression = display.value;

    try {
        const response = await fetch(
            "https://us-central1-final-15ec5.cloudfunctions.net/calculator",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    expression: expression
                })
            }
        );

        const data = await response.text();
        display.value = data;

    } catch (error) {
        display.value = "Error";
    }
}