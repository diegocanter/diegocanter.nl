// ===== Instellingen: vul deze twee in zodra je ze hebt =====
// 1) Link van je Google Agenda afsprakenplanning (of Calendly / Cal.com)
var AGENDA_URL = ""; // bijv. "https://calendar.google.com/calendar/appointments/schedules/XXXX"
// 2) Je Formspree-formulier-ID (gratis account op formspree.io)
var FORMSPREE_ID = "xkjjkoqq"; // bijv. "xabcdefg"

// Mobiel menu
var menuBtn = document.getElementById("menuBtn");
var navLinks = document.getElementById("navLinks");
if (menuBtn) {
  menuBtn.addEventListener("click", function () { navLinks.classList.toggle("open"); });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { navLinks.classList.remove("open"); });
  });
}

// Agenda: toon de ingebedde planner als er een link is ingevuld
var frame = document.getElementById("agendaFrame");
var fallback = document.getElementById("agendaFallback");
var agendaBtn = document.getElementById("agendaBtn");
if (AGENDA_URL) {
  frame.src = AGENDA_URL;
  frame.style.display = "block";
  fallback.style.display = "none";
  if (agendaBtn) { agendaBtn.href = AGENDA_URL; agendaBtn.target = "_blank"; }
}

// Contactformulier
var form = document.getElementById("contactForm");
var ok = document.getElementById("formOk");
if (form) {
  if (FORMSPREE_ID) form.action = "https://formspree.io/f/" + FORMSPREE_ID;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Versturen…";
    var data = new FormData(form);
    var done = function () {
      form.querySelectorAll(".field, .two, button, .form-note").forEach(function (el) { el.style.display = "none"; });
      ok.style.display = "block";
    };
    if (!FORMSPREE_ID) {
      // Nog geen formulierdienst gekoppeld: toon alvast hoe het eruitziet
      setTimeout(done, 600);
      return;
    }
    fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { if (r.ok) done(); else throw new Error(); })
      .catch(function () {
        btn.disabled = false; btn.textContent = "Verstuur bericht →";
        alertBox("Versturen is niet gelukt. Mail mij op diego.cantervisscher@denhaag.nl.");
      });
  });
}
function alertBox(msg) {
  var n = document.createElement("div");
  n.className = "form-note"; n.style.color = "#a33"; n.textContent = msg;
  form.appendChild(n);
}

// Nieuws: automatisch nieuwste eerst (op data-date, jjjj-mm-dd)
var list=document.getElementById("newsList");
if(list){Array.from(list.children).sort(function(a,b){return (b.dataset.date||"").localeCompare(a.dataset.date||"");}).forEach(function(el){list.appendChild(el);});}

// Toezeggingen: nieuwste eerst
var tz=document.getElementById("tzList");
if(tz){Array.from(tz.children).sort(function(a,b){return (b.dataset.date||"").localeCompare(a.dataset.date||"");}).forEach(function(el){tz.appendChild(el);});}
