const billInput = document.getElementById("bill");
const tipSelect = document.getElementById("tip");
const peopleInput = document.getElementById("people");
const tipAmount = document.getElementById("tip-amount");
const totalAmount = document.getElementById("total-amount");

function calculateTip() {
    const bill = parseFloat(billInput.value);
    const tipPercent = parseInt(tipSelect.value);
    const people = parseInt(peopleInput.value);

    if (bill > 0 && people > 0) {
        const totalTip = (bill * tipPercent) / 100;
        const tipPerPerson = totalTip / people;
        const totalPerPerson = (bill + totalTip) / people;

        tipAmount.textContent = `$${tipPerPerson.toFixed(2)}`;
        totalAmount.textContent = `$${totalPerPerson.toFixed(2)}`;
    } else {
        tipAmount.textContent = "$0.00";
        totalAmount.textContent = "$0.00";
    }
}

billInput.addEventListener("input", calculateTip);
tipSelect.addEventListener("change", calculateTip);
peopleInput.addEventListener("input", calculateTip);

calculateTip();