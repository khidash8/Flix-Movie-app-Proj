//? Global
const global = {
  currentPage: window.location.pathname,
};

//! Startup functions & EVENTS!
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      swiperNowPlaying();
      getPopularMovies();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/shows.html":
      getPopularShows();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      console.log("Search");
      break;
  }

  highlightActivelink();
}

document.addEventListener("DOMContentLoaded", init);

//todo- Active links styling
function highlightActivelink() {
  const activeLinks = document.querySelectorAll(".nav-link");

  activeLinks.forEach((active) => {
    if (active.getAttribute("href") === global.currentPage) {
      active.classList.add("active");
    }
  });
}

//todo- fetch 20 data from API
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

//todo- Show/Hide Spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

//todo- Swipe through Now playing playlist
const swiperNowPlaying = async () => {
  //? get the movies to swipe through
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https:image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
          1
        )} / 10
      </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);
  });

  initSwiperFunction();
};

const initSwiperFunction = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 2,
    spaceBetween: 10,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    pagination: {
      enabled: true,
      bulletActiveClass: "swiper-pagination-bullet-active",
      el: ".swiper-pagination",
      type: "bullets",
    },
    breakpoints: {
      // when window width is >= 320px
      500: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      700: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      // when window width is >= 640px
      1200: {
        slidesPerView: 5,
        spaceBetween: 40,
      },
    },
  });
};

//todo- Popular Movies
const getPopularMovies = async () => {
  const { results } = await fetchAPIData("movie/popular");
  // console.log(results);

  displayPopularMovies(results);
};

const displayPopularMovies = (movies) => {
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
              alt="${movie.title}"
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

//todo- Movie Details
const displayMovieDetails = async () => {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`/movie/${movieId}`);

  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
          <div>
          ${
            movie.poster_path
              ? `<img
            src="https:image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`
              : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>${movie.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map((m) => `<li>${m.name}</li>`).join("")}
            </ul>
            <a href='${
              movie.homepage
            }' target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${numberWithCommas(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> Released</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map(
            (comp) => `<span>${comp.name}</span>`
          )}</div>
        </div>
  `;

  document.querySelector("#movie-details").appendChild(div);

  hideSpinner();
  displayBackgrondImage("movie", movie.backdrop_path);

  console.log(movie);
};

//todo- Popular Shows
const getPopularShows = async () => {
  const { results } = await fetchAPIData("tv/popular");
  console.log(results);

  displayPopularShows(results);
};

const displayPopularShows = (shows) => {
  shows.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
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

const displayShowDetails = async () => {
  const showId = window.location.search.split("=")[1];
  const show = await fetchAPIData(`/tv/${showId}`);

  const showDetailsDiv = document.createElement("div");
  showDetailsDiv.innerHTML = `
  <div class="details-top">
  <div>
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
  alt="${show.name}"
/>`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last air date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((gen) => `<li>${gen.name}</li>`).join("")}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li>
      <span class="text-secondary">No of seasons:</span> ${
        show.number_of_seasons
      }</li>
    <li><span class="text-secondary">Status: </span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${show.production_companies
    .map((comp) => `<p>${comp.name}</p>`)
    .join("")}</div>
</div>
  `;

  // console.log(show);
  //? parent el
  const divParent = document.querySelector("#show-details");
  divParent.appendChild(showDetailsDiv);

  //? backdrop img
  displayBackgrondImage("tv", show.backdrop_path);

  hideSpinner();
};

//? separate Numbers With commas
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//? Details page backdrop image
const displayBackgrondImage = (type, backdropPath) => {
  const overlayDiv = document.createElement("div");
  const style = overlayDiv.style;
  style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`;
  style.backgroundPosition = "center";
  style.backgroundRepeat = "no-repeat";
  style.height = "100vh";
  style.width = "100vw";
  style.position = "absolute";
  style.top = "0";
  style.left = "0";
  style.zIndex = "-10";
  style.opacity = 0.1;

  type === "movie"
    ? document.querySelector("#movie-details").appendChild(overlayDiv)
    : document.querySelector("#show-details").appendChild(overlayDiv);
};
