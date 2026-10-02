const API_BASE = "http://localhost:3000/api/expenses";

const CATEGORY_CLASS = {
  Food: "pill-food",
  Transport: "pill-transport",
  Bills: "pill-bills",
  Entertainment: "pill-entertainment",
  Other: "pill-other"
};

let allExpenses = [];
let categoryChart = null;

const spinner = document.getElementById("spinner");
const alertBox = document.getElementById("alertBox");
const tableBody = document.getElementById("expensesTableBody");
const emptyState = document.getElementById("emptyState");
const filterCategory = document.getElementById("filterCategory");

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
}

function clearAlert() {
  alertBox.classList.add("d-none");
}

function formatMoney(n) {
  return Number(n).toFixed(2);
}

// ---- Load + render ----

async function loadExpenses() {
  spinner.classList.remove("d-none");
  clearAlert();

  try {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    allExpenses = await response.json();
    renderSummary(allExpenses);
    renderTable();
    renderChart(allExpenses);
  } catch (err) {
    showAlert("Could not load expenses. Is the server running? (" + err.message + ")");
  } finally {
    spinner.classList.add("d-none");
  }
}

function renderSummary(expenses) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const highest = expenses.reduce(
    (max, e) => (Number(e.amount) > Number(max?.amount || 0) ? e : max),
    null
  );

  document.getElementById("summaryTotal").textContent = formatMoney(total);
  document.getElementById("summaryCount").textContent = expenses.length;
  document.getElementById("summaryHighestAmount").textContent = highest
    ? formatMoney(highest.amount)
    : "0.00";
  document.getElementById("summaryHighestTitle").textContent = highest
    ? highest.title
    : "-";
}

function renderTable() {
  const selectedCategory = filterCategory.value;
  const filtered = selectedCategory
    ? allExpenses.filter(e => e.category === selectedCategory)
    : allExpenses;

  tableBody.innerHTML = "";
  emptyState.classList.toggle("d-none", filtered.length > 0);

  filtered.forEach(expense => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${expense.title}</td>
      <td class="text-end">${formatMoney(expense.amount)}</td>
      <td><span class="category-pill ${CATEGORY_CLASS[expense.category] || "pill-other"}">${expense.category}</span></td>
      <td>${expense.date}</td>
      <td class="text-end">
        <button class="btn-edit-outline btn-edit" data-id="${expense.id}">Edit</button>
        <button class="btn-delete-outline btn-delete" data-id="${expense.id}">Delete</button>
      </td>`;
    tableBody.appendChild(tr);
  });
}

function renderChart(expenses) {
  const totalsByCategory = {};
  expenses.forEach(e => {
    totalsByCategory[e.category] = (totalsByCategory[e.category] || 0) + Number(e.amount);
  });

  const ctx = document.getElementById("categoryChart");
  const data = {
    labels: Object.keys(totalsByCategory),
    datasets: [{
      label: "Total by category",
      data: Object.values(totalsByCategory),
      backgroundColor: ["#198754", "#0d6efd", "#dc3545", "#6f42c1", "#6c757d"]
    }]
  };

  if (categoryChart) {
    categoryChart.data = data;
    categoryChart.update();
  } else {
    categoryChart = new Chart(ctx, { type: "bar", data, options: { plugins: { legend: { display: false } } } });
  }
}

// ---- Add ----

document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const title = document.getElementById("addTitle").value.trim();
  const amount = document.getElementById("addAmount").value;
  const category = document.getElementById("addCategory").value;
  const date = document.getElementById("addDate").value;

  const valid = title && Number(amount) > 0 && category && date;
  form.classList.add("was-validated");
  if (!valid) return;

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount: Number(amount), category, date })
    });
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "Could not add expense");
    }

    form.reset();
    form.classList.remove("was-validated");
    await loadExpenses();
  } catch (err) {
    showAlert(err.message);
  }
});

// ---- Edit ----

const editModalEl = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalEl);

tableBody.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".btn-edit");
  const deleteBtn = e.target.closest(".btn-delete");

  if (editBtn) {
    const id = Number(editBtn.dataset.id);
    const expense = allExpenses.find(x => x.id === id);
    if (!expense) return;

    document.getElementById("editId").value = expense.id;
    document.getElementById("editTitle").value = expense.title;
    document.getElementById("editAmount").value = expense.amount;
    document.getElementById("editCategory").value = expense.category;
    document.getElementById("editDate").value = expense.date;
    editModal.show();
  }

  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.id);
    deleteExpense(id);
  }
});

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const title = document.getElementById("editTitle").value.trim();
  const amount = Number(document.getElementById("editAmount").value);
  const category = document.getElementById("editCategory").value;
  const date = document.getElementById("editDate").value;

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, category, date })
    });
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "Could not update expense");
    }

    editModal.hide();
    await loadExpenses();
  } catch (err) {
    showAlert(err.message);
  }
});

// ---- Delete ----

async function deleteExpense(id) {
  if (!confirm("Delete this expense?")) return;

  try {
    const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "Could not delete expense");
    }

    await loadExpenses();
  } catch (err) {
    showAlert(err.message);
  }
}

// ---- Filter ----

filterCategory.addEventListener("change", renderTable);

// ---- Init ----

loadExpenses();
