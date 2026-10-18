/* Luna Finn — shared interactions (vanilla JS, no deps) */
(function () {
  "use strict";

  /* ---- sticky header background on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    // close when a real link (not the dropdown parent) is tapped
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (a.getAttribute("href") === "#") return;
        nav.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- lightbox for galleries ---- */
  var shots = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (shots.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close">✕</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous">‹</button>' +
      '<img alt="">' +
      '<button class="lb-btn lb-next" aria-label="Next">›</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector("img");
    var lbCount = lb.querySelector(".lb-count");
    var idx = 0;

    function srcFor(el) { return el.getAttribute("data-full") || el.querySelector("img").src; }
    function show(i) {
      idx = (i + shots.length) % shots.length;
      lbImg.src = srcFor(shots[idx]);
      var alt = shots[idx].querySelector("img");
      lbImg.alt = alt ? alt.alt : "";
      lbCount.textContent = (idx + 1) + " / " + shots.length;
    }
    function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; lbImg.src = ""; }

    shots.forEach(function (el, i) {
      el.addEventListener("click", function () { open(i); });
      el.setAttribute("tabindex", "0");
      el.addEventListener("keydown", function (e) { if (e.key === "Enter") open(i); });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* ---- footer year ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
