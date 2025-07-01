"use strict";

(function () {

    const modal = document.getElementById("subscribe-modal");
    const form = modal.querySelector("form");

    const subscribeButton = document.querySelectorAll(".subscribe-link");
    const cancelButton = document.getElementById("cancel");

    const emailInput = document.getElementById("email");
    const confirmInput = document.getElementById("confirm");

    const emailError = document.getElementById("email-error");
    const confirmError = document.getElementById("confirm-error");

    subscribeButton.forEach((button) => {
        button.addEventListener("click", function () {
            modal.showModal();
        })
    })

    cancelButton.addEventListener("click", function () {
        modal.close();

        emailInput.value = "";
        confirmInput.value = "";
        emailError.innerText = "";
        confirmError.innerText = "";
    })

    form.addEventListener("submit", function (event) {
        const email = emailInput.value.trim();
        const confirm = confirmInput.value.trim();

        let isValid = true;
        emailError.innerText = "";
        confirmError.innerText = "";

        if (email === "" ) {
            emailError.innerText = "This field is required";
            isValid = false;
        }

        else if (!email.includes("@")) {
            emailError.innerText = "This field be a valid email address including a @";
            isValid = false;
        }

        if (email !== "" && email.includes("@")) {
         if (confirm === "") {
            confirmError.innerText = "This field is required.";
            isValid = false;
            } else if (email !== confirm) {
            confirmError.innerText = "This field must match the provided email address.";
            isValid = false;
            }
        }

        if (!isValid) {
            event.preventDefault();
        }
    })
})();