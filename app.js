// let apiKey = "563492ad6f9170000100000104606eb1c1244340bf2cede1c4a42568"; //Dont forget to add your own key
let apiKey = "563492ad6f91700001000001226fc8f4dc9747d78c09f483b22355ce";
// let apiKey = "563492ad6f917000010000019b983f3b62fe43daa92e746d4553dd35";
let api = [
  "563492ad6f9170000100000104606eb1c1244340bf2cede1c4a42568",
  "563492ad6f91700001000001226fc8f4dc9747d78c09f483b22355ce",
  "563492ad6f917000010000019b983f3b62fe43daa92e746d4553dd35",
  "563492ad6f917000010000014060d806c66c47b88b9b4d7f8c487692",
  "563492ad6f91700001000001ee0e9ca6636a40a2922a3057ed643c83",
  "563492ad6f91700001000001d4bfd73691c24786accf5bfa2d13b084",
  "563492ad6f917000010000019e8c9190f2314cdabae714932498b9c7",
  "563492ad6f91700001000001917f4472446847cdb73382c8069c4ec2",
  "563492ad6f9170000100000163eb6a24220b437cbd784b1cff6865cd",
  "563492ad6f91700001000001f89041f69d0a47538b315fc967356983",
  "563492ad6f91700001000001c5f0fdbccfbc4f36bde43e2f95914b76",
];
let keyInUse = 1;
const searchInput = document.querySelector(".search-input");
const viewMore = document.querySelector(".view-more");
const searchForm = document.querySelector(".search-form");
const mainContent = document.querySelector(".main-content");
const noInternet = document.querySelector(".noInternet");

let pageNumber = 1;
let randomPageNumber = 0;
const options = 500;
const perPage = 30; //perpage photos

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
  console.clear();
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
  // document.querySelector(".overlay").style.display = "flex";
  // document.querySelector(".main-content").style.visibility = "hidden";
});

window.addEventListener(
  "resize",
  function (event) {
    console.log("resize before");
    resize();
    console.log("resize after");
  },
  true
);

function resize() {
  $grid.imagesLoaded(function () {
    console.log("before resize inside 1");
    $grid.masonry("layout");
    console.log("after resize inside 1");
  });
  console.log("before resize inside 2");
  $grid.masonry("layout");
  console.log("after resize inside 2");
}

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
  console.log(url.includes("query"));
  let dataFetch;
  let flag = 0;
  let data;
  let copyUrl = url;
  do {
    do {
      flag = 0;
      dataFetch = await fetch(copyUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: api[keyInUse],
        },
      });

      if (dataFetch.status === 429) {
        keyInUse = ++keyInUse % 11;
      } else {
        break;
      }
    } while (true);
    // alert(dataFetch.status);
    console.log(dataFetch.status);

    data = await dataFetch.json();
    console.log(dataFetch);
    console.log(data);
    console.log(data.per_page);
    if (data.per_page === 0) {
      flag = 1;
      if (!url.includes("query")) {
        randomPageNumber = Math.floor(Math.random() * options);
        fetchLink = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${randomPageNumber}`; //uses perpage variable
        // fetchLink = `https://api.pexels.com/v1/curated?per_page=30&page=${randomPageNumber}`;
        copyUrl = fetchLink;
      }
    }
  } while (flag);
  return data;
};

