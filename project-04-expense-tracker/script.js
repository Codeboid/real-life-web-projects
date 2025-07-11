const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const addBtn = document.getElementById("add");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const filterSelect = document.getElementById("filter");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function calculateTotal(filtered = expenses) {
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

function renderExpenses(filter = "All") {
    expenseList.innerHTML = "";
    const filtered = filter === "All" ? expenses : expenses.filter(e => e.category === filter);
    filtered.forEach((e, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${e.description} - $${e.amount.toFixed(2)} <span>[${e.category}]</span>
    `;
        expenseList.appendChild(li);
    });
    calculateTotal(filtered);
}

addBtn.addEventListener("click", () => {
    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    if (!desc || isNaN(amount) || !category) return;

    expenses.push({ description: desc, amount, category });
    saveExpenses();
    renderExpenses(filterSelect.value);

    descInput.value = "";
    amountInput.value = "";
    categorySelect.value = "";
});

filterSelect.addEventListener("change", () => {
    renderExpenses(filterSelect.value);
});

renderExpenses();