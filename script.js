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

// Inklapbare secties: kop + intro zichtbaar, rest achter "Toon meer"
(function(){
  var ids=["raadswerk","zuidwest","melden","agenda","nieuws","over"];
  ids.forEach(function(id){
    var sec=document.getElementById(id); if(!sec) return;
    var wrap=sec.querySelector(".wrap"); if(!wrap) return;
    var head=wrap.querySelector(".section-head");
    var body=document.createElement("div"); body.className="sec-body";
    if(head){
      Array.from(wrap.children).forEach(function(el){ if(el!==head) body.appendChild(el); });
      wrap.appendChild(body);
    } else {
      var h2=wrap.querySelector("h2"); var tag=wrap.querySelector(".tag");
      head=document.createElement("div"); head.className="section-head";
      if(tag) head.appendChild(tag.cloneNode(true));
      var t=document.createElement("h2"); t.textContent=h2?h2.textContent:id; head.appendChild(t);
      var p=wrap.querySelector("p.lead"); if(p){ var pp=document.createElement("p"); pp.textContent=p.textContent; head.appendChild(pp); }
      Array.from(wrap.children).forEach(function(el){ body.appendChild(el); });
      wrap.className="wrap"; wrap.appendChild(head); wrap.appendChild(body);
    }
    // extra .wrap's in dezelfde sectie (bijv. fotostrook) ook inklappen
    Array.from(sec.querySelectorAll(":scope > .wrap")).forEach(function(w){ if(w!==wrap) body.appendChild(w); });
    var btn=document.createElement("button"); btn.type="button"; btn.className="sec-toggle"; btn.setAttribute("aria-expanded","false");
    btn.innerHTML='<span>Toon meer</span> <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';
    head.appendChild(btn);
    sec.classList.add("collapsed");
    function set(open){ sec.classList.toggle("collapsed",!open); btn.setAttribute("aria-expanded",open); btn.querySelector("span").textContent=open?"Toon minder":"Toon meer"; }
    btn.addEventListener("click",function(){ var open=sec.classList.contains("collapsed"); set(open); if(!open) sec.scrollIntoView({behavior:"smooth",block:"start"}); });
    sec._open=function(){ set(true); };
  });
  function openHash(){ var id=(location.hash||"").slice(1); var s=id&&document.getElementById(id); if(s&&s._open) s._open(); }
  window.addEventListener("hashchange",openHash); openHash();
  document.querySelectorAll('a[href^="#"]').forEach(function(a){ a.addEventListener("click",function(){ var s=document.getElementById(a.getAttribute("href").slice(1)); if(s&&s._open) s._open(); }); });
})();
