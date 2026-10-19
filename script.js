
// Scroll Reveal Animation

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

// ===== PORTFOLIO PROJECT POPUP =====

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

    document.querySelectorAll(".project-btn").forEach(button => {
        button.addEventListener("click", () => {
            const key = button.dataset.project;
            const project = projects[key];

            if (!project) return;

            previousFocus = document.activeElement;

            document.getElementById("modalTitle").textContent =
                project.title;

            document.getElementById("modalImage").src =
                project.image;

            document.getElementById("modalDescription").textContent =
                project.description;

            projectModal.classList.add("show");
            projectModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeModal.focus();
        });
    });

    function hideProjectModal() {
        projectModal.classList.remove("show");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (previousFocus) previousFocus.focus();
    }

    closeModal.addEventListener("click", hideProjectModal);

    projectModal.addEventListener("click", (event) => {
        if (event.target === projectModal) {
            hideProjectModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!projectModal.classList.contains("show")) return;

        if (event.key === "Escape") {
            hideProjectModal();
        }

        if (event.key === "Tab") {
            event.preventDefault();
            closeModal.focus();
        }
    });
}

// ===== YOUR COMMENTS PAGE =====

const commentForm = document.getElementById("commentForm");

if (commentForm) {

    const commentsList =
        document.getElementById("commentsList");

    const successMessage =
        document.getElementById("successMessage");

    const ratingInputs =
        document.querySelectorAll(
            '#starRating input[name="rating"]'
        );

    const storageKey = "saddiahPortfolioComments";

    // Update star colours
    function updateStars() {
        const selected =
            document.querySelector(
                '#starRating input[name="rating"]:checked'
            );

        const rating = selected ? Number(selected.value) : 0;

        ratingInputs.forEach(input => {
            const label = input.closest("label");

            label.classList.toggle(
                "selected",
                Number(input.value) <= rating
            );
        });
    }

    ratingInputs.forEach(input => {
        input.addEventListener("change", updateStars);
    });

    // Read saved comments
    function getComments() {
        try {
            return JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );
        } catch (error) {
            return [];
        }
    }

    // Display comments safely
    function displayComments() {
        commentsList.innerHTML = "";

        const comments = getComments();

        if (comments.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-comments";
            empty.textContent =
                "No messages yet. Be the first to leave one! 💗";

            commentsList.appendChild(empty);
            return;
        }

        comments.forEach(comment => {
            const card = document.createElement("article");
            card.className = "visitor-card";

            const name = document.createElement("h3");
            name.textContent = comment.name;

            const stars = document.createElement("div");
            stars.className = "visitor-stars";
            stars.textContent =
                "★".repeat(comment.rating) +
                "☆".repeat(5 - comment.rating);

            const message = document.createElement("p");
            message.textContent = comment.message;

            const date = document.createElement("span");
            date.className = "comment-date";
            date.textContent = comment.date;

            card.append(name, stars, message, date);
            commentsList.appendChild(card);
        });
    }

    // Handle form submission
    commentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name =
            document.getElementById("visitorName").value.trim();

        const email =
            document.getElementById("visitorEmail").value.trim();

        const message =
            document.getElementById("visitorMessage").value.trim();

        const selectedRating =
            document.querySelector(
                '#starRating input[name="rating"]:checked'
            );

        if (!name || !email || !message || !selectedRating) {
            successMessage.textContent =
                "Please complete all fields and choose a rating.";
            return;
        }

        const comment = {
            name: name,
            message: message,
            rating: Number(selectedRating.value),
            date: new Date().toLocaleDateString("en-MY")
        };

        const comments = getComments();
        comments.unshift(comment);

        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(comments)
            );

            displayComments();

            successMessage.textContent =
                "Thank you for your lovely message! 💗";

            commentForm.reset();
            updateStars();

        } catch (error) {
            successMessage.textContent =
                "Unable to save your message. Please try again.";
        }
    });

    // Load existing comments
    displayComments();
}
