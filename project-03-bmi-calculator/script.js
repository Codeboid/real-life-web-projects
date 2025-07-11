const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const calculateBtn = document.getElementById("calculate");
const bmiValue = document.getElementById("bmi-value");
const bmiStatus = document.getElementById("bmi-status");

function calculateBMI() {
    const height = parseFloat(heightInput.value) / 100; // convert to meters
    const weight = parseFloat(weightInput.value);

    if (height > 0 && weight > 0) {
        const bmi = weight / (height * height);
        bmiValue.textContent = bmi.toFixed(1);
        bmiStatus.textContent = getStatus(bmi);
    } else {
        bmiValue.textContent = "--";
        bmiStatus.textContent = "Please enter valid height and weight.";
    }
}

function getStatus(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
}

calculateBtn.addEventListener("click", calculateBMI);
