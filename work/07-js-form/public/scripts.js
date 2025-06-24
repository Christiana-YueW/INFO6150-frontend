"use strict";

(function () {

    const form = document.querySelector(".register-form");

    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const confirmInput = document.querySelector("#confirm");
    const tierInput = document.querySelector("#tier");

    const nameError = document.querySelector("#name-error");
    const emailError = document.querySelector("#email-error");
    const confirmError = document.querySelector("#confirm-error");
    const tierError = document.querySelector("#tier-error");

    nameInput.addEventListener("input", (e) => {
        if (nameInput.value.trim() === "") {
            nameError.innerText = "Name is required";
        }
        else {
            nameError.innerText = "";
        }
    })

    confirmInput.addEventListener("input", (e) => {
        if (confirmInput.value && confirmInput.value !== emailInput.value) {
            confirmError.innerText = "Emails do not match";
        } else {
            confirmError.innerText = "";
        }
    })

    form.addEventListener("submit", (e) => {
        let hasError = false;

        nameError.innerText = "";
        emailError.innerText = "";
        confirmError.innerText = "";
        tierError.innerText = "";

        if (nameInput.value.trim() === "") {
            nameError.innerText = "Name is required";
            hasError = true;
        } else {
            emailError.innerText = "";
        }

        if (emailInput.value.trim() === "") {
            emailError.innerText = "Email is required";
            hasError = true;
        } else {
            emailError.innerText = "";
        }


        if (confirmInput.value.trim() !== emailInput.value.trim()) {
            confirmError.innerText = "Emails do not match";
            hasError = true;
        } else {
            confirmError.innerText = "";
        }

        if (tierInput.value === "") {
            tierError.innerText = "Please select a tier.";
            hasError = true;
        }

        if (hasError) {
            e.preventDefault();
        }
    })
})()