document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("watchlistContainer");

  function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  }

  function saveWatchlist(watchlist) {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  function renderWatchlist() {
    const watchlist = getWatchlist();
    container.innerHTML = "";

    if (watchlist.length === 0) {
      container.innerHTML = "<p class='text-center'>Your watchlist is empty.</p>";
      return;
    }

    watchlist.forEach(movie => {
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4";

      card.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450'}"
             alt="${movie.Title}" class="w-full h-64 object-cover rounded">
        <h3 class="text-lg font-semibold mt-2">${movie.Title}</h3>
        <p class="text-gray-500 mt-1">${movie.Year}</p>
        <button class="mt-3 px-4 py-2 rounded bg-red-500 text-white">Remove from Watchlist</button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        let watchlist = getWatchlist();
        watchlist = watchlist.filter(f => f.imdbID !== movie.imdbID);
        saveWatchlist(watchlist);
        renderWatchlist();
      });

      container.appendChild(card);
    });
  }

  renderWatchlist();
});
