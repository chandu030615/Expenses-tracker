// Selecting DOM elements
const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expenseElement = document.getElementById('expense');
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transactions');

// Transaction array
let transactions = [];

// Initialize Chart.js
const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#4CAF50', '#F44336']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});

// Update the DOM and Chart
function updateUI() {
    // Calculate balance, income, and expenses
    const amounts = transactions.map(transaction => transaction.amount);
    const balance = amounts.reduce((acc, amount) => acc + amount, 0);
    const income = amounts.filter(amount => amount > 0).reduce((acc, amount) => acc + amount, 0);
    const expense = amounts.filter(amount => amount < 0).reduce((acc, amount) => acc + amount, 0);

    // Update values in the DOM
    balanceElement.textContent = `₹${balance.toFixed(2)}`;
    incomeElement.textContent = `₹${income.toFixed(2)}`;
    expenseElement.textContent = `₹${Math.abs(expense).toFixed(2)}`;

    // Update Chart.js
    expenseChart.data.datasets[0].data = [income, Math.abs(expense)];
    expenseChart.update();

    // Update transaction history
    transactionList.innerHTML = '';
    transactions.forEach(transaction => addTransactionToList(transaction));
}

// Add transaction to the list
function addTransactionToList(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
        ${transaction.description} 
        <span>${transaction.amount > 0 ? '+' : '-'}₹${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    transactionList.appendChild(li);
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateUI();
}

// Handle form submission
transactionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (description === '' || isNaN(amount)) {
        alert('Please enter a valid description and amount');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount
    };

    transactions.push(transaction);
    updateUI();

    // Clear inputs
    descriptionInput.value = '';
    amountInput.value = '';
});

// Initial UI update
updateUI();