//imageholder item blog
//Generate HTML Markup
const generateMarkup = (data) => {
  // const arr = []; //added for faster performace sending all photos at once
  data.photos.forEach((photo) => {
    const gallery = document.createElement("div");
    gallery.classList.add("gallery");
    gallery.classList.add("grid-item");
    // console.log(photo.src);
    const source = `${photo.src.medium}`;
    // console.log(source);
    gallery.innerHTML = `<div class="image-holder"}"><img src=${source}></img>
                <div class="profile">
                    <a href=${photo.photographer_url} target="_blank">${photo.photographer}<a>
                    <a href=${photo.src.original} target="_blank"><img src="img/download.svg"></img></a>
                </div>
            </div>`;
    ele(gallery);
    // arr.push(gallery);//performance faster
    // mainContent.appendChild(gallery);
  });
  //below for faster performance
  // console.log(arr);
  // ele(arr);
  // $grid.imagesLoaded(function () {
  //   console.log("before resize inside 1");
  //   $grid.masonry("layout");
  //   console.log("after resize inside 1");
  // });
  // // console.log("before resize inside 2");
  // // $grid.masonry("layout");
  // // console.log("after resize inside 2");
  // document.querySelector(".overlay").style.display = "none";
  // document.querySelector(".main-content").style.visibility = "visible";
  var currentDateTime = new Date();
  console.log(" before setTimeout The current date time is as follows:");
  console.log(currentDateTime);

  setTimeout(function () {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".main-content").style.visibility = "visible";
    document.querySelector(".endingLoad").style.visibility = "visible";
    // alert("searchloaded");
    var currentDateTime2 = new Date();
    console.log(" inside setTimeout The current date time is as follows:");
    console.log(currentDateTime2);
  }, 1000);
  var currentDateTime1 = new Date();
  console.log(" after setTimeout The current date time is as follows:");
  console.log(currentDateTime1);
  document.querySelector(".endingLoad").style.display = "flex";
};

//Get Curated Photos
const curatedPhotos = async () => {
  console.clear();
  document.querySelector(".overlay").style.display = "flex";
  document.querySelector(".main-content").style.visibility = "hidden";
  // var currentDateTime = new Date();
  // console.log(" before setTimeout The current date time is as follows:");
  // console.log(currentDateTime);
  console.log(isOnline());
  if (isOnline()) {
    connectedToInternet();
    randomPageNumber = Math.floor(Math.random() * options);
    fetchLink = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${randomPageNumber}`; //uses perpage variable
    // fetchLink = `https://api.pexels.com/v1/curated?per_page=30&page=${randomPageNumber}`;

    const data = await apiHeaders(fetchLink);
    //Data from the Api
    generateMarkup(data);
  } else {
    notConnectedToInternet();
  }
  // setTimeout(function () {
  //   // document.querySelector(".overlay").style.display = "none";
  //   // document.querySelector(".main-content").style.visibility = "visible";
  //   var currentDateTime2 = new Date();
  //   console.log(" inside setTimeout The current date time is as follows:");
  //   console.log(currentDateTime2);
  // }, 5000);
  // var currentDateTime1 = new Date();
  // console.log(" after setTimeout The current date time is as follows:");
  // console.log(currentDateTime1);
};

//Clear Input
const clearInput = () => {
  mainContent.innerHTML = "";
  // searchInput.value = "";
};

const searchPhotos = async (searchQuery) => {
  //Clear existing images on submit
  document.querySelector(".overlay").style.display = "flex";
  document.querySelector(".main-content").style.visibility = "hidden";
  console.log(isOnline());

  if (isOnline()) {
    connectedToInternet();
    clearInput();
    console.log(searchQuery);
    if (searchQuery === undefined || searchQuery === "") {
      randomPageNumber = Math.floor(Math.random() * options);
      fetchLink = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${randomPageNumber}`; //uses perpage variable
      // fetchLink = `https://api.pexels.com/v1/curated?per_page=30&page=${randomPageNumber}`;
    } else
      fetchLink = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=${perPage}`; //uses perpage variable
    // fetchLink = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=30`;

    const data = await apiHeaders(fetchLink);

    //Data from the Api
    generateMarkup(data);
  } else {
    // alert();
    notConnectedToInternet();
  }
  // var currentDateTime = new Date();
  // console.log(" before setTimeout The current date time is as follows:");
  // console.log(currentDateTime);

  // // setTimeout(function () {
  // //   // document.querySelector(".overlay").style.display = "none";
  // //   // document.querySelector(".main-content").style.visibility = "visible";
  // //   // alert("searchloaded");
  // //   var currentDateTime2 = new Date();
  // //   console.log(" inside setTimeout The current date time is as follows:");
  // //   console.log(currentDateTime2);
  // // }, 5000);
  // var currentDateTime1 = new Date();
  // console.log(" after setTimeout The current date time is as follows:");
  // console.log(currentDateTime1);
};

