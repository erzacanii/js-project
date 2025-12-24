document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("movieDetails");
  const API_KEY = "887bd310";

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    container.innerHTML = "<p class='text-center text-red-500'>Movie not found.</p>";
    return;
  }

  async function fetchMovieDetails() {
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}&plot=full`);
      const movie = await res.json();

      if (movie.Response === "False") {
        container.innerHTML = "<p class='text-center'>Movie not found.</p>";
        return;
      }

      container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}"
               onerror="this.src='https://via.placeholder.com/300x450'"
               class="w-full rounded shadow">

          <div>
            <h1 class="text-3xl font-bold mb-2">${movie.Title}</h1>
            <p class="text-gray-600 mb-1"><strong>Year:</strong> ${movie.Year}</p>
            <p class="text-gray-600 mb-1"><strong>Genre:</strong> ${movie.Genre}</p>
            <p class="text-gray-600 mb-1"><strong>Runtime:</strong> ${movie.Runtime}</p>
            <p class="text-gray-600 mb-1"><strong>IMDB Rating:</strong> ⭐ ${movie.imdbRating}</p>

            <p class="mt-4 text-gray-700">${movie.Plot}</p>

            <div class="mt-6 flex flex-wrap gap-3">
              <button id="favBtn" class="px-4 py-2 bg-blue-500 text-white rounded">
                Add to Favorites
              </button>
              <button id="watchBtn" class="px-4 py-2 bg-green-500 text-white rounded">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      `;

      setupButtons(movie);

    } catch (err) {
      console.error(err);
      container.innerHTML = "<p class='text-center text-red-500'>Error loading movie.</p>";
    }
  }

  // Favorites & Watchlist
  function getList(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  function saveList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
  }

  function setupButtons(movie) {
    const favBtn = document.getElementById("favBtn");
    const watchBtn = document.getElementById("watchBtn");

    let favorites = getList("favorites");
    let watchlist = getList("watchlist");

    const isFav = favorites.some(m => m.imdbID === movie.imdbID);
    const isWatch = watchlist.some(m => m.imdbID === movie.imdbID);

    if (isFav) favBtn.textContent = "Remove Favorite";
    if (isWatch) watchBtn.textContent = "In Watchlist";

    favBtn.addEventListener("click", () => {
      if (isFav) {
        favorites = favorites.filter(m => m.imdbID !== movie.imdbID);
      } else {
        favorites.push(movie);
      }
      saveList("favorites", favorites);
      location.reload();
    });

    watchBtn.addEventListener("click", () => {
      if (!isWatch) {
        watchlist.push(movie);
        saveList("watchlist", watchlist);
        watchBtn.textContent = "In Watchlist";
      }
    });
  }

  fetchMovieDetails();
});
