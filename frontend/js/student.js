const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

let currentPage = 1;

// protect page
if (!token) {
  window.location.href = "login.html";
}

// load complaints
async function loadComplaints() {
  const search = document.getElementById("search")?.value || "";
  const status = document.getElementById("filter")?.value || "";

  let url = `${API}/complaints/my?search=${search}&status=${status}&page=${currentPage}`;

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

    // ✅ empty state
    if (!complaints.length) {
      container.innerHTML = `
  <p style="text-align:center;color:#636e72;">
    No complaints available
  </p>
`;
      return;
    }

    complaints.forEach(c => {
      container.innerHTML += `
      <div class="card">

        <div class="card-header">
          <h4>${c.title}</h4>
          <span class="badge ${c.priority.toLowerCase()}">
            ${c.priority}
          </span>
        </div>

        <p class="desc">${c.description}</p>

        <div class="meta">
          <span class="badge ${getStatusClass(c.status)}">
            ${c.status}
          </span>
        </div>

        ${c.adminNote ? `
        <div class="user-info">
          <p><b>Admin Note:</b> ${c.adminNote}</p>
        </div>
        ` : ""}

        ${c.status !== "Resolved" ? `
        <button class="btn-warning"
          onclick="editComplaint('${c._id}','${c.title}','${c.description}')">
          Edit
        </button>

        <button class="btn-danger"
          onclick="deleteComplaint('${c._id}')">
          Delete
        </button>
        ` : `<p><i>🔒 Locked (Resolved)</i></p>`}

      </div>
      `;
    });

    renderPagination(data.pages || 1);

  } catch (err) {
    console.error(err);
    showToast("Failed to load complaints ❌");
  }
}

// create complaint
async function createComplaint() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;

  if (!title || !description) {
    showToast("Please fill all fields ⚠️");
    return;
  }

  await fetch(`${API}/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, description, priority })
  });

  showToast("Complaint created");
  loadComplaints();
}

// delete complaint
async function deleteComplaint(id) {
  await fetch(`${API}/complaints/my/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  showToast("Deleted successfully");
  loadComplaints();
}

// edit complaint
async function editComplaint(id, oldTitle, oldDesc) {
  const title = prompt("Edit title", oldTitle);
  const description = prompt("Edit description", oldDesc);

  if (!title || !description) return;

  await fetch(`${API}/complaints/my/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  });

  showToast("Updated successfully ");
  loadComplaints();
}

// status color
function getStatusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "In Progress") return "progress";
  if (status === "Resolved") return "resolved";
}

// pagination
function renderPagination(totalPages) {
  const container = document.getElementById("pagination");
  if (!container) return;

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

// toast
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
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