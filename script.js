let transactions = [];

function addIncome() {
	const name = document.getElementById("incomeName").value.trim();
	const amount = parseFloat(document.getElementById("incomeAmount").value);

	if (!name || isNaN(amount)) {
		alert("Proszę podać poprawną nazwę i kwotę przychodu.");
		return;
	}

	const transaction = { type: "income", name, amount };
	transactions.push(transaction);
	displayTransactions();
	updateBalance();
	clearIncomeInputs();
}

function addExpense() {
	const name = document.getElementById("expenseName").value.trim();
	const amount = parseFloat(document.getElementById("expenseAmount").value);

	if (!name || isNaN(amount)) {
		alert("Proszę podać poprawną nazwę i kwotę wydatku.");
		return;
	}

	const transaction = { type: "expense", name, amount };
	transactions.push(transaction);
	displayTransactions();
	updateBalance();
	clearExpenseInputs();
}

function displayTransactions() {
	const incomesElement = document.getElementById("incomeList");
	const expensesElement = document.getElementById("expenseList");
	const totalIncomeElement = document.getElementById("totalIncome");
	const totalExpenseElement = document.getElementById("totalExpense");

	incomesElement.innerHTML = "";
	expensesElement.innerHTML = "";

	let totalIncome = 0;
	let totalExpense = 0;

	transactions.forEach((transaction, index) => {
		const transactionDiv = document.createElement("div");
		transactionDiv.classList.add("transaction");
		transactionDiv.innerHTML = `<strong>${
			transaction.name
		}</strong> - ${transaction.amount.toFixed(
			2
		)} PLN <button onclick="editTransaction(${index}, '${
			transaction.type
		}')">Edytuj</button> <button onclick="deleteTransaction(${index})">Usuń</button>`;

		if (transaction.type === "income") {
			incomesElement.appendChild(transactionDiv);
			totalIncome += transaction.amount;
		} else {
			expensesElement.appendChild(transactionDiv);
			totalExpense += transaction.amount;
		}
	});

	totalIncomeElement.textContent = `Suma przychodów: ${totalIncome.toFixed(
		2
	)} PLN`;
	totalExpenseElement.textContent = `Suma wydatków: ${totalExpense.toFixed(
		2
	)} PLN`;
}

function editTransaction(index, type) {
	const newName = prompt("Proszę podać nową nazwę transakcji:");
	const newAmount = parseFloat(prompt("Proszę podać nową kwotę transakcji:"));

	if (!newName || isNaN(newAmount)) {
		alert("Proszę podać poprawną nazwę i kwotę transakcji.");
		return;
	}

	transactions[index].name = newName.trim();
	transactions[index].amount = newAmount;
	displayTransactions();
	updateBalance();
}

function deleteTransaction(index) {
	transactions.splice(index, 1);
	displayTransactions();
	updateBalance();
}

function updateBalance() {
	const totalIncome = transactions.reduce((total, transaction) => {
		return transaction.type === "income" ? total + transaction.amount : total;
	}, 0);
	const totalExpense = transactions.reduce((total, transaction) => {
		return transaction.type === "expense" ? total + transaction.amount : total;
	}, 0);

	const balance = totalIncome - totalExpense;
	const balanceElement = document.getElementById("balance");

	if (balance > 0) {
		balanceElement.textContent = `Możesz jeszcze wydać ${balance.toFixed(
			2
		)} złotych`;
	} else if (balance === 0) {
		balanceElement.textContent = "Bilans wynosi zero";
	} else {
		balanceElement.textContent = `Bilans jest ujemny. Jesteś na minusie ${Math.abs(
			balance
		).toFixed(2)} złotych`;
	}
}

function clearIncomeInputs() {
	document.getElementById("incomeName").value = "";
	document.getElementById("incomeAmount").value = "";
}

function clearExpenseInputs() {
	document.getElementById("expenseName").value = "";
	document.getElementById("expenseAmount").value = "";
}
