"use strict";
import { musicGroupService } from "./api-service.js";

const _service = new musicGroupService("https://music.api.public.seido.se/api");
const musicGenres = ["Rock", "Metal", "Alternative", "Jazz", "Classical", "Kids", "Country", "Folk", "R&B", "Hiphop"];

// Sidans element:
const form = document.querySelector("form");
const submitStatusText = document.querySelector("#submitStatusText");
const nameInput = document.querySelector("#name");
const genreInput = document.querySelector("#genre");
const yearInput = document.querySelector("#year");
const nameValidityText = document.querySelector("#nameInvalidText");
const genreValidityText = document.querySelector("#genreInvalidText");
const yearValidityText = document.querySelector("#yearInvalidText");

// Event handlers:
nameInput.addEventListener("invalid", (e) => inputInvalidHandler(e, "Must be at least 3 characters.", nameValidityText));
genreInput.addEventListener("invalid", (e) => inputInvalidHandler(e, "Please select a genre.", genreValidityText));
yearInput.addEventListener("invalid", (e) => inputInvalidHandler(e, "Please select a year.", yearValidityText));
genreInput.addEventListener("change", () => setValidText(genreValidityText));
yearInput.addEventListener("change", () => setValidText(yearValidityText));
form.addEventListener("submit", e => submitHandler(e))
nameInput.addEventListener("input", () => validateNameInput(nameInput.value));

async function submitHandler(e) {
    if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
    }
    else {
        e.preventDefault();
        const name = new String(nameInput.value);
        const genre = new String(genreInput.value);
        const year = new Number(yearInput.value);

        // Extra felhantering innan vi skickar till API:t, utifall användaren fipplat med formen på något sätt
        if (name.length < 3) {
            nameInput.dispatchEvent(new Event("invalid"));
            return;
        }
        // else if (!musicGenres.includes(genre)) {
        //     genreInput.dispatchEvent(new Event("invalid"));
        //     return;
        // }

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
        } else {
            submitStatusText.classList.add("invalid");
            submitStatusText.innerText = "There was an error submitting the form. \nPlease refresh the page."
        }

        form.reset();
        clearValidityText(nameValidityText);
        clearValidityText(genreValidityText);
        clearValidityText(yearValidityText);
    }
}

function inputInvalidHandler(e, errorText, errorTextContainer) {
    e.preventDefault();
    errorTextContainer.innerText = errorText;
    setInvalidText(errorTextContainer);
}

function validateNameInput(name) {
    const trimmed = name.trim();
    const matchesRegex = /^[a-öA-Ö0-9 ]+$/.test(trimmed);
    if (!(trimmed.length > 2 && matchesRegex)) {
        nameInput.setCustomValidity("invalid");
        nameValidityText.innerText = "Must be at least 3 characters.";
        setInvalidText(nameValidityText);
    } else {
        nameInput.setCustomValidity("");
        setValidText(nameValidityText);
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

function clearValidityText(element) {
    element.innerText = "";
    element.classList.remove("invalid");
    element.classList.remove("valid");
}

function populateGenreOptions() {
    for (const genre of musicGenres) {
        const option = genreInput.appendChild(document.createElement("option"));
        option.value = genre;
        option.innerText = genre;
    }
}

function populateYearOptions() {
    for (let i = new Date().getFullYear(); i >= 1900; i--) {
        const option = yearInput.appendChild(document.createElement("option"));
        option.value = i;
        option.innerText = i.toString();
    }
}

populateGenreOptions();
populateYearOptions();