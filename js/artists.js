"use strict";
import { musicGroupService } from "./api-service.js";

const _service = new musicGroupService("https://music.api.public.seido.se/api");
let musicGroups;

const pageSize = 10;
let pageCount;
let currentPage = 0;

// Sidans element:
let artistsTable = document.querySelector(".artistsTable");
let tableBottom = document.querySelector("#tableBottom");
let searchBox = document.querySelector("#searchBox");
document.querySelector("#buttonPrev").addEventListener("click", clickHandlerPrev);
document.querySelector("#buttonNext").addEventListener("click", clickHandlerNext);
document.querySelector("#buttonSearch").addEventListener("click", clickHandlerSearch);

// Populate the table
(async () => {
    await loadMusicGroups();
    await fillList();
    console.log("test");

})();

async function loadMusicGroups(filter = null) {
    musicGroups = await _service.readMusicGroupsAsync(currentPage, pageSize, filter);
    pageCount = musicGroups.pageCount;
}

// Funktion som fyller listan med musikgrupper
async function fillList() {
    clearList();

    for (const musicGroup of musicGroups.pageItems) {
        let tableRow = addTableRow();
        tableRow.appendChild(addTableCell("artistName", musicGroup.name));
        tableRow.appendChild(addTableCell("artistGenre", convertGenre(musicGroup.genre)));
        tableRow.appendChild(addTableCell("artistYear", musicGroup.establishedYear));
        tableRow.appendChild(addTableCell("artistAlbums", musicGroup.albums ? musicGroup.albums.length : "0"));
        let artistDetails = tableRow.appendChild(addTableCell("artistDetails"));
        let infoButton = artistDetails.appendChild(document.createElement("button"));
        infoButton.classList.add("button", "detailsButton", "rounded2");
        infoButton.innerText = "Info";
        infoButton.addEventListener("click", () => clickHandlerDetails(musicGroup.musicGroupId));
    }

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
        artistsTable.removeChild(artistsTable.firstChild);
    }
}

// Event handlers
function clickHandlerDetails(musicGroupId) {
    location.href = `details.html?id=${musicGroupId}`;
}

async function clickHandlerNext() {
    if (currentPage < pageCount - 1) {
        currentPage++;
        await loadMusicGroups(searchBox.value || null);
        fillList();
    }
}

async function clickHandlerPrev() {
    if (currentPage > 0) {
        currentPage--;
        await loadMusicGroups(searchBox.value || null);
        fillList();
    }
}

async function clickHandlerSearch() {
    await loadMusicGroups(searchBox.value || null);
    fillList();
}

// Funktion som konverterar genre-numren till genrer
function convertGenre(number) {
        switch (number) {
            case 0:
                return "Rock";
            case 1:
                return "Blues";
            case 2:
                return "Country";
            case 3:
                return "Jazz";
            case 4:
                return "Metal";
            case 5:
                return "Alternative";
            case 6:
                return "Classical";
            case 7:
                return "EDM";
            default:
                return "Kids";
        }
    }