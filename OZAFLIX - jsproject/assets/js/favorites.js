document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favoritesContainer");

  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function renderFavorites() {
    const favorites = getFavorites();
    container.innerHTML = "";

    if (favorites.length === 0) {
      container.innerHTML = "<p class='text-center'>You have no favorite movies yet.</p>";
      return;
    }

    favorites.forEach(movie => {
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4";

      card.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450'}"
             alt="${movie.Title}" class="w-full h-64 object-cover rounded">
        <h3 class="text-lg font-semibold mt-2">${movie.Title}</h3>
        <p class="text-gray-500 mt-1">${movie.Year}</p>
        <button class="mt-3 px-4 py-2 rounded bg-red-500 text-white">Remove Favorite</button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        let favs = getFavorites();
        favs = favs.filter(f => f.imdbID !== movie.imdbID);
        saveFavorites(favs);
        renderFavorites();
      });

      container.appendChild(card);
    });
  }

  renderFavorites();
});
