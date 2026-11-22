
// ==========================================
// SADDIAH PORTFOLIO - MAIN JAVASCRIPT
// ==========================================


// ==========================================
// 1. SCROLL REVEAL ANIMATION
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.1
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });

} else {

    revealElements.forEach((element) => {
        element.classList.add("visible");
    });

}


// ==========================================
// 2. PORTFOLIO PROJECT POPUP
// ==========================================

const projects = {

    cafe: {
        title: "Urban Loft Café",
        image: "cafe.jpg",
        description:
            "Urban Loft Café is a 3D animation project " +
            "created using Blender. The project explores " +
            "3D modelling, lighting, texturing and animation."
    },

    ar: {
        title: "Legenda Buaya Sungai Sarawak",
        image: "ar.jpg",
        description:
            "An Augmented Reality storytelling project " +
            "inspired by Sarawak folklore. It combines " +
            "traditional storytelling with interactive " +
            "3D pop-up scenes."
    },

    aura: {
        title: "Adaptive:Mind",
        image: "aura.jpg",
        description:
            "Adaptive:Mind is a system analysis and design " +
            "project focused on helping students improve " +
            "productivity, maintain focus and manage " +
            "distractions through a digital application."
    },

    web: {
        title: "Personal Portfolio Website",
        image: "web.jpg",
        description:
            "A responsive personal portfolio developed " +
            "using HTML, CSS and JavaScript. It includes " +
            "multimedia content, animation and " +
            "interactive features."
    }

};


const projectModal = document.getElementById("projectModal");
const closeModal = document.getElementById("closeModal");

if (projectModal && closeModal) {

    let previousFocus = null;

    // Open project popup
    document.querySelectorAll(".project-btn").forEach((button) => {

        button.addEventListener("click", () => {

            const key = button.dataset.project;
            const project = projects[key];

            if (!project) return;

            previousFocus = document.activeElement;

            const modalTitle =
                document.getElementById("modalTitle");

            const modalImage =
                document.getElementById("modalImage");

            const modalDescription =
                document.getElementById("modalDescription");

            if (!modalTitle || !modalImage || !modalDescription) {
                return;
            }

            modalTitle.textContent = project.title;
            modalImage.src = project.image;
            modalImage.alt = project.title;
            modalDescription.textContent = project.description;

            projectModal.classList.add("show");
            projectModal.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";

            closeModal.focus();

        });

    });


    // Close project popup
    function hideProjectModal() {

        projectModal.classList.remove("show");
        projectModal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (previousFocus) {
            previousFocus.focus();
        }

    }


    // Close button
    closeModal.addEventListener("click", hideProjectModal);


    // Click outside popup
    projectModal.addEventListener("click", (event) => {

        if (event.target === projectModal) {
            hideProjectModal();
        }

    });


    // Keyboard controls
    document.addEventListener("keydown", (event) => {

        if (!projectModal.classList.contains("show")) {
            return;
        }

        if (event.key === "Escape") {
            hideProjectModal();
        }

        if (event.key === "Tab") {
            event.preventDefault();
            closeModal.focus();
        }

    });

}


// ==========================================
// 3. PMFKI PHOTO GALLERY LIGHTBOX
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const photos =
        document.querySelectorAll(".pmfki-gallery-img");

    const lightbox =
        document.getElementById("pmfki-lightbox");

    const lightboxImage =
        document.getElementById("pmfki-lightbox-image");

    const closeButton =
        document.getElementById("pmfki-close");

    // Only run on pages with PMFKI gallery
    if (!lightbox || !lightboxImage || !closeButton) {
        return;
    }

    let previousPhotoFocus = null;


    // Open selected photo
    function openPhoto(photo) {

        previousPhotoFocus = document.activeElement;

        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        closeButton.focus();

    }


    // Close photo viewer
    function closeLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        lightboxImage.removeAttribute("src");

        document.body.style.overflow = "";

        if (previousPhotoFocus &&
            typeof previousPhotoFocus.focus === "function") {
            previousPhotoFocus.focus();
        }

    }


    // Make gallery photos clickable
    photos.forEach((photo) => {

        photo.setAttribute("tabindex", "0");
        photo.setAttribute("role", "button");

        photo.addEventListener("click", () => {
            openPhoto(photo);
        });

        photo.addEventListener("keydown", (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                openPhoto(photo);
            }

        });

    });


    // Close with X button
    closeButton.addEventListener("click", closeLightbox);


    // Close when clicking dark background
    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });


    // Close with Escape key
    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            lightbox.classList.contains("active")
        ) {
            closeLightbox();
        }

    });

});


// ==========================================
// 4. COMMENTS SYSTEM
// ==========================================

// Public comments are now handled separately
// in comments-firebase.js.
//
// This file no longer uses localStorage
// to save visitor comments.
//
// Keep comments-firebase.js linked only
// in comments.html.
