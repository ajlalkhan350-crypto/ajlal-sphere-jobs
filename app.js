const $ = (s, r = document) => r.querySelector(s);
const state = {
  lang: localStorage.getItem("sp_lang") || "en",
  city: localStorage.getItem("sp_city") || "Riyadh",
  user: JSON.parse(localStorage.getItem("sp_user") || "null"),
  kind: "buy",
  greeted: false,
  lastIntent: "hi",
};

const ADS = [
  { id: "A1", sec: "buy", title: "Smartphone set", city: "Riyadh", price: "SAMPLE", img: "assets/phone.jpg", seller: "Demo", phone: "", blurb: "Practice ad. Not for sale.", stars: 4 },
  { id: "A2", sec: "grocery", title: "Pantry box", city: "Jeddah", price: "24 SAR", img: "assets/grocery.jpg", seller: "Demo Mart", phone: "", blurb: "Demo grocery item.", stars: 5 },
  { id: "A3", sec: "grocery", title: "Daily bread pack", city: "Riyadh", price: "8 SAR", img: "assets/grocery.jpg", seller: "Demo Mart", phone: "", blurb: "Demo only.", stars: 4 },
  { id: "A4", sec: "car", title: "Family sedan", city: "Riyadh", price: "SAMPLE", img: "assets/car.jpg", seller: "Demo Auto", phone: "", blurb: "Used car demo. Check Istimara on real ads.", stars: 4 },
  { id: "A5", sec: "car", title: "City car rent (day)", city: "Jeddah", price: "SAMPLE", img: "assets/car.jpg", seller: "Demo Rent", phone: "", blurb: "Rent demo.", stars: 3 },
  { id: "A6", sec: "property", title: "2BR apartment", city: "Riyadh", price: "SAMPLE", img: "assets/hero-jobs.jpg", seller: "Demo Homes", phone: "", blurb: "Rent/sale demo. Check papers yourself.", stars: 4 },
  { id: "A7", sec: "property", title: "Shop space", city: "Dammam", price: "SAMPLE", img: "assets/hero-jobs.jpg", seller: "Demo Homes", phone: "", blurb: "Demo listing.", stars: 3 },
  { id: "A8", sec: "buy", title: "Home extras", city: "Makkah", price: "SAMPLE", img: "assets/grocery.jpg", seller: "Demo", phone: "", blurb: "Demo household.", stars: 4 },
];

const JOBS = [
  { id: "J1", title: "Warehouse helper", city: "Riyadh", price: "3000-4000 SAR", visa: "Transfer", blurb: "SAMPLE job. Not a real vacancy." },
  { id: "J2", title: "Restaurant waiter", city: "Jeddah", price: "2500-3500 SAR", visa: "Transfer", blurb: "SAMPLE only." },
  { id: "J3", title: "Driver (light)", city: "Riyadh", price: "3500-4500 SAR", visa: "Transfer", blurb: "SAMPLE only." },
  { id: "J4", title: "Sales associate", city: "Dammam", price: "4000-5500 SAR", visa: "Saudi", blurb: "SAMPLE only." },
];

const SVCS = [
  { id: "S1", title: "Electrician", city: "Riyadh", price: "SAMPLE", blurb: "Demo profile. Not a booked technician.", stars: 5 },
  { id: "S2", title: "AC technician", city: "Jeddah", price: "SAMPLE", blurb: "Demo only.", stars: 4 },
  { id: "S3", title: "Plumber", city: "Riyadh", price: "SAMPLE", blurb: "Demo only.", stars: 4 },
  { id: "S4", title: "Home cleaner", city: "Makkah", price: "SAMPLE", blurb: "Demo only.", stars: 3 },
];

function extraAds() {
  try { return JSON.parse(localStorage.getItem("sp_ads") || "[]"); } catch { return []; }
}
function allAds() { return ADS.concat(extraAds()); }
function cart() { try { return JSON.parse(localStorage.getItem("sp_cart") || "[]"); } catch { return []; } }
function saveCart(c) { localStorage.setItem("sp_cart", JSON.stringify(c)); }

function stars(n) { return "★".repeat(n || 0) + "☆".repeat(5 - (n || 0)); }

