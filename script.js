let transactions = [];
let editIndex = null;

document
	.getElementById("incomeForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();
		addIncome(event);
	});

document
	.getElementById("expenseForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();
		addExpense(event);
	});

document
	.getElementById("editForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();
		saveEdit(event);
	});

document.querySelector(".close-button").addEventListener("click", closeModal);

function addIncome(event) {
	const name = event.target.name.value.trim();
	const amount = parseFloat(event.target.amount.value);

	const nameError = document.getElementById("incomeNameError");
	const amountError = document.getElementById("incomeAmountError");

	nameError.textContent = "";
	amountError.textContent = "";

	let valid = true;

	if (!name) {
		nameError.textContent = "Proszę podać nazwę przychodu.";
		valid = false;
	}

	if (isNaN(amount) || amount <= 0) {
		amountError.textContent = "Proszę podać poprawną kwotę przychodu.";
		valid = false;
	}

	if (!valid) {
		return;
	}

	const transaction = { type: "income", name, amount };
	transactions.push(transaction);
	displayTransactions();
	updateBalance();
	event.target.reset();
}

function addExpense(event) {
	const name = event.target.name.value.trim();
	const amount = parseFloat(event.target.amount.value);

	const nameError = document.getElementById("expenseNameError");
	const amountError = document.getElementById("expenseAmountError");

	nameError.textContent = "";
	amountError.textContent = "";

	let valid = true;

	if (!name) {
		nameError.textContent = "Proszę podać nazwę wydatku.";
		valid = false;
	}

	if (isNaN(amount) || amount <= 0) {
		amountError.textContent = "Proszę podać poprawną kwotę wydatku.";
		valid = false;
	}

	if (!valid) {
		return;
	}

	const transaction = { type: "expense", name, amount };
	transactions.push(transaction);
	displayTransactions();
	updateBalance();
	event.target.reset();
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

		const nameElement = document.createElement("strong");
		nameElement.textContent = transaction.name;

		const amountElement = document.createElement("span");
		amountElement.textContent = ` - ${transaction.amount.toFixed(2)} PLN`;

		const editButton = document.createElement("button");
		editButton.textContent = "Edytuj";
		editButton.addEventListener("click", () =>
			openEditModal(index, transaction)
		);

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Usuń";
		deleteButton.addEventListener("click", () => deleteTransaction(index));

		transactionDiv.appendChild(nameElement);
		transactionDiv.appendChild(amountElement);
		transactionDiv.appendChild(editButton);
		transactionDiv.appendChild(deleteButton);

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

function openEditModal(index, transaction) {
	editIndex = index;
	const editModal = document.getElementById("editModal");
	const editForm = document.getElementById("editForm");
	const editNameInput = document.getElementById("editName");
	const editAmountInput = document.getElementById("editAmount");

	editNameInput.value = transaction.name;
	editAmountInput.value = transaction.amount;

	editModal.style.display = "block";

	editForm.addEventListener("reset", closeModal);
}

function saveEdit(event) {
	const name = event.target.name.value.trim();
	const amount = parseFloat(event.target.amount.value);

	const nameError = document.getElementById("editNameError");
	const amountError = document.getElementById("editAmountError");

	nameError.textContent = "";
	amountError.textContent = "";

	let valid = true;

	if (!name) {
		nameError.textContent = "Proszę podać nazwę transakcji.";
		valid = false;
	}

	if (isNaN(amount) || amount <= 0) {
		amountError.textContent = "Proszę podać poprawną kwotę transakcji.";
		valid = false;
	}

	if (!valid) {
		return;
	}

	transactions[editIndex].name = name;
	transactions[editIndex].amount = amount;

	displayTransactions();
	updateBalance();
	closeModal();
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

function closeModal() {
	const editModal = document.getElementById("editModal");
	const editForm = document.getElementById("editForm");
	const editNameError = document.getElementById("editNameError");
	const editAmountError = document.getElementById("editAmountError");

	editForm.reset();
	editNameError.textContent = "";
	editAmountError.textContent = "";
	editModal.style.display = "none";
}
