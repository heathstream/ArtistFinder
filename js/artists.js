"use strict";
import { musicGroupService } from "./api-service.js";

const _service = new musicGroupService("https://music.api.public.seido.se/api");
let musicGroups;
let filter = "";

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
document.querySelector("#buttonPrev").addEventListener("click", clickHandlerPrev);
document.querySelector("#buttonNext").addEventListener("click", clickHandlerNext);
document.querySelector("#buttonSearch").addEventListener("click", clickHandlerSearch);

// Populate the table
(async () => {
    await loadMusicGroups();
    await fillList();
    console.log("test");
})();

async function loadMusicGroups() {
    musicGroups = await _service.readMusicGroupsAsync(currentPage, pageSize, filter);
    pageCount = musicGroups.pageCount;
}

// Funktion som fyller listan med musikgrupper
async function fillList() {
    clearList();

    paginatorText.innerText = musicGroups.pageItems.length > 0
    ? `${currentPage * pageSize + 1}-${Math.min(currentPage * pageSize + pageSize, musicGroups.dbItemsCount)} of ${musicGroups.dbItemsCount} groups`
    : `No results found`;

    for (const musicGroup of musicGroups.pageItems) {
        let tableRow = addTableRow();
        tableRow.appendChild(addTableCell("artistName", musicGroup.name));
        tableRow.appendChild(addTableCell("artistGenre", musicGroup.strGenre));
        tableRow.appendChild(addTableCell("artistYear", musicGroup.establishedYear));
        tableRow.appendChild(addTableCell("artistAlbums", musicGroup.albums ? musicGroup.albums.length : "0"));
        let artistDetails = tableRow.appendChild(document.createElement("div"));
        artistDetails.classList.add("artistDetails");
        let infoButton = artistDetails.appendChild(document.createElement("button"));
        infoButton.classList.add("button", "detailsButton", "rounded2");
        infoButton.innerText = "Info";
        infoButton.addEventListener("click", () => clickHandlerDetails(musicGroup.musicGroupId));
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
        cell.innerText = innerText;
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
function clickHandlerDetails(musicGroupId) {
    location.href = `details.html?id=${musicGroupId}`;
}

async function clickHandlerNext() {
    if (currentPage < pageCount - 1) {
        toggleLoader();
        currentPage++;
        await loadMusicGroups();
        fillList();
    }
}

async function clickHandlerPrev() {
    if (currentPage > 0) {
        toggleLoader();
        currentPage--;
        await loadMusicGroups();
        fillList();
    }
}

async function clickHandlerSearch() {
    toggleLoader();
    filter = searchBox.value;
    currentPage = 0;
    await loadMusicGroups();
    fillList();
}

function toggleLoader() {
    loadingOverlay.classList.toggle("hidden");
}