function adCard(a) {
  return `<button class="item" data-open="${a.id}" data-kind="ad">
    <img src="${a.img || "assets/logo.png"}" alt="" />
    <div class="pad"><span class="badge">SAMPLE</span>
    <strong>${a.title}</strong>
    <div class="price">${a.price || ""}</div>
    <div class="meta">${a.city || ""} · ${a.seller || ""}</div>
    <div class="stars">${stars(a.stars)}</div></div></button>`;
}

function show(id) {
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("on", v.id === id));
  document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("on", b.getAttribute("data-go") === id));
  window.scrollTo(0, 0);
  if (id === "market") renderMarket();
  if (id === "grocery") { renderGrocery(); renderCart(); }
  if (id === "jobs") renderJobs();
  if (id === "cars") renderCars();
  if (id === "property") renderProps();
  if (id === "services") renderSvcs();
  if (id === "dash") renderDash();
  if (id === "inbox") renderInbox();
}

function renderHome() {
  const box = $("#homeFeed");
  if (box) box.innerHTML = allAds().slice(0, 4).map(adCard).join("");
}
function renderMarket() {
  const kind = state.kind;
  let list = allAds().filter((a) => a.sec === "buy" || a.sec === kind);
  if (kind === "buy") list = allAds().filter((a) => ["buy", "grocery"].includes(a.sec));
  const city = $("#cityM") && $("#cityM").value;
  if (city) list = list.filter((a) => a.city === city);
  const t = $("#marketTitle");
  if (t) t.textContent = kind === "grocery" ? "Grocery-style goods" : "Buy & Sell";
  $("#marketList").innerHTML = list.map(adCard).join("");
}
function renderGrocery() {
  $("#grocList").innerHTML = allAds().filter((a) => a.sec === "grocery").map((a) =>
    `<div class="item"><img src="${a.img}" alt="" /><div class="pad"><span class="badge">SAMPLE</span>
    <strong>${a.title}</strong><div class="price">${a.price}</div>
    <button class="btn btn-g" data-cart="${a.id}">Add</button></div></div>`
  ).join("");
  document.querySelectorAll("[data-cart]").forEach((b) => b.onclick = () => {
    const id = b.getAttribute("data-cart");
    const item = allAds().find((x) => x.id === id);
    const c = cart();
    const f = c.find((x) => x.id === id);
    if (f) f.qty += 1; else c.push({ id, title: item.title, price: item.price, qty: 1 });
    saveCart(c); renderCart();
  });
}
function renderCart() {
  const c = cart();
  $("#cartLines").innerHTML = c.length ? c.map((x) =>
    `<div class="cart-line"><span>${x.title} × ${x.qty}</span><span>${x.price}</span></div>`
  ).join("") : "<p class='meta'>Cart empty</p>";
  $("#cartTotal").textContent = c.length ? "Demo cart — no payment yet." : "";
}
function renderJobs() {
  let list = JOBS.slice();
  const city = $("#cityJ") && $("#cityJ").value;
  const visa = $("#visaJ") && $("#visaJ").value;
  if (city) list = list.filter((j) => j.city === city);
  if (visa) list = list.filter((j) => j.visa === visa);
  $("#jobList").innerHTML = list.map((j) =>
    `<button class="item" data-open="${j.id}" data-kind="job" style="display:flex;gap:10px">
      <div class="pad" style="flex:1"><span class="badge">SAMPLE</span>
      <strong>${j.title}</strong>
      <div class="price">${j.price}</div>
      <div class="meta">${j.city} · ${j.visa}</div></div></button>`
  ).join("");
  bindOpens();
}
function renderCars() {
  $("#carList").innerHTML = allAds().filter((a) => a.sec === "car").map(adCard).join("");
  bindOpens();
}
function renderProps() {
  $("#propList").innerHTML = allAds().filter((a) => a.sec === "property").map(adCard).join("");
  bindOpens();
}
function renderSvcs() {
  $("#svcList").innerHTML = SVCS.map((s) =>
    `<article class="panel"><span class="badge">SAMPLE</span><h2>${s.title}</h2>
    <div class="stars">${stars(s.stars)}</div>
    <p class="meta">${s.city} · ${s.price}</p><p>${s.blurb}</p>
    <button class="btn btn-line" data-msg="${s.title}">Message</button></article>`
  ).join("");
  document.querySelectorAll("[data-msg]").forEach((b) => b.onclick = () => {
    state.chatTo = b.getAttribute("data-msg");
    show("inbox");
  });
}
function bindOpens() {
  document.querySelectorAll("[data-open]").forEach((b) => {
    b.onclick = () => openDetail(b.getAttribute("data-open"), b.getAttribute("data-kind") || "ad");
  });
}
function openDetail(id, kind) {
  let x = kind === "job" ? JOBS.find((j) => j.id === id) : allAds().find((a) => a.id === id);
  if (!x) return;
  $("#detail").innerHTML = `
    <button class="btn btn-line" data-go="home">← Home</button>
    ${x.img ? `<img src="${x.img}" alt="" style="width:100%;max-height:240px;object-fit:cover;border-radius:12px;margin:8px 0" />` : ""}
    <span class="badge">SAMPLE</span>
    <h2>${x.title}</h2>
    <div class="price">${x.price || ""}</div>
    <p class="meta">${x.city || ""} · ${x.seller || ""} · ${x.visa || ""}</p>
    <div class="stars">${stars(x.stars)}</div>
    <p>${x.blurb || ""}</p>
    <div class="panel">
      <h2>Contact seller</h2>
      <p class="sub">Not live chat. Note stays on this phone.</p>
      <button class="btn btn-g" id="msgBtn">Message</button>
      ${kind === "job" ? `<form id="apForm" style="margin-top:10px">
        <div class="field"><label>Name</label><input name="name" required /></div>
        <div class="field"><label>WhatsApp</label><input name="phone" required /></div>
        <button class="btn btn-line" type="submit">Apply (free)</button>
        <p class="meta" id="apMsg"></p></form>` : ""}
      <p class="notice">This is a SAMPLE card. Do not send money or passport photos.</p>
    </div>`;
  show("detail");
  $("#detail [data-go]") && ($("#detail [data-go]").onclick = (e) => { e.preventDefault(); show("home"); });
  const mb = $("#msgBtn");
  if (mb) mb.onclick = () => { state.chatTo = x.title; show("inbox"); };
  const ap = $("#apForm");
  if (ap) ap.onsubmit = (e) => {
    e.preventDefault();
    $("#apMsg").textContent = "Saved on this phone. SAMPLE jobs do not call you.";
  };
}

