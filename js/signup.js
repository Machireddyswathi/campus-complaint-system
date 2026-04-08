const API = "https://campus-complaint-system-u46x.onrender.com";

async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (!name || !email || !password) {
    message.innerText = "All fields are required";
    return;
  }

  if (password.length < 6) {
    message.innerText = "Password must be at least 6 characters";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      message.innerText = data.message || "Signup failed";
      return;
    }

    showToast("Signup successful 🎉");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

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