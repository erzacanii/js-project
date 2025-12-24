document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("moviesContainer");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const categoryBtns = document.querySelectorAll(".categoryBtn");

  const API_KEY = "887bd310"; // OMDb API key
  let currentMovies = [];
  let currentTerm = "star"; // term i sigurt fillestar

  /* =======================
     FAVORITES
  ======================== */
  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function toggleFavorite(movie) {
    let favorites = getFavorites();
    const exists = favorites.find(f => f.imdbID === movie.imdbID);

    if (exists) {
      favorites = favorites.filter(f => f.imdbID !== movie.imdbID);
    } else {
      favorites.push(movie);
    }

    saveFavorites(favorites);
    renderMovies(currentMovies);
  }

  /* =======================
     WATCHLIST
  ======================== */
  function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  }

  function saveWatchlist(watchlist) {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  function toggleWatchlist(movie) {
    let watchlist = getWatchlist();
    const exists = watchlist.find(f => f.imdbID === movie.imdbID);

    if (exists) {
      watchlist = watchlist.filter(f => f.imdbID !== movie.imdbID);
    } else {
      watchlist.push(movie);
    }

    saveWatchlist(watchlist);
    renderMovies(currentMovies);
  }

  /* =======================
     RENDER MOVIES
  ======================== */
  function renderMovies(movies) {
    currentMovies = movies;
    container.innerHTML = "";

    const favorites = getFavorites();
    const watchlist = getWatchlist();

    movies.forEach(movie => {
      const isFavorite = favorites.some(f => f.imdbID === movie.imdbID);
      const inWatchlist = watchlist.some(w => w.imdbID === movie.imdbID);

      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4 flex flex-col";

      const poster = movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450";

      card.innerHTML = `
        <img src="${poster}" alt="${movie.Title}"
             class="w-full h-64 object-cover rounded cursor-pointer poster">

        <h3 class="text-lg font-semibold mt-2 cursor-pointer title">
          ${movie.Title}
        </h3>

        <p class="text-gray-500">${movie.Year}</p>

        <div class="flex flex-col gap-2 mt-3">
          <button class="favBtn px-4 py-2 rounded text-white
            ${isFavorite ? "bg-red-500" : "bg-blue-500"}">
            ${isFavorite ? "Remove Favorite" : "Add Favorite"}
          </button>

          <button class="watchBtn px-4 py-2 rounded text-white
            ${inWatchlist ? "bg-gray-500" : "bg-green-500"}">
            ${inWatchlist ? "In Watchlist" : "Add Watchlist"}
          </button>

          <button class="detailsBtn px-4 py-2 rounded bg-yellow-500 text-white">
            View Details
          </button>
        </div>
      `;

      // Events
      card.querySelector(".favBtn")
        .addEventListener("click", () => toggleFavorite(movie));

      card.querySelector(".watchBtn")
        .addEventListener("click", () => toggleWatchlist(movie));

      card.querySelector(".detailsBtn")
        .addEventListener("click", () => {
          window.location.href = `movies-details.html?id=${movie.imdbID}`;
        });

      card.querySelector(".poster")
        .addEventListener("click", () => {
          window.location.href = `movies-details.html?id=${movie.imdbID}`;
        });

      card.querySelector(".title")
        .addEventListener("click", () => {
          window.location.href = `movies-details.html?id=${movie.imdbID}`;
        });

      container.appendChild(card);
    });
  }

  /* =======================
     FETCH MOVIES (OMDb)
  ======================== */
  async function fetchMovies(term) {
    container.innerHTML = "<p class='text-center'>Loading...</p>";

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(term)}&type=movie&page=1`
      );
      const data = await res.json();

      if (data.Response === "True") {
        renderMovies(data.Search);
      } else {
        container.innerHTML = `<p class='text-center'>No movies found</p>`;
      }
    } catch (err) {
      console.error(err);
      container.innerHTML =
        "<p class='text-center text-red-500'>Error fetching movies</p>";
    }
  }

  /* =======================
     SEARCH
  ======================== */
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const term = searchInput.value.trim();
      if (term) {
        currentTerm = term;
        fetchMovies(term);
      }
    });
  }

  /* =======================
     CATEGORIES (search terms)
  ======================== */
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const term = btn.dataset.category;
      currentTerm = term;
      if (searchInput) searchInput.value = "";
      fetchMovies(term);
    });
  });

  /* =======================
     INITIAL LOAD
  ======================== */
  fetchMovies(currentTerm);
});