//Load More Images
async function loadMoreImages() {
  pageNumber++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=${perPage}&page=${pageNumber}`; //uses perpage variable
    // fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=30&page=${pageNumber}`;
  } else {
    randomPageNumber = Math.floor(Math.random() * options);
    fetchLink = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${randomPageNumber}`; //use perPage variable
    // fetchLink = `https://api.pexels.com/v1/curated?per_page=30&page=${randomPageNumber}`;
  }

  const data = await apiHeaders(fetchLink);
  generateMarkup(data);
}

function isOnline() {
  return navigator.onLine;
}

function notConnectedToInternet() {
  // alert("not connected");
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".endingLoad").style.display = "none";

  noInternet.style.display = "flex";
  mainContent.style.display = "none";
}
function connectedToInternet() {
  noInternet.style.display = "none";
  mainContent.style.display = "grid";
}
// searchPhotos();

var $grid = $(".grid").imagesLoaded(function () {
  $(".grid").masonry({
    columnWidth: 1,
    itemSelector: ".grid-item",
    horizontalOrder: false,
    gutter: 10,
    fitWidth: true,
  });
});
function ele(gallary) {
  // var elems = [getItemElement()];
  $grid.masonry("layout");
  var elems = [gallary];
  // make jQuery object
  var $elems = $(elems);

  // var $elems = $(gallary); faster performance
  $grid.imagesLoaded(async function () {
    $grid.append(elems).masonry("appended", elems);

    // $grid.append(gallary).masonry("appended", gallary);faster performance
    // $grid;
    // $grid.masonry("appended", elems);
    // await $grid.imagesLoaded().progress(function () {
    //   $grid.masonry("layout");
    // });
    $grid.imagesLoaded(function () {
      $grid.masonry("layout");
    });
    // $grid.masonry("layout"); faster performance

    // $grid.masonry("layoutItems", gallary, (isStill = true));faster performance
  });
  // $grid.masonry('layout');
}
document.querySelector(".endingLoad").style.visibility = "hidden";
curatedPhotos();

document.querySelector(".toggleTheme").addEventListener("click", function () {
  document.querySelector(".toggleTheme").classList.toggle("fa-sun");
  document.querySelector(".toggleTheme").classList.toggle("fa-moon");

  if (document.querySelector(".toggleTheme").classList.contains("fa-sun")) {
    document.querySelector(".header").style.backgroundColor = "black";
    document.querySelector(".input-control input").style.backgroundColor =
      "white";
    document.querySelector(".input-control input").style.color = "#192232";

    document.querySelector(".input-control button").style.backgroundColor =
      "white";
    document.body.style.backgroundColor = "black";
    document.querySelector(".input-control button img").style.filter =
      "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7483%) hue-rotate(32deg) brightness(103%) contrast(104%)";
    document.querySelector(".loadCircleBottom").style.color = "white";
    document.querySelector(".loadCircleUp").style.color = "white";
    document.querySelector(".noInternetMessage").style.color = "white";
    document.querySelector(".toggleTheme").style.color = "white";
  } else {
    document.querySelector(".header").style.backgroundColor = "lightslategrey";
    document.body.style.backgroundColor = "whitesmoke";
    document.querySelector(".input-control input").style.backgroundColor =
      "#192232";
    document.querySelector(".input-control input").style.color = "white";
    document.querySelector(".input-control button").style.backgroundColor =
      "#192232";
    document.querySelector(".input-control button img").style.filter =
      "brightness(0) saturate(100%) invert(98%) sepia(0%) saturate(0%) hue-rotate(78deg) brightness(107%) contrast(101%)";
    document.querySelector(".loadCircleBottom").style.color = "#192232";
    document.querySelector(".loadCircleUp").style.color = "#192232";
    document.querySelector(".noInternetMessage").style.color = "#192232";
    document.querySelector(".toggleTheme").style.color = "white";
    document.querySelector(".toggleTheme").style.textShadow = "2px 2px black";
  }
});
