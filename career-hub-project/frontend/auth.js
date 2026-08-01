
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const userBar = document.getElementById("userLinks");
  const guestBar = document.getElementById("guestLinks");
  const nameDisplay = document.getElementById("navbarUser");

  if (user) {
    if (userBar) userBar.style.display = "inline";
    if (guestBar) guestBar.style.display = "none";
    if (nameDisplay) nameDisplay.innerText = `Hi, ${user.name}`;
  } else {
    if (userBar) userBar.style.display = "none";
    if (guestBar) guestBar.style.display = "inline";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
});

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  alert("👋 Logged out!");
  window.location.href = "index.html";
}

const publicPages = ["index.html", "login.html", "signup.html", "contact.html"];
const currentPage = window.location.pathname.split("/").pop();

if (!publicPages.includes(currentPage)) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("🔐 Please login to view this page.");
    window.location.href = "login.html";
  }
}
