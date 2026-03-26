"use strict";
import { musicGroupService } from "./api-service.js";

const _service = new musicGroupService("https://music.api.public.seido.se/api");

// Sidans element:
const form = document.querySelector("form");
const submitStatusText = document.querySelector("#submitStatusText");
const nameInput = document.querySelector("#name");
const genreInput = document.querySelector("#genre");
const yearInput = document.querySelector("#year");
const nameInvalidText = document.querySelector("#nameInvalidText");
const genreInvalidText = document.querySelector("#genreInvalidText");
const yearInvalidText = document.querySelector("#yearInvalidText");

// Event handlers:
form.addEventListener("submit", e => submitHandler(e))
nameInput.addEventListener("invalid", (e) => {
    e.preventDefault();
    nameInvalidText.innerText = "Must be at least 3 characters.";
});
nameInput.addEventListener("input", () => {
    if (validateName(nameInput.value)) {
        nameInput.setCustomValidity("");
        setValidText(nameInvalidText);
    }
    else {
        nameInput.setCustomValidity("invalid");
        nameInvalidText.innerText = "Must be at least 3 characters.";
        setInvalidText(nameInvalidText);
    }
});
genreInput.addEventListener("invalid", (e) => {
    e.preventDefault();
    genreInvalidText.innerText = "Please select a genre.";
    setInvalidText(genreInvalidText);
});
genreInput.addEventListener("change", () => {
    setValidText(genreInvalidText);
});
yearInput.addEventListener("invalid", (e) => {
    e.preventDefault();
    yearInvalidText.innerText = "Please select a year.";
    setInvalidText(yearInvalidText);
});
yearInput.addEventListener("change", () => {
    setValidText(yearInvalidText);
});

async function submitHandler(e) {
    console.log("genre value:", document.querySelector("#genre").value);
    console.log("genre validity:", document.querySelector("#genre").checkValidity());
    if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
    }
    else {
        e.preventDefault();
        const name = new String(document.querySelector("input[id='name']").value);
        const genre = new String(document.querySelector("select[id='genre']").value);
        const year = new Number(document.querySelector("select[id='year']").value);

        
        
        const newMusicGroup = {
            "musicGroupId": null,
            "name": name,
            "strGenre": genre,
            "albums": [],
            "artists": [],
            "establishedYear": year,
        }

        let submittedGroup = await _service.createMusicGroupAsync(newMusicGroup);
        if (submittedGroup) {
            submitStatusText.classList.add("valid");
            submitStatusText.innerText = "Successfully submitted!"
        }
        else {
            submitStatusText.classList.add("invalid");
            submitStatusText.innerText = "Failed to submit."
        }

        form.reset();
        clearInvalidText(nameInvalidText);
        clearInvalidText(genreInvalidText);
        clearInvalidText(yearInvalidText);
    }
}

function setValidText(element) {
    element.innerText = "✓";
    element.classList.remove("invalid");
    element.classList.add("valid");
}

function setInvalidText(element) {
    element.classList.add("invalid");
    element.classList.remove("valid");
}

function clearInvalidText(element) {
    element.innerText = "";
    element.classList.remove("invalid");
    element.classList.remove("valid");
}

function validateName(text) {
    const trimmed = text.trim();
    const matchesRegex = /^[a-zA-Z0-9 ]+$/.test(trimmed);
    return trimmed.length > 2 && matchesRegex;
}

function populateGenreOptions() {
    
    const select = document.querySelector("#genre");
    const genres = [
        "Rock",
        "Metal",
        "Alternative",
        "Jazz",
        "Classical",
        "Kids",
        "Country",
        "Folk",
        "R&B",
        "Hiphop"
    ]
    
    for (const genre of genres) {
        const option = select.appendChild(document.createElement("option"));
        option.value = genre;
        option.innerText = genre;
    }
}

function populateYearOptions() {

    const select = document.querySelector("#year");
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= 1900; i--) {
        const option = select.appendChild(document.createElement("option"));
        option.value = i;
        option.innerText = i.toString();
    }
}

populateGenreOptions();
populateYearOptions();