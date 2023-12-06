const global = {
  currentPage: window.location.pathname,
};

//TODO: fetch 20 data from API
const fetchAPIData = async (endpoint) => {
  showSpinner();
  const API_KEY = "bfad36019b67540b0df28f5eb68fa0c7";
  const API_URL = "https://api.themoviedb.org/3/";

  const res = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await res.json();

  return data;
};

//TODO: Show/Hide Spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

//TODO: Popular Movies
const getPopularMovies = async () => {
  const { results } = await fetchAPIData("movie/popular");
  console.log(results);

  setPopularMovies(results);
};

const setPopularMovies = (movies) => {
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
              src="https:image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="Movie Title"
            />`
                : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="Movie Title"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
  `;

    document.querySelector("#popular-movies").appendChild(div);
  });
  hideSpinner();
};

//TODO: Popular Shows
const getPopularShows = async () => {
  const { results } = await fetchAPIData("tv/popular");
  console.log(results);

  setPopularShows(results);
};

const setPopularShows = (shows) => {
  shows.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="movie-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img
              src="https:image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
                : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="Movie Title"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>
  `;

    document.querySelector("#popular-shows").appendChild(div);
  });
  hideSpinner();
};

//TODO: Active links styling
function highlightActivelink() {
  const activeLinks = document.querySelectorAll(".nav-link");

  activeLinks.forEach((active) => {
    if (active.getAttribute("href") === global.currentPage) {
      active.classList.add("active");
    }
  });
}

//! Startup functions
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      getPopularMovies();
      break;
    case "/movie-details.html":
      console.log("Movie Details");
      break;
    case "/shows.html":
      getPopularShows();
      break;
    case "/movie-details.html":
      console.log("TV Details");
      break;
    case "/search.html":
      console.log("Search");
      break;
  }

  highlightActivelink();
}

document.addEventListener("DOMContentLoaded", init);
