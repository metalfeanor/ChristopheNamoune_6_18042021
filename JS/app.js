const url = `/public/img/portrait/mini/`;
const urlGithub = `/ChristopheNamoune_6_18042021`;
//const urlGithub = ``;
let activeTags = [];
let dataBase = undefined;

fetch("/Json.json")
  .then((res) => res.json())
  .then((data) => {
    creatorList = data.photographers;
    allDataList = [data];
    dataBase = data;

    if (window.location.pathname === `${urlGithub}/index.html` || window.location.pathname === `${urlGithub}/`) {
      displayAllCreatorItems();
    }

    if (window.location.pathname === `${urlGithub}/photographer-page.html`) {
      const id = parseInt(window.location.search.replace("?id=", ""));
      //console.log(id, dataBase);

      const dataCreator = dataBase.photographers.filter((photographer) => photographer.id === id)[0];
      const dataCreatorGallery = dataBase.media.filter((media) => media.photographerId === id);
      //console.log(dataCreatorGallery);

      displayCreatorCard(dataCreator);

      /* MODAL */
      //DOM Element
      const overlay = document.getElementById("overlay");
      const modalBody = document.getElementById("form-dialog");
      const modalBtn = document.getElementById("close-btn");
      const contactBtn = document.getElementById("ph-contact");

      contactBtn.addEventListener("click", openModal);
      modalBtn.addEventListener("click", closeModal);

      function openModal() {
        modalBody.style.display = "block";
        overlay.style.display = "flex";
      }

      function closeModal() {
        modalBody.style.display = "none";
        overlay.style.display = "none";
      }

      /* SORT ELEMENT FOR PHOTOGRAPHER WORK */
      $dropdownMenu = document.querySelector(".sort-list");
      $dropdownLink = document.querySelector(".sort-btn");

      function toggleNavbar() {
        if (!$dropdownMenu.getAttribute("style") || $dropdownMenu.getAttribute("style") === "display: none;") {
          $dropdownMenu.style.display = "block";
          $dropdownLink.setAttribute("aria-expanded", "true");
          $dropdownLink.style.display = "none";
        } else {
          $dropdownMenu.style.display = "none";
          $dropdownLink.setAttribute("aria-expanded", "false");
        }
      }

      $dropdownLink.addEventListener("click", function (e) {
        e.preventDefault();
        toggleNavbar();
      });

      displayCreatorGallery(dataCreatorGallery);

      /* SORT LI ELEMENT FUNCTION FOR PHOTOGRAPHER WORK */
      $popularitySortLi = document.getElementById("sort-1");
      $dateSortLi = document.getElementById("sort-2");
      $titleSortLI = document.getElementById("sort-3");

      $popularitySortLi.addEventListener("click", (e) => {
        e.preventDefault();
        //hide btn that display dropdown menu
        hideSortList();
        //delete all gallery before sorting it
        deleteGallery();
        //sort data by likes descending order
        dataCreatorGallery.sort((a, b) => b.likes - a.likes);
        displayCreatorGallery(dataCreatorGallery);
      });
      $dateSortLi.addEventListener("click", (e) => {
        e.preventDefault();
        //hide btn that display dropdown menu
        hideSortList();
        //delete all gallery before sorting it
        deleteGallery();
        //sort data by date recent to old
        dataCreatorGallery.sort((a, b) => new Date(b.date) - new Date(a.date));
        displayCreatorGallery(dataCreatorGallery);
      });
      $titleSortLI.addEventListener("click", (e) => {
        e.preventDefault();
        //hide btn that display dropdown menu
        hideSortList();
        //delete all gallery before sorting it
        deleteGallery();
        //sort data by title
        dataCreatorGallery.sort((a, b) => a.title.localeCompare(b.title));
        displayCreatorGallery(dataCreatorGallery);
      });
    }
  })
  .catch((err) => console.log(err));

/* INDEX.HTML */

function displayAllCreatorItems() {
  document.querySelector(".creators").innerHTML = "";
  dataBase.photographers
    .filter((photographer) => (activeTags.length > 0 ? photographer.tags.some((tag) => activeTags.includes(tag)) : true))
    .map((photographer) => {
      document.querySelector(".creators").innerHTML += `<div class="card">
    <a href="photographer-page.html?id=${photographer.id}" class="card-img">
      <img src="${urlGithub}${url}${photographer.portrait}" alt="">
            <h2 class="card-img-title">${photographer.name}</h2>
        </a>
        <div class="card-body">
            <p class="card-body-city">${photographer.city}, ${photographer.country}</p>
            <p class="card-body-tagline">${photographer.tagline}</p>
            <p class="card-body-price">${photographer.price}€/jour</p>
        </div>
        <ul class="card-tags">${photographer.tags
          .map(
            (tag) => `<li class="tag"><button onclick="toggleButtonFilterByTag(event)"class="${activeTags.includes(tag) ? "selected" : ""}"
              >${tag}</button
            ></li>`
          )
          .join("")}
          </ul>
</div>`;
    });
}

