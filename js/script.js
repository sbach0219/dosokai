/* ============================================================
   同窓会サイト JavaScript
   ★ まずはこの CONFIG を書き換えるだけでOK ★
   ============================================================ */
const CONFIG = {
  // 開催日時（年, 月, 日, 時, 分）※月は 1〜12 でそのまま書いてOK
  eventDate: new Date(2027, 1 - 1, 11, 17, 30),
};

/* ---------- カウントダウン ---------- */
function updateCountdown() {
  const now = new Date();
  let diff = CONFIG.eventDate - now;

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  if (diff <= 0) {
    // 開催日を過ぎたら 0 表示
    daysEl.textContent = "0";
    hoursEl.textContent = "00";
    minsEl.textContent = "00";
    secsEl.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const mins = Math.floor(diff / (1000 * 60)) % 60;
  const secs = Math.floor(diff / 1000) % 60;

  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, "0");
  minsEl.textContent = String(mins).padStart(2, "0");
  secsEl.textContent = String(secs).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- スマホ用ハンバーガーメニュー ---------- */
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("is-open");
  nav.classList.toggle("is-open");
});

// メニュー内のリンクを押したら閉じる
nav.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("is-open");
    nav.classList.remove("is-open");
  });
});

/* ---------- Q&A アコーディオン ---------- */
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-item__q");
  const answer = item.querySelector(".faq-item__a");

  question.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    // 開くときは中身の高さぶんだけ広げる（CSSのtransitionでアニメーション）
    answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : "0";
  });
});

/* ---------- スクロールで要素をふわっと表示 ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // 一度表示したら監視を解除
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
