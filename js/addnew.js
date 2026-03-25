"use strict";
import { musicGroupService } from "./api-service.js";

const _service = new musicGroupService("https://music.api.public.seido.se/api");

// Sidans element:
const form = document.querySelector("form");

// Event handlers:
form.addEventListener("submit", e => submitHandler(e))

async function submitHandler(e) {
    e.preventDefault();

    if (!form.checkValidity()) {
        e.stopPropagation();
    }
    else {
        const name = document.querySelector("input[id='name']").value;
        const genre = document.querySelector("input[id='genre']").value;
        const year = document.querySelector("input[id='year']").value;
        
        const newMusicGroup = {
            "musicGroupId": null,
            "name": name,
            "strGenre": genre,
            "albums": [],
            "artists": [],
            "establishedYear": year,
        }

        let submittedGroup = _service.createMusicGroupAsync(newMusicGroup);
        if (submittedGroup) {
            console.log(`Successfully submitted the group "${name}"!`);
        }
        else {
            console.log("Could not submit group. :(");
        }
    }
}