"use strict";
import { musicGroupService } from "./api-service.js";

const _service = new musicGroupService("https://music.api.public.seido.se/api");
let url = new URL(window.location);
let musicGroupId = url.searchParams.get("id");
let musicGroup;

// Sidans element:
const artistImage = document.querySelector("#artistImage");
const nameDiv = document.querySelector("#name");
const genreDiv = document.querySelector("#genre");
const yearDiv = document.querySelector("#year");
const membersTable = document.querySelector("#membersTable");
const albumsTable = document.querySelector("#albumsTable");
const membersTableBottom = document.querySelector("#membersTableBottom");
const albumsTableBottom = document.querySelector("#albumsTableBottom");
const loadingOverlay = document.querySelector(".loadingOverlay");

(async () => {
    toggleLoader();
    musicGroup = await _service.readMusicGroupAsync(musicGroupId);
    console.log(musicGroup);

    nameDiv.innerText = musicGroup.item.name;
    genreDiv.innerText = musicGroup.item.strGenre;
    yearDiv.innerText = musicGroup.item.establishedYear;
    artistImage.src = `https://picsum.photos/seed/${musicGroupId}/300/300`;

    fillLists();
    toggleLoader();
})();

function fillLists() {
    clearLists();

    for (const member of musicGroup.item.artists) {
        const memberRow = document.createElement("div");
        membersTableBottom.before(memberRow);
        memberRow.classList.add("memberRow", "tableRow");
        memberRow.appendChild(addTableCell(`${member.firstName} ${member.lastName}`));

        let memberAge = member.birthDay 
        ? Math.round((Date.now() - new Date(Date.parse(member.birthDay)).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        : "N/A";
        memberRow.appendChild(addTableCell(`${memberAge}`));
    }

    for (const album of musicGroup.item.albums) {
        const albumRow = document.createElement("div");
        albumsTableBottom.before(albumRow);
        albumRow.classList.add("albumRow", "tableRow");
        albumRow.appendChild(addTableCell(`${album.name}`));
        albumRow.appendChild(addTableCell(`${album.releaseYear}`));
    }

    function addTableCell(innerText = null) {
        let cell = document.createElement("div");
        cell.classList.add("tableCell");
        cell.innerText = innerText;
        return cell;
    }
}

function clearLists() {
    while (membersTable.querySelector(".tableRow")) {
        membersTable.removeChild(membersTable.querySelector(".tableRow"));
    }
    while (albumsTable.querySelector(".tableRow")) {
        albumsTable.removeChild(albumsTable.querySelector(".tableRow"));
    }
}

function toggleLoader() {
    loadingOverlay.classList.toggle("hidden");
}