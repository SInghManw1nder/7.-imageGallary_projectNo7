// let apiKey = "563492ad6f9170000100000104606eb1c1244340bf2cede1c4a42568"; //Dont forget to add your own key
let apiKey = "563492ad6f91700001000001226fc8f4dc9747d78c09f483b22355ce";
// let apiKey = "563492ad6f917000010000019b983f3b62fe43daa92e746d4553dd35";
let api = [
  "563492ad6f9170000100000104606eb1c1244340bf2cede1c4a42568",
  "563492ad6f91700001000001226fc8f4dc9747d78c09f483b22355ce",
  "563492ad6f917000010000019b983f3b62fe43daa92e746d4553dd35",
];
let keyInUse = 2;
const searchInput = document.querySelector(".search-input");
const viewMore = document.querySelector(".view-more");
const searchForm = document.querySelector(".search-form");
const mainContent = document.querySelector(".main-content");
const noInternet = document.querySelector(".noInternet");

let pageNumber = 1;
let randomPageNumber = 0;
const options = 533;

let fetchLink;
let currentSearch;
let searchValue;

//Event Listeners

// document.querySelectorAll(".gallery").addEventListener("click", alert());

searchInput.addEventListener("input", (e) => {
  //Prevent page reloading
  searchValue = e.target.value;
});
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

window.addEventListener(
  "scroll",
  () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    console.log(
      `scrollTop, scrollHeight, clientHeight = ${scrollTop}, ${scrollHeight}, ${clientHeight}`
    );
    console.log(`scrollTop + clientHeight = ${scrollTop + clientHeight}`);
    console.log(` scrollHeight * 0.75 = ${scrollHeight * 0.75}`);

    // scrollTop + clientHeight >= scrollHeight - 2000
    if (scrollTop + clientHeight >= scrollHeight * 0.75) {
      if (isOnline()) {
        connectedToInternet();
        loadMoreImages();
      } else {
        notConnectedToInternet();
      }
    }
  },
  {
    passive: true,
  }
);
// viewMore.addEventListener("click", loadMoreImages);

const apiHeaders = async (url) => {
  // const dataFetch = await fetch(url, {
  //   method: "GET",
  //   headers: {
  //     Accept: "application/json",
  //     Authorization: apiKey,
  //   },
  // });
  let dataFetch;
  do {
    dataFetch = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: api[keyInUse],
      },
    });

    if (dataFetch.status === 429) {
      keyInUse = ++keyInUse % 3;
    } else {
      break;
    }
  } while (true);
  // alert(dataFetch.status);
  console.log(dataFetch.status);

  const data = await dataFetch.json();
  return data;
};

//imageholder item blog
//Generate HTML Markup
const generateMarkup = (data) => {
  data.photos.forEach((photo) => {
    const gallery = document.createElement("div");
    gallery.classList.add("gallery");
    console.log(photo.src);
    const source = `${photo.src.original}?auto=compress&cs=tinysrgb&h=200&w=280&dpr=1`;
    console.log(source);
    gallery.innerHTML = `<div class="image-holder"><img src=${source}></img>
                <div class="profile">
                    <a href=${photo.photographer_url} target="_blank">${photo.photographer}<a>
                    <a href=${photo.src.original} target="_blank"><img src="img/download.svg"></img></a>
                </div>
            </div>`;

    mainContent.appendChild(gallery);
  });
};

//Get Curated Photos
const curatedPhotos = async () => {
  if (isOnline()) {
    connectedToInternet();
    randomPageNumber = Math.floor(Math.random() * options);
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${randomPageNumber}`;

    const data = await apiHeaders(fetchLink);
    //Data from the Api
    generateMarkup(data);
  } else {
    notConnectedToInternet();
  }
};

//Clear Input
const clearInput = () => {
  mainContent.innerHTML = "";
  searchInput.value = "";
};

const searchPhotos = async (searchQuery) => {
  //Clear existing images on submit
  if (isOnline()) {
    connectedToInternet();
    clearInput();
    console.log(searchQuery);
    if (searchQuery === undefined) {
      randomPageNumber = Math.floor(Math.random() * options);
      fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${randomPageNumber}`;
    } else
      fetchLink = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=15`;
    const data = await apiHeaders(fetchLink);

    //Data from the Api
    generateMarkup(data);
  } else {
    notConnectedToInternet();
  }
};

//Load More Images
async function loadMoreImages() {
  pageNumber++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${pageNumber}`;
  } else {
    randomPageNumber = Math.floor(Math.random() * options);
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${randomPageNumber}`;
  }

  const data = await apiHeaders(fetchLink);
  generateMarkup(data);
}

function isOnline() {
  return navigator.onLine;
}

function notConnectedToInternet() {
  noInternet.style.display = "flex";
  mainContent.style.display = "none";
}
function connectedToInternet() {
  noInternet.style.display = "none";
  mainContent.style.display = "grid";
}
// searchPhotos();
curatedPhotos();