function toggleButtonFilterByTag(e) {
  const tag = e.target.innerText.toLowerCase();
  const buttonHeaderToSelect = document.querySelectorAll("header button");

  if (e.target.classList.contains("selected") === false) {
    activeTags = [...activeTags, tag];
    e.target.classList.add("selected");

    for (let i = 0; i < buttonHeaderToSelect.length; i++) {
      if (buttonHeaderToSelect[i].innerText.toLowerCase() === tag) {
        buttonHeaderToSelect[i].classList.add("selected");
      }
    }
  } else {
    e.target.classList.remove("selected");
    e.target.parentElement.classList.remove("selected");
    const buttonHeaderSelected = document.querySelectorAll("header button.selected");

    for (let i = 0; i < buttonHeaderSelected.length; i++) {
      if (buttonHeaderSelected[i].innerText.toLowerCase() === tag) {
        buttonHeaderSelected[i].classList.remove("selected");
      }
    }
    activeTags = [...activeTags].filter((elt) => elt !== tag);
  }
  displayAllCreatorItems();
}

/* CONTACT FORM */
function validate(e) {
  e.preventDefault();
  //create data Object to receive all entries from form and permit to send data with easy way to back end
  const form = document.getElementById("contact-form");
  const formData = new FormData(form);
  const entries = formData.entries();
  const data = Object.fromEntries(entries);
  console.log(data);
  form.reset();
}

/* PHOTOGRAPHER-PAGE.HTML */

function displayCreatorCard(data) {
  document.querySelector(".photographer-page").innerHTML += `<header class="ph-header" aria-label="photographer information">
        <div class="ph-infos">
          <h1 class="ph-name" id="ph-title">${data.name}</h1>
          <span class="ph-city" id="ph-city">${data.city}, ${data.country}</span>
          <span class="ph-tagline" id="ph-tagline">${data.tagline}</span>
          <ul class="card-tags">${data.tags.map((tag) => `<li class="tag"><button>${tag}</button></li>`).join("")}
          </ul>
        </div>
        <button type="button" class="ph-contact" id="ph-contact" title="Contact Me">Contactez-moi</button>
        <img src="${urlGithub}${url}${data.portrait}" alt="" id="ph-portrait" />
      </header>
      <section class="ph-works" aria-label="photographer works">
        <div class="works-sort">
          <span id="sort-label" class="sort-label">Trier par</span>
          <div class="sort-wrapper">
            <button aria-haspopup="listbox" aria-expanded="false" aria-labelledby="sort-label sort-btn" id="sort-btn" class="sort-btn">
              Popularité
              <span class="fas fa-chevron-down sort-arrow"></span>
            </button>
            <ul id="sort-list" tabindex="-1" role="listbox" aria-labelledby="sort-label" class="sort-list hidden">
              <li id="sort-1" role="option" tabindex="-1">Popularité<span class="fas fa-chevron-up sort-arrow"></span></li>
              <li id="sort-2" role="option" tabindex="-1">Date</li>
              <li id="sort-3" role="option" tabindex="-1">Titre</li>
            </ul>
          </div>
        </div>
        <div class="works-elts" id="works-elts"></div>
      </section>`;

  const photographerName = document.getElementById("ph-form-name");
  photographerName.innerText += `${data.name}`;
}

function deleteGallery() {
  document.querySelector(".works-elts").innerHTML = "";
}

class ImageMedia {
  constructor(data) {
    this.date = data.date;
    this.id = data.id;
    this.src = data.image;
    this.likes = data.likes;
    this.price = data.price;
    this.title = data.title;
  }

  display() {
    return `<div class="work-elt">
    <a href="#" title="${this.title}, closeup view">
      <img src="${urlGithub}/public/data/image/mini/${this.src}" alt="${this.title}, closeup view" role="button">
    </a>
    <div class="work-elt-infos">
      <h2 class="work-title">${this.title}</h2>
      <span class="work-price">${this.price} €</span>
      <span class="work-like" id="${this.id}">${this.likes}<span class="fas fa-heart" aria-label="likes" role="button" tabindex="0"></span></span>
    </div>`;
  }
}

class VideoMedia {
  constructor(data) {
    this.date = data.date;
    this.id = data.id;
    this.likes = data.likes;
    this.price = data.price;
    this.title = data.title;
    this.src = data.video;
  }

  display() {
    return `<div class="work-elt">
    <a href="#" title="${this.title}, closeup view">
      <video class="video-elt" role="button">${this.title}, closeup view
        <source src="${urlGithub}/public/data/video/${this.src}"></video>
    </a>
    <div class="work-elt-infos">
      <h2 class="work-title">${this.title}</h2>
      <span class="work-price">${this.price} €</span>
      <span class="work-like" id="${this.id}">${this.likes}<span class="fas fa-heart" aria-label="likes" role="button" tabindex="0"></span></span>
    </div>
    </div>`;
  }
}

function factoryForMedia(type, data) {
  switch (type) {
    case "image":
      return new ImageMedia(data);
    case "video":
      return new VideoMedia(data);
  }
}

function displayCreatorGallery(data) {
  data.map((elt) => {
    const type = elt.video ? "video" : "image";
    const media = factoryForMedia(type, elt);
    document.querySelector(".works-elts").innerHTML += media.display();
  });
}

function hideSortList() {
  $dropdownMenu.style.display = "none";
  $dropdownLink.style.display = "block";
  $dropdownLink.setAttribute("aria-expanded", "false");
}
