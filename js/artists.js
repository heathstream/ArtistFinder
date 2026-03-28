"use strict";
import { musicGroupService } from "./api-service.js";

const _service = new musicGroupService("https://music.api.public.seido.se/api");
let musicGroups;
let filter = "";
let seeded = true;

// Paginatorns värden
const pageSize = 10;
let pageCount;
let currentPage = 0;

// Sidans element:
const loadingOverlay = document.querySelector(".loadingOverlay");
const artistsTable = document.querySelector(".artistsTable");
const tableBottom = document.querySelector("#tableBottom");
const searchBox = document.querySelector("#searchBox");
const paginatorText = document.querySelector("#paginatorText");
document.querySelector("#buttonPrev").addEventListener("click", clickPrevHandler);
document.querySelector("#buttonNext").addEventListener("click", clickNextHandler);
document.querySelector("#buttonSearch").addEventListener("click", clickSearchHandler);
document.querySelector("#seededCheckbox").addEventListener("change", (e) => checkSeededHandler(e));

// Populate the table
(async () => {
    await loadMusicGroups();
    await fillList();
})();

async function loadMusicGroups() {
    musicGroups = await _service.readMusicGroupsAsync(currentPage, pageSize, filter, seeded);
    pageCount = musicGroups.pageCount;
}

// Funktion som fyller listan med musikgrupper
async function fillList() {
    clearList();

    paginatorText.innerText = musicGroups.pageItems.length > 0
    ? `Showing ${currentPage * pageSize + 1}-${Math.min(currentPage * pageSize + pageSize, musicGroups.dbItemsCount)} of ${musicGroups.dbItemsCount} groups`
    : `No results found`;

    for (const musicGroup of musicGroups.pageItems) {
        let tableRow = addTableRow();
        tableRow.appendChild(addTableCell("artistName", musicGroup.name));
        tableRow.appendChild(addTableCell("artistGenre", musicGroup.strGenre));
        tableRow.appendChild(addTableCell("artistYear", musicGroup.establishedYear));
        tableRow.appendChild(addTableCell("artistAlbums", musicGroup.albums ? musicGroup.albums.length : "0"));
        let artistDetails = tableRow.appendChild(document.createElement("div"));
        artistDetails.classList.add("tableCell", "artistDetails");
        let infoButton = artistDetails.appendChild(document.createElement("button"));
        infoButton.classList.add("button", "detailsButton", "rounded2");
        infoButton.innerText = "Info";
        infoButton.addEventListener("click", () => clickDetailsHandler(musicGroup.musicGroupId));
    }

    toggleLoader();

    function addTableRow() {
        let tableRow = document.createElement("div");
        tableRow.classList.add("artistsTableRow", "tableRow");
        tableBottom.before(tableRow);
        return tableRow;
    }

    function addTableCell(className = null, innerText = null) {
        let cell = document.createElement("div");
        cell.classList.add("tableCell", className);
        if (filter) {
            cell.innerHTML = highlightSearchText(innerText);
        }
        else {
            cell.innerText = innerText;
        }
        return cell;
    }
}

// Funktion som rensar listan
function clearList() {
    while (artistsTable.querySelector(".artistsTableRow")) {
        artistsTable.removeChild(artistsTable.querySelector(".artistsTableRow"));
    }
}

// Event handlers
function checkSeededHandler(e) {
    console.log("Checkbox handler running");
    if (e.target.checked) {
        seeded = true;
    }
    else {
        seeded = false;
    }
}

function clickDetailsHandler(musicGroupId) {
    location.href = `details.html?id=${musicGroupId}`;
}

async function clickNextHandler() {
    if (currentPage < pageCount - 1) {
        toggleLoader();
        currentPage++;
        await loadMusicGroups();
        fillList();
    }
}

async function clickPrevHandler() {
    if (currentPage > 0) {
        toggleLoader();
        currentPage--;
        await loadMusicGroups();
        fillList();
    }
}

async function clickSearchHandler() {
    toggleLoader();
    filter = searchBox.value.trim();
    currentPage = 0;
    await loadMusicGroups();
    fillList();
}

function toggleLoader() {
    loadingOverlay.classList.toggle("hidden");
}

function highlightSearchText(text) {
    if (!filter) return text;
    const str = new String(text ?? "");
    const regex = new RegExp(`(${filter})`, "gi");
    return str.replace(regex, `<span class="highlightSearch">$1</span>`);
}