function renderDash() {
  const u = state.user;
  $("#dashBox").innerHTML = u
    ? `<p><b>${u.name}</b><br>${u.mobile || ""} · ${u.city || ""}</p>
       <p class="meta">Demo profile on this device only.</p>
       <button class="btn btn-line" id="outBtn">Log out</button>`
    : `<p>Not signed in.</p><button class="btn btn-g" data-go="auth">Login</button>`;
  const o = $("#outBtn");
  if (o) o.onclick = () => { state.user = null; localStorage.removeItem("sp_user"); paintAuth(); show("home"); };
}
function renderInbox() {
  const logs = JSON.parse(localStorage.getItem("sp_chat") || "[]");
  $("#inboxMsgs").innerHTML = logs.map((m) => `<div class="bubble ${m.who}">${m.t}</div>`).join("") || "<p class='meta'>No messages yet.</p>";
}

function paintAuth() {
  $("#authBtn").textContent = state.user ? state.user.name.split(" ")[0] : "Login";
  $("#locBtn").textContent = "📍 " + state.city;
}

function localCare(text) {
  const t = (text || "").toLowerCase();
  if (/scam|fake|احتيال|نصب/.test(t)) return "Red flags: paying to get a job; passport on WhatsApp; fantasy salaries. Sphere never charges job seekers.";
  if (/job|نوکری|وظيفة/.test(t)) return "Open Jobs. SAMPLE cards are practice. Apply is free. Real contracts are on Qiwa.";
  if (/car|سیار|گاڑی/.test(t)) return "Cars are person-to-person SAMPLE ads for now. Check Istimara yourself on real sales.";
  if (/grocery|خضار|گروسری/.test(t)) return "Grocery cart is a demo on this phone. No real checkout or payment yet.";
  if (/amazon|noon|olx|daraz|حراج/.test(t)) return "Sphere is independent. We do not copy those catalogues. People list their own ads after review.";
  if (/urdu|اردو|batawo/.test(t)) return "یہ Sphere ہے۔ نوکری مفت دیکھیں۔ اشتہار جائزے کے بعد۔ پیسے یا پاسپورٹ اجنبی کو نہ دو۔";
  return "I am Sphere AI Care. Ask about jobs, ads, cars, grocery demo, or scams. I am not the government and not a lawyer.";
}

