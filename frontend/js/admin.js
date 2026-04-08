const API = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

let currentPage = 1;

// protect page
if (!token || role !== "ADMIN") {
  window.location.href = "login.html";
}

// load complaints
async function loadComplaints() {
  const search = document.getElementById("search")?.value || "";
  const status = document.getElementById("filter")?.value || "";

  const url = `${API}/complaints?search=${search}&status=${status}&page=${currentPage}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    const complaints = data.complaints || data;

    const container = document.getElementById("complaints");
    container.innerHTML = "";

    complaints.forEach(c => {
      container.innerHTML += `
      <div class="card">

        <div class="card-header">
          <h4>${c.title}</h4>
          <span class="badge ${c.priority?.toLowerCase() || "medium"}">
            ${c.priority || "Medium"}
          </span>
        </div>

        <p class="desc">${c.description}</p>

        <div class="meta">
          <span class="badge ${getStatusClass(c.status)}">
            ${c.status}
          </span>
        </div>

        <div class="user-info">
          <p><b>Student:</b> ${c.user.name}</p>
          <p><b>Email:</b> ${c.user.email}</p>
        </div>

        <div class="admin-actions">

          <select onchange="updateStatus('${c._id}', this.value)">
            <option value="">Update Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <input 
            placeholder="Admin note..."
            value="${c.adminNote || ""}"
            onchange="updateNote('${c._id}', this.value)"
          />

        </div>

      </div>
      `;
    });

    renderPagination(data.pages || 1);

  } catch (err) {
    console.error(err);
    showToast("Error loading complaints ❌");
  }
}

// update status
async function updateStatus(id, status) {
  await fetch(`${API}/complaints/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  showToast("Status updated ✅");
  loadComplaints();
}

// update note
async function updateNote(id, note) {
  await fetch(`${API}/complaints/note/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ adminNote: note })
  });

  showToast("Note saved 📝");
}

// stats
async function loadStats() {
  const res = await fetch(`${API}/complaints/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  document.getElementById("stats").innerHTML = `
    <div class="stat-card"><h3>${data.total}</h3><p>Total</p></div>
    <div class="stat-card"><h3>${data.pending}</h3><p>Pending</p></div>
    <div class="stat-card"><h3>${data.inProgress}</h3><p>In Progress</p></div>
    <div class="stat-card"><h3>${data.resolved}</h3><p>Resolved</p></div>
  `;
}

// pagination
function renderPagination(totalPages) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    container.innerHTML += `
      <button onclick="goToPage(${i})">${i}</button>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  loadComplaints();
}
function getStatusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "In Progress") return "progress";
  if (status === "Resolved") return "resolved";
  return "";
}
// toast
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

// logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// init
loadComplaints();
loadStats();