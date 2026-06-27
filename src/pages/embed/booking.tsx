/**
 * /embed/booking
 *
 * Standalone page that renders the ArtiZone booking widget.
 * Designed to be embedded in an <iframe> on any external site:
 *
 *   <iframe src="https://artizonespa.com/embed/booking"
 *           style="width:100%;max-width:600px;border:none;height:700px"
 *           title="Book your visit at ArtiZone"></iframe>
 *
 * The page has no header/footer — it renders the widget only.
 * API_BASE is set to the same origin so the widget calls /api/v1/*.
 */
import { useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

export default function EmbedBookingPage() {
  useEffect(() => {
    // Inject the widget script after mount so it can find #az-booking
    const script = document.createElement('script');
    script.textContent = buildWidgetScript();
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <>
      <Helmet>
        <title>Book Your Visit — ArtiZone</title>
        <meta name="robots" content="noindex, nofollow" />
        {/* Allow embedding in iframes from any origin */}
        <meta httpEquiv="X-Frame-Options" content="ALLOWALL" />
      </Helmet>

      {/* Minimal reset so the widget looks clean inside an iframe */}
      <style>{`
        html, body { margin: 0; padding: 0; background: #FCFBF8; }
        body { padding: 16px; box-sizing: border-box; }
      `}</style>

      <div id="az-booking" />
    </>
  );
}

// ─── Widget script (same logic as the HTML file, API_BASE points to /api/v1) ──
function buildWidgetScript(): string {
  return `
(function () {
  var AZ_CONFIG = {
    API_BASE: "/api/v1",
    WHATSAPP: "962790412758",
    DEFAULT_LANG: "en",
    DAYS_AHEAD: 30
  };

  var T = {
    en: {
      dir: "ltr", langBtn: "العربية",
      title: "Book your visit", sub: "Pick a service and time — we confirm on WhatsApp.",
      step1: "Service", step2: "Date & time", step3: "Your details",
      svcLoad: "Loading services…", svcFail: "Couldn't load services. Please retry.",
      retry: "Retry",
      date: "Date", time: "Time",
      slotsLoad: "Checking availability…",
      slotsNone: "No open times that day — try another date.",
      slotsFallback: "Choose your preferred time — we'll confirm availability on WhatsApp.",
      anyGender: "Any practitioner", female: "Female practitioner", male: "Male practitioner",
      prefLabel: "Practitioner preference",
      name: "Full name", phone: "Mobile (07XXXXXXXX)", notes: "Notes (optional)",
      phoneBad: "Please enter a valid Jordan mobile (07XXXXXXXX).",
      nameBad: "Please enter your name.",
      back: "Back", next: "Next", submit: "Request booking",
      sending: "Sending…",
      okTitle: "Request received!",
      okBody: "We'll confirm your appointment on WhatsApp shortly.",
      okWa: "Open WhatsApp",
      okAgain: "Make another booking",
      submitFail: "Couldn't send the request. Please try again, or message us on WhatsApp.",
      min: "min", jod: "JOD"
    },
    ar: {
      dir: "rtl", langBtn: "English",
      title: "احجزي موعدك", sub: "اختاري الخدمة والوقت — وسنؤكد عبر واتساب.",
      step1: "الخدمة", step2: "التاريخ والوقت", step3: "بياناتك",
      svcLoad: "جاري تحميل الخدمات…", svcFail: "تعذر تحميل الخدمات. حاولي مرة أخرى.",
      retry: "إعادة المحاولة",
      date: "التاريخ", time: "الوقت",
      slotsLoad: "جاري التحقق من المواعيد…",
      slotsNone: "لا توجد مواعيد متاحة في هذا اليوم — جربي تاريخاً آخر.",
      slotsFallback: "اختاري الوقت المفضل — سنؤكد التوفر عبر واتساب.",
      anyGender: "أي أخصائي", female: "أخصائية (سيدة)", male: "أخصائي (رجل)",
      prefLabel: "تفضيل الأخصائي",
      name: "الاسم الكامل", phone: "رقم الموبايل (07XXXXXXXX)", notes: "ملاحظات (اختياري)",
      phoneBad: "يرجى إدخال رقم موبايل أردني صحيح (07XXXXXXXX).",
      nameBad: "يرجى إدخال الاسم.",
      back: "رجوع", next: "التالي", submit: "إرسال طلب الحجز",
      sending: "جاري الإرسال…",
      okTitle: "تم استلام طلبك!",
      okBody: "سنؤكد موعدك عبر واتساب قريباً.",
      okWa: "فتح واتساب",
      okAgain: "حجز جديد",
      submitFail: "تعذر إرسال الطلب. حاولي مرة أخرى أو راسلينا على واتساب.",
      min: "دقيقة", jod: "د.أ"
    }
  };

  var css = ""
  + "#az-booking{--az-navy:#0E2A3A;--az-gold:#9C7A3C;--az-cream:#FCFBF8;--az-line:#E4E0D6;"
  +   "--az-ink:#22201C;--az-mut:#6B6A64;--az-ok:#1D7A4F;--az-err:#A33A3A;"
  +   "font-family:'Jost','Segoe UI',system-ui,sans-serif;color:var(--az-ink);"
  +   "max-width:560px;margin:0 auto;background:var(--az-cream);border:1px solid var(--az-line);"
  +   "border-radius:16px;padding:26px 22px;box-sizing:border-box}"
  + "#az-booking *{box-sizing:border-box;margin:0}"
  + "#az-booking .az-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}"
  + "#az-booking h2{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;"
  +   "font-size:28px;color:var(--az-navy);line-height:1.15}"
  + "#az-booking .az-sub{color:var(--az-mut);font-size:14px;margin-top:6px}"
  + "#az-booking .az-lang{background:none;border:1px solid var(--az-line);border-radius:999px;"
  +   "padding:5px 14px;font:inherit;font-size:13px;color:var(--az-navy);cursor:pointer;flex-shrink:0}"
  + "#az-booking .az-steps{display:flex;gap:6px;margin:18px 0 20px}"
  + "#az-booking .az-step{flex:1;text-align:center;font-size:12px;color:var(--az-mut);"
  +   "padding-top:8px;border-top:3px solid var(--az-line)}"
  + "#az-booking .az-step.on{color:var(--az-navy);border-top-color:var(--az-gold);font-weight:500}"
  + "#az-booking .az-card{background:#fff;border:1px solid var(--az-line);border-radius:12px;"
  +   "padding:12px 14px;margin-bottom:10px;cursor:pointer;display:flex;justify-content:space-between;"
  +   "gap:10px;align-items:baseline;width:100%;text-align:start;font:inherit}"
  + "#az-booking .az-card:hover{border-color:var(--az-gold)}"
  + "#az-booking .az-card.sel{border-color:var(--az-navy);box-shadow:0 0 0 1px var(--az-navy)}"
  + "#az-booking .az-card .n{font-size:15px}"
  + "#az-booking .az-card .m{font-size:12px;color:var(--az-mut)}"
  + "#az-booking .az-card .p{font-family:'Cormorant Garamond',Georgia,serif;font-size:17px;"
  +   "color:var(--az-navy);white-space:nowrap}"
  + "#az-booking label{display:block;font-size:13px;color:var(--az-mut);margin:14px 0 5px}"
  + "#az-booking input,#az-booking select,#az-booking textarea{width:100%;padding:11px 12px;"
  +   "border:1px solid var(--az-line);border-radius:10px;font:inherit;font-size:15px;background:#fff}"
  + "#az-booking input:focus,#az-booking select:focus,#az-booking textarea:focus"
  +   "{outline:2px solid var(--az-gold);outline-offset:1px;border-color:var(--az-gold)}"
  + "#az-booking .az-slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));"
  +   "gap:8px;margin-top:6px}"
  + "#az-booking .az-slot{padding:9px 4px;border:1px solid var(--az-line);border-radius:10px;"
  +   "background:#fff;font:inherit;font-size:14px;cursor:pointer;text-align:center}"
  + "#az-booking .az-slot.sel{background:var(--az-navy);color:#fff;border-color:var(--az-navy)}"
  + "#az-booking .az-note{font-size:13px;color:var(--az-mut);margin-top:8px}"
  + "#az-booking .az-err{color:var(--az-err);font-size:13px;margin-top:6px}"
  + "#az-booking .az-row{display:flex;gap:10px;margin-top:22px}"
  + "#az-booking .az-btn{flex:1;padding:13px;border-radius:999px;font:inherit;font-size:15px;"
  +   "cursor:pointer;border:1px solid var(--az-line);background:#fff;color:var(--az-ink)}"
  + "#az-booking .az-btn.pri{background:var(--az-navy);color:#fff;border-color:var(--az-navy);"
  +   "letter-spacing:.02em}"
  + "#az-booking .az-btn.pri:hover{background:#143850}"
  + "#az-booking .az-btn:disabled{opacity:.55;cursor:default}"
  + "#az-booking .az-ok{text-align:center;padding:18px 4px}"
  + "#az-booking .az-ok .tick{width:54px;height:54px;border-radius:50%;background:var(--az-ok);"
  +   "color:#fff;font-size:28px;line-height:54px;margin:0 auto 14px}"
  + "#az-booking .az-wa{display:inline-block;margin-top:14px;background:#1D9E5F;color:#fff;"
  +   "padding:12px 26px;border-radius:999px;text-decoration:none;font-size:15px}"
  + "#az-booking .az-skel{height:46px;border-radius:12px;background:var(--az-line);"
  +   "animation:azp 1.2s ease-in-out infinite;margin-bottom:10px}"
  + "@keyframes azp{0%,100%{opacity:1}50%{opacity:.5}}"
  + "#az-booking .az-hp{position:absolute;left:-5000px;top:-5000px}"
  + "@media (prefers-reduced-motion:reduce){#az-booking .az-skel{animation:none}}";

  var styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  var fontTag = document.createElement("link");
  fontTag.rel = "stylesheet";
  fontTag.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@400;500&display=swap";
  document.head.appendChild(fontTag);

  var root = document.getElementById("az-booking");
  if (!root) return;

  var S = {
    lang: AZ_CONFIG.DEFAULT_LANG,
    step: 1,
    services: null,
    svc: null,
    date: null,
    slots: null,
    slot: null,
    gender: "",
    sending: false,
    done: null
  };
  function t(k){ return T[S.lang][k]; }

  function api(path){
    return fetch(AZ_CONFIG.API_BASE + path, { headers: { Accept: "application/json" } })
      .then(function(r){ if(!r.ok) throw 0; return r.json(); });
  }
  function loadServices(){
    S.services = null; render();
    api("/services").then(function(d){
      S.services = (d.services || []);
      render();
    }).catch(function(){ S.services = []; render(); });
  }
  function loadSlots(){
    if (!S.svc || !S.date) return;
    S.slots = null; S.slot = null; render();
    var q = "/availability?service_id=" + encodeURIComponent(S.svc.id) +
            "&date=" + S.date +
            (S.gender ? "&preferred_gender=" + S.gender : "");
    api(q).then(function(d){
      S.slots = d.slots || [];
      render();
    }).catch(function(){ S.slots = false; render(); });
  }

  function dates(){
    var out = [], d = new Date();
    for (var i = 0; i < AZ_CONFIG.DAYS_AHEAD; i++){
      var x = new Date(d); x.setDate(d.getDate() + i);
      out.push(x.toISOString().slice(0,10));
    }
    return out;
  }
  function fmtDate(iso){
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString(S.lang === "ar" ? "ar-JO" : "en-GB",
      { weekday: "short", day: "numeric", month: "short" });
  }
  function fmtTime(isoOrHM){
    if (/^\\d\\d:\\d\\d$/.test(isoOrHM)) return isoOrHM;
    var d = new Date(isoOrHM);
    return d.toLocaleTimeString(S.lang === "ar" ? "ar-JO" : "en-GB",
      { hour: "2-digit", minute: "2-digit" });
  }
  function jordanPhoneOk(p){
    var c = p.replace(/[\\s-]/g, "");
    return /^07\\d{8}$/.test(c) || /^\\+?9627\\d{8}$/.test(c);
  }
  function toE164(p){
    var c = p.replace(/[\\s-]/g, "");
    if (/^07\\d{8}$/.test(c)) return "+962" + c.slice(1);
    if (/^9627\\d{8}$/.test(c)) return "+" + c;
    return c;
  }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  }

  function render(){
    root.dir = T[S.lang].dir;
    var h = "";
    h += "<div class='az-head'><div><h2>" + t("title") + "</h2>"
       + "<p class='az-sub'>" + t("sub") + "</p></div>"
       + "<button type='button' class='az-lang' data-act='lang'>" + t("langBtn") + "</button></div>";

    if (S.done){
      var waText = encodeURIComponent(
        (S.lang === "ar" ? "مرحباً، أرسلت طلب حجز " : "Hi, I sent a booking request for ")
        + S.svc.name + " — " + fmtDate(S.date) + " " +
        (S.slot.manual ? S.slot.manual : fmtTime(S.slot.start)) +
        (S.lang === "ar" ? " (رقم الطلب: " : " (ref: ") + S.done + ")");
      h += "<div class='az-ok'><div class='tick'>✓</div>"
         + "<h2 style='font-size:24px'>" + t("okTitle") + "</h2>"
         + "<p class='az-sub'>" + t("okBody") + "</p>"
         + "<a class='az-wa' href='https://wa.me/" + AZ_CONFIG.WHATSAPP + "?text=" + waText + "'>"
         + t("okWa") + "</a><br>"
         + "<button type='button' class='az-btn' style='margin-top:14px;max-width:240px' data-act='again'>"
         + t("okAgain") + "</button></div>";
      root.innerHTML = h; bind(); return;
    }

    h += "<div class='az-steps'>"
       + "<div class='az-step" + (S.step===1?" on":"") + "'>" + t("step1") + "</div>"
       + "<div class='az-step" + (S.step===2?" on":"") + "'>" + t("step2") + "</div>"
       + "<div class='az-step" + (S.step===3?" on":"") + "'>" + t("step3") + "</div></div>";

    if (S.step === 1){
      if (S.services === null){
        h += "<div class='az-skel'></div><div class='az-skel'></div><div class='az-skel'></div>";
      } else if (!S.services.length){
        h += "<p class='az-err'>" + t("svcFail") + "</p>"
           + "<div class='az-row'><button type='button' class='az-btn pri' data-act='reload'>"
           + t("retry") + "</button></div>";
      } else {
        S.services.forEach(function(s, i){
          h += "<button type='button' class='az-card" + (S.svc && S.svc.id===s.id ? " sel":"")
             + "' data-act='svc' data-i='" + i + "'>"
             + "<span><span class='n'>" + esc(s.name) + "</span><br>"
             + "<span class='m'>" + s.duration_min + " " + t("min") + "</span></span>"
             + "<span class='p'>" + Number(s.price).toFixed(0) + " " + t("jod") + "</span></button>";
        });
        h += "<div class='az-row'><button type='button' class='az-btn pri' data-act='to2'"
           + (S.svc ? "" : " disabled") + ">" + t("next") + "</button></div>";
      }
    }

    if (S.step === 2){
      h += "<label>" + t("date") + "</label><select data-act='date'>";
      dates().forEach(function(d){
        h += "<option value='" + d + "'" + (S.date===d?" selected":"") + ">" + fmtDate(d) + "</option>";
      });
      h += "</select>";
      h += "<label>" + t("prefLabel") + "</label><select data-act='gender'>"
         + "<option value=''>" + t("anyGender") + "</option>"
         + "<option value='female'" + (S.gender==="female"?" selected":"") + ">" + t("female") + "</option>"
         + "<option value='male'" + (S.gender==="male"?" selected":"") + ">" + t("male") + "</option>"
         + "</select>";
      h += "<label>" + t("time") + "</label>";
      if (S.slots === null){
        h += "<p class='az-note'>" + t("slotsLoad") + "</p>";
      } else if (S.slots === false){
        h += "<div class='az-slots'>";
        ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"]
          .forEach(function(tm){
            h += "<button type='button' class='az-slot" + (S.slot && S.slot.manual===tm ? " sel":"")
               + "' data-act='mslot' data-t='" + tm + "'>" + tm + "</button>";
          });
        h += "</div><p class='az-note'>" + t("slotsFallback") + "</p>";
      } else if (!S.slots.length){
        h += "<p class='az-note'>" + t("slotsNone") + "</p>";
      } else {
        h += "<div class='az-slots'>";
        S.slots.forEach(function(sl, i){
          h += "<button type='button' class='az-slot" + (S.slot===sl ? " sel":"")
             + "' data-act='slot' data-i='" + i + "'>" + fmtTime(sl.start) + "</button>";
        });
        h += "</div>";
      }
      h += "<div class='az-row'>"
         + "<button type='button' class='az-btn' data-act='back1'>" + t("back") + "</button>"
         + "<button type='button' class='az-btn pri' data-act='to3'"
         + (S.slot ? "" : " disabled") + ">" + t("next") + "</button></div>";
    }

    if (S.step === 3){
      h += "<label>" + t("name") + "</label><input id='az-name' autocomplete='name'>"
         + "<label>" + t("phone") + "</label>"
         + "<input id='az-phone' inputmode='tel' autocomplete='tel' dir='ltr' placeholder='07XXXXXXXX'>"
         + "<label>" + t("notes") + "</label><textarea id='az-notes' rows='2'></textarea>"
         + "<input class='az-hp' id='az-web' tabindex='-1' autocomplete='off'>"
         + "<p class='az-err' id='az-msg'></p>"
         + "<div class='az-row'>"
         + "<button type='button' class='az-btn' data-act='back2'>" + t("back") + "</button>"
         + "<button type='button' class='az-btn pri' data-act='send'"
         + (S.sending ? " disabled" : "") + ">"
         + (S.sending ? t("sending") : t("submit")) + "</button></div>";
    }

    root.innerHTML = h;
    bind();
  }

  function bind(){
    root.querySelectorAll("[data-act]").forEach(function(el){
      var act = el.dataset.act;
      var ev = (el.tagName === "SELECT") ? "change" : "click";
      el.addEventListener(ev, function(){
        if (act === "lang"){ S.lang = (S.lang === "en" ? "ar" : "en"); render(); }
        if (act === "reload") loadServices();
        if (act === "svc"){ S.svc = S.services[+el.dataset.i]; render(); }
        if (act === "to2"){ S.step = 2; if(!S.date) S.date = dates()[0]; render(); loadSlots(); }
        if (act === "date"){ S.date = el.value; loadSlots(); }
        if (act === "gender"){ S.gender = el.value; loadSlots(); }
        if (act === "slot"){ S.slot = S.slots[+el.dataset.i]; render(); }
        if (act === "mslot"){ S.slot = { manual: el.dataset.t }; render(); }
        if (act === "back1"){ S.step = 1; render(); }
        if (act === "back2"){ S.step = 2; render(); }
        if (act === "to3"){ S.step = 3; render(); }
        if (act === "send") submit();
        if (act === "again"){ S.step=1; S.svc=null; S.slot=null; S.done=null; render(); }
      });
    });
  }

  function submit(){
    var name  = (document.getElementById("az-name")  || {}).value || "";
    var phone = (document.getElementById("az-phone") || {}).value || "";
    var notes = (document.getElementById("az-notes") || {}).value || "";
    var hp    = (document.getElementById("az-web")   || {}).value || "";
    var msg   = document.getElementById("az-msg");
    if (hp) return;
    if (!name.trim()){ msg.textContent = t("nameBad"); return; }
    if (!jordanPhoneOk(phone)){ msg.textContent = t("phoneBad"); return; }
    msg.textContent = "";
    var body = {
      name: name.trim(),
      phone: toE164(phone),
      whatsapp_optin: true,
      service_id: S.svc.id,
      preferred_date: S.date,
      preferred_time: S.slot.manual ? S.slot.manual : fmtTime(S.slot.start).slice(0,5),
      preferred_staff_gender: S.gender || null,
      notes: notes.trim(),
      source: "embed_widget",
      lang: S.lang
    };
    if (!S.slot.manual){
      body.slot_start  = S.slot.start;
      body.staff_id    = S.slot.therapist_id;
      body.resource_id = S.slot.resource_id;
    }
    S.sending = true; render();
    fetch(AZ_CONFIG.API_BASE + "/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body)
    }).then(function(r){
      if (!r.ok) throw 0; return r.json();
    }).then(function(d){
      S.sending = false;
      S.done = d.appointment_id || "—";
      render();
    }).catch(function(){
      S.sending = false; render();
      var m = document.getElementById("az-msg");
      if (m) m.textContent = t("submitFail");
    });
  }

  loadServices();
})();
`;
}
