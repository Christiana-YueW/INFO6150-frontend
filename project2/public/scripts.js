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

    const menuButton = document.querySelector(".menu-button");
    const mainNav = document.querySelector(".main-nav");

    if (menuButton && mainNav) {
        menuButton.addEventListener("click", (e) => {
            e.preventDefault();

            const isExpanded = menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute("aria-expanded", !isExpanded);

            if (isExpanded) {
                mainNav.classList.remove("show");
            } else {
                mainNav.classList.add("show");
            }
        })

        const navigationLinks = mainNav.querySelectorAll('a');
        navigationLinks.forEach(link => {
            link.addEventListener('click', function() {
                const mobileBreakpoint = 704; // 44rem in pixels
                if (window.innerWidth < mobileBreakpoint && mainNav.classList.contains('show')) {
                    mainNav.classList.remove('show');
                    menuButton.setAttribute('aria-expanded', 'false');
                }
            });
        });

        window.addEventListener('resize', function() {
            const mobileBreakpoint = 704; // 44rem in pixels
            if (window.innerWidth >= mobileBreakpoint) {
                mainNav.classList.remove('show');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });

    }

    subscribeButton.forEach((button) => {
        button.addEventListener("click", function () {
            modal.showModal();
            emailInput.focus();
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
            emailError.innerText = "This field must be a valid email address including a @";
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
    });
        modal.addEventListener('cancel', function() {
            emailInput.value = "";
            confirmInput.value = "";
            emailError.innerText = "";
            confirmError.innerText = "";
    })
})();