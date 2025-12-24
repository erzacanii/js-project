document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  document.getElementById("favCount").textContent = favorites.length;
  document.getElementById("watchCount").textContent = watchlist.length;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
});