function bind() {
  $("#lang").value = state.lang;
  $("#lang").onchange = (e) => { state.lang = e.target.value; localStorage.setItem("sp_lang", state.lang); document.body.classList.toggle("rtl", state.lang !== "en"); };
  document.body.classList.toggle("rtl", state.lang !== "en");
  paintAuth();
  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const go = el.getAttribute("data-go");
      if (el.getAttribute("data-kind")) state.kind = el.getAttribute("data-kind");
      if (go === "auth" && state.user) { show("dash"); return; }
      if (go === "loc") {
        const c = prompt("City", state.city);
        if (c) { state.city = c; localStorage.setItem("sp_city", c); paintAuth(); }
        return;
      }
      if (go === "care" && !state.greeted) {
        show("care");
        $("#msgs").innerHTML = "";
        const d = document.createElement("div");
        d.className = "bubble bot";
        d.textContent = localCare("hi");
        $("#msgs").appendChild(d);
        state.greeted = true;
        return;
      }
      show(go);
    });
  });
  $("#homeSearch").onsubmit = (e) => {
    e.preventDefault();
    const q = ($("#q").value || "").toLowerCase();
    if (/job|driver|waiter|نوکری/.test(q)) show("jobs");
    else if (/car|toyota|camry|سیار/.test(q)) show("cars");
    else if (/villa|flat|house|ارض|شقة/.test(q)) show("property");
    else if (/electric|plumb|ac |clean/.test(q)) show("services");
    else if (/milk|bread|fruit|grocery/.test(q)) show("grocery");
    else show("market");
    renderMarket();
  };
  $("#cityM") && ($("#cityM").onchange = renderMarket);
  $("#cityJ") && ($("#cityJ").onchange = renderJobs);
  $("#visaJ") && ($("#visaJ").onchange = renderJobs);
  $("#regForm").onsubmit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target).entries());
    state.user = { name: f.name, mobile: f.mobile, email: f.email, city: f.city };
    localStorage.setItem("sp_user", JSON.stringify(state.user));
    paintAuth();
    show("dash");
  };
  $("#postForm").onsubmit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target).entries());
    const ads = extraAds();
    ads.unshift({ id: "U" + Date.now(), sec: f.sec === "job" ? "buy" : f.sec, title: f.title, city: f.city, price: f.price, seller: f.seller, phone: f.phone, blurb: f.blurb + " (pending review)", img: "assets/logo.png", stars: 0 });
    localStorage.setItem("sp_ads", JSON.stringify(ads));
    $("#postMsg").textContent = "Queued on this phone. Not public until a human review exists on a real server.";
  };
  $("#careForm").onsubmit = (e) => {
    e.preventDefault();
    const v = $("#careIn").value.trim();
    if (!v) return;
    $("#careIn").value = "";
    const me = document.createElement("div"); me.className = "bubble me"; me.textContent = v; $("#msgs").appendChild(me);
    const bot = document.createElement("div"); bot.className = "bubble bot"; bot.textContent = localCare(v); $("#msgs").appendChild(bot);
    $("#msgs").scrollTop = 9999;
  };
  $("#inboxForm").onsubmit = (e) => {
    e.preventDefault();
    const v = $("#inboxIn").value.trim();
    if (!v) return;
    $("#inboxIn").value = "";
    const logs = JSON.parse(localStorage.getItem("sp_chat") || "[]");
    logs.push({ who: "me", t: (state.chatTo ? "[" + state.chatTo + "] " : "") + v });
    logs.push({ who: "bot", t: "Demo seller: thanks. This is not live chat." });
    localStorage.setItem("sp_chat", JSON.stringify(logs));
    renderInbox();
  };
  $("#cvForm").onsubmit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target).entries());
    $("#cvOut").innerHTML = `<h2>${f.name}</h2><p>${f.city || ""} · ${f.visa || ""}</p><p><b>${f.role || ""}</b></p><p>${f.skills || ""}</p><p>${f.exp || ""}</p>`;
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (b) openDetail(b.getAttribute("data-open"), b.getAttribute("data-kind") || "ad");
  });
}

renderHome();
bind();
paintAuth();
