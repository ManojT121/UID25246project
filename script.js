// =============================================
// ShowBook - script.js
// Concepts used: DOM manipulation, getElementById,
// getElementsByClassName, event handlers, loops,
// arrays, onclick, onscroll, setTimeout
// =============================================

// --- NAVBAR SCROLL EFFECT ---
// Adds a 'scrolled' class when user scrolls down
window.onscroll = function () {
    var navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
};

// --- MOBILE HAMBURGER MENU ---
function toggleMenu() {
    var navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("open");
}

// Close menu when a nav link is clicked
var navLinks = document.getElementsByClassName("nav-link");
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
        document.getElementById("navLinks").classList.remove("open");
    });
}

// --- HERO SLIDER ---
var currentSlide = 0;
var slides = document.getElementsByClassName("hero-slide");
var dots = document.getElementsByClassName("dot");
var sliderInterval;

// Show a specific slide
function goToSlide(index) {
    // Remove active from current
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    // Set new index
    currentSlide = index;

    // Add active to new
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
}

// Auto-advance slider every 4 seconds
function startSlider() {
    sliderInterval = setInterval(function () {
        var next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, 4000);
}

// Restart timer when user manually picks a slide
var originalGoTo = goToSlide;
goToSlide = function (index) {
    clearInterval(sliderInterval);
    originalGoTo(index);
    startSlider();
};

startSlider();

// --- CATEGORY FILTER ---
function filterCards(type, clickedBtn) {
    // Update active tab button
    var tabs = document.getElementsByClassName("cat-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    clickedBtn.classList.add("active");

    // Show/hide cards based on data-type
    var cards = document.getElementsByClassName("card");
    for (var j = 0; j < cards.length; j++) {
        var cardType = cards[j].getAttribute("data-type");
        if (type === "all" || cardType === type) {
            cards[j].classList.remove("hidden");
        } else {
            cards[j].classList.add("hidden");
        }
    }
}

// --- SEARCH ---
function handleSearch() {
    var query = document.getElementById("searchInput").value.trim().toLowerCase();

    if (query === "") {
        showToast("Please enter something to search!");
        return;
    }

    // Simple search: highlight cards that match
    var cards = document.getElementsByClassName("card");
    var found = 0;

    for (var i = 0; i < cards.length; i++) {
        var title = cards[i].getElementsByClassName("card-title")[0].textContent.toLowerCase();
        if (title.indexOf(query) !== -1) {
            cards[i].classList.remove("hidden");
            found++;
        } else {
            cards[i].classList.add("hidden");
        }
    }

    if (found === 0) {
        showToast("No results found for '" + query + "'");
        // Show all after 2 seconds
        setTimeout(function () {
            for (var j = 0; j < cards.length; j++) {
                cards[j].classList.remove("hidden");
            }
        }, 2000);
    } else {
        showToast("Found " + found + " result(s) for '" + query + "'");
    }
}

// Search on Enter key
document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        handleSearch();
    }
});

// --- BOOKING MODAL ---
var currentBooking = "";
var selectedSeats = [];
var ticketPrice = 250;

// Pre-booked seat numbers (just for realism)
var bookedSeats = [3, 7, 11, 15, 20, 25];

function bookNow(showName) {
    currentBooking = showName;
    selectedSeats = [];

    // Update modal title
    document.getElementById("modalTitle").textContent = showName;
    document.getElementById("modalDesc").textContent = "Pick your seats below. ₹250 per seat.";
    document.getElementById("selectedCount").textContent = "0";
    document.getElementById("totalPrice").textContent = "0";

    // Build seat grid (24 seats)
    var seatGrid = document.getElementById("seatGrid");
    seatGrid.innerHTML = "";

    for (var i = 1; i <= 24; i++) {
        var seat = document.createElement("div");
        seat.className = "seat";
        seat.textContent = i;
        seat.setAttribute("data-seat", i);

        if (bookedSeats.indexOf(i) !== -1) {
            seat.classList.add("booked");
        } else {
            // Use closure to capture i
            seat.addEventListener("click", (function (seatNum, el) {
                return function () {
                    toggleSeat(seatNum, el);
                };
            })(i, seat));
        }

        seatGrid.appendChild(seat);
    }

    // Open modal
    document.getElementById("modalOverlay").classList.add("open");
}

function toggleSeat(seatNum, el) {
    var idx = selectedSeats.indexOf(seatNum);

    if (idx === -1) {
        // Select it
        selectedSeats.push(seatNum);
        el.classList.add("selected");
    } else {
        // Deselect it
        selectedSeats.splice(idx, 1);
        el.classList.remove("selected");
    }

    // Update count and price
    document.getElementById("selectedCount").textContent = selectedSeats.length;
    document.getElementById("totalPrice").textContent = selectedSeats.length * ticketPrice;
}

function closeModal() {
    document.getElementById("modalOverlay").classList.remove("open");
}

function confirmBooking() {
    if (selectedSeats.length === 0) {
        showToast("Please select at least one seat!");
        return;
    }

    var total = selectedSeats.length * ticketPrice;
    closeModal();
    showToast("🎉 Booked " + selectedSeats.length + " seat(s) for " + currentBooking + "! Total: ₹" + total);

    // Add booked seats to booked list (so they stay taken)
    for (var i = 0; i < selectedSeats.length; i++) {
        bookedSeats.push(selectedSeats[i]);
    }
}

// --- TOAST NOTIFICATION ---
function showToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    // Auto-hide after 3 seconds
    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

// --- SMOOTH ACTIVE LINK ON SCROLL ---
// Updates navbar link highlight as user scrolls sections
window.addEventListener("scroll", function () {
    var sections = ["home", "movies", "events", "about"];
    var links = document.getElementsByClassName("nav-link");
    var scrollPos = window.scrollY + 100;

    for (var s = 0; s < sections.length; s++) {
        var el = document.getElementById(sections[s]);
        if (!el) continue;
        if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
            for (var l = 0; l < links.length; l++) {
                links[l].classList.remove("active");
            }
            // Match link by href
            for (var l2 = 0; l2 < links.length; l2++) {
                if (links[l2].getAttribute("href") === "#" + sections[s]) {
                    links[l2].classList.add("active");
                }
            }
        }
    }
});

// --- CARD HOVER SOUND EFFECT (subtle) ---
// Just a small DOM trick: adds a short scale animation on card hover
var allCards = document.getElementsByClassName("card");
for (var c = 0; c < allCards.length; c++) {
    allCards[c].addEventListener("mouseenter", function () {
        this.style.borderColor = "rgba(224, 49, 49, 0.3)";
    });
    allCards[c].addEventListener("mouseleave", function () {
        this.style.borderColor = "";
    });
}