document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("moviesContainer");

  if (!container) {
    console.error("moviesContainer not found");
    return;
  }

  const API_KEY = "887bd310"; // OMDb API KEY
  const initialTerm = "star"; // term i sigurt

  let currentMovies = [];

  /* =========================
     FAVORITES
  ========================== */
  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }

  function saveFavorites(list) {
    localStorage.setItem("favorites", JSON.stringify(list));
  }

  function toggleFavorite(movie) {
    let favorites = getFavorites();
    const exists = favorites.find(m => m.imdbID === movie.imdbID);

    if (exists) {
      favorites = favorites.filter(m => m.imdbID !== movie.imdbID);
    } else {
      favorites.push(movie);
    }

    saveFavorites(favorites);
    renderMovies(currentMovies);
  }

  /* =========================
     WATCHLIST
  ========================== */
  function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  }

  function saveWatchlist(list) {
    localStorage.setItem("watchlist", JSON.stringify(list));
  }

  function toggleWatchlist(movie) {
    let watchlist = getWatchlist();
    const exists = watchlist.find(m => m.imdbID === movie.imdbID);

    if (!exists) {
      watchlist.push(movie);
      saveWatchlist(watchlist);
    }
  }

  /* =========================
     RENDER MOVIES
  ========================== */
  function renderMovies(movies) {
    currentMovies = movies;
    container.innerHTML = "";

    const favorites = getFavorites();
    const watchlist = getWatchlist();

    movies.slice(0, 10).forEach(movie => {
      const isFavorite = favorites.some(f => f.imdbID === movie.imdbID);
      const inWatchlist = watchlist.some(w => w.imdbID === movie.imdbID);

      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4";

      /* Poster */
      const img = document.createElement("img");
      img.src = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450";
      img.alt = movie.Title;
      img.className = "w-full h-64 object-cover rounded cursor-pointer";
      img.onerror = () => {
        img.src = "https://via.placeholder.com/300x450";
      };
      img.addEventListener("click", () => {
        window.location.href = `movies-details.html?id=${movie.imdbID}`;
      });

      /* Title */
      const title = document.createElement("h3");
      title.textContent = movie.Title;
      title.className = "text-lg font-semibold mt-2 cursor-pointer";
      title.addEventListener("click", () => {
        window.location.href = `movies-details.html?id=${movie.imdbID}`;
      });

      /* Year */
      const year = document.createElement("p");
      year.textContent = movie.Year;
      year.className = "text-gray-500 mt-1";

      /* Buttons */
      const btnBox = document.createElement("div");
      btnBox.className = "flex flex-col gap-2 mt-3";

      // Favorite
      const favBtn = document.createElement("button");
      favBtn.textContent = isFavorite ? "Remove Favorite" : "Add to Favorite";
      favBtn.className = `px-4 py-2 rounded text-white ${
        isFavorite ? "bg-red-500" : "bg-blue-500"
      }`;
      favBtn.addEventListener("click", () => toggleFavorite(movie));

      // Watchlist
      const watchBtn = document.createElement("button");
      watchBtn.textContent = inWatchlist ? "In Watchlist" : "Add to Watchlist";
      watchBtn.className = `px-4 py-2 rounded text-white ${
        inWatchlist ? "bg-gray-500" : "bg-green-500"
      }`;
      watchBtn.addEventListener("click", () => {
        toggleWatchlist(movie);
        renderMovies(currentMovies);
      });

      // View Details
      const detailsBtn = document.createElement("button");
      detailsBtn.textContent = "View Details";
      detailsBtn.className = "px-4 py-2 rounded bg-yellow-500 text-white";
      detailsBtn.addEventListener("click", () => {
        window.location.href = `movies-details.html?id=${movie.imdbID}`;
      });

      btnBox.appendChild(favBtn);
      btnBox.appendChild(watchBtn);
      btnBox.appendChild(detailsBtn);

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(year);
      card.appendChild(btnBox);

      container.appendChild(card);
    });
  }

  /* =========================
     FETCH MOVIES
  ========================== */
  async function fetchMovies(term) {
    container.innerHTML = "<p class='text-center'>Loading movies...</p>";

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(term)}&type=movie&page=1`
      );
      const data = await res.json();

      if (data.Response === "True") {
        renderMovies(data.Search);
      } else {
        container.innerHTML = "<p class='text-center'>No movies found.</p>";
      }
    } catch (error) {
      console.error(error);
      container.innerHTML =
        "<p class='text-center text-red-500'>Error fetching movies.</p>";
    }
  }

  /* =========================
     INIT
  ========================== */
  fetchMovies(initialTerm);
});
