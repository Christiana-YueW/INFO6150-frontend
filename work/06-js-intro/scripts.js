"use strict";

(function () {

    const dropdownButton = document.querySelector(".dropdown-button");
    const mainNav = document.querySelector(".main-nav");

    if (dropdownButton && mainNav) {
        dropdownButton.addEventListener("click", function (event) {
            mainNav.classList.toggle("active");

            const isExpanded = dropdownButton.getAttribute("aria-expanded") === "true";
            dropdownButton.setAttribute("aria-expanded", String(!isExpanded));
        });
    }
})();