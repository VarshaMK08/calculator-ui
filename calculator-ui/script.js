let display = document.getElementById("display");

function append(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

async function calculate() {

    let expression = display.value;

    // Split numbers and operator (simple logic)
    let operator;
    if (expression.includes("+")) operator = "+";
    else if (expression.includes("-")) operator = "-";
    else if (expression.includes("*")) operator = "*";
    else if (expression.includes("/")) operator = "/";

    let parts = expression.split(operator);

    let n1 = parts[0];
    let n2 = parts[1];

    try {
        const response = await fetch(
            "https://us-central1-final-15ec5.cloudfunctions.net/calculator",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    n1: n1,
                    n2: n2,
                    op: operator
                })
            }
        );

        const data = await response.text();
        display.value = data;

    } catch (error) {
        display.value = "Error";
    }
}