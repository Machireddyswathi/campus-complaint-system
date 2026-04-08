const API = "https://campus-complaint-system-u46x.onrender.com";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (!email || !password) {
    message.innerText = "Please fill all fields";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      message.innerText = data.message || "Login failed";
      return;
    }

    // store token & role
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    showToast("Login successful");

    // redirect
    setTimeout(() => {
      if (data.user.role === "ADMIN") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "student.html";
      }
    }, 1000);

  } catch (error) {
    message.innerText = "Server error. Try again.";
  }
}

// toast
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}