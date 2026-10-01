/* ===== EDIT THESE: photos (put files in the images/ folder) ===== */
const photos = [
  "./images/Picture 1.png",
  "./images/Picture 3.jpg",
  "./images/Picture 2.png",
  "./images/Picture 4.jpg",
  "./images/Picture 5.jpg"
];
const captions = ["Your picture ✨"," A cat (for u)😺","This one is also u 💖 ","I don't know what to add✨","This is me (just a joke) 🤣"];

const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- background particles ----- */
const symbols = ['✦','·','</>','🐾','{ }','✧'], colors = ['#a78bfa','#f472b6','#60a5fa','#22d3ee'];
if (!reduce) for (let i = 0; i < 26; i++) {
  const s = document.createElement('span');
  s.textContent = symbols[i % symbols.length];
  s.style.cssText = `left:${Math.random()*100}%;--s:${10+Math.random()*14}px;--c:${colors[i%4]};--d:${14+Math.random()*16}s;--dl:${-Math.random()*20}s`;
  $('#bg').appendChild(s);
}

/* ----- cat drawing (SVG, no external image) ----- */
const catSVG = `<svg viewBox="0 0 130 120" aria-hidden="true">
  <path class="tail" d="M100 95 C135 95 135 50 118 48" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="65" cy="98" rx="38" ry="20" fill="currentColor"/>
  <polygon class="ear l" points="27,42 30,8 55,28" fill="currentColor"/>
  <polygon class="ear r" points="103,42 100,8 75,28" fill="currentColor"/>
  <circle cx="65" cy="58" r="38" fill="currentColor"/>
  <ellipse cx="52" cy="55" rx="4.5" ry="6" fill="#1a1240"/><ellipse cx="78" cy="55" rx="4.5" ry="6" fill="#1a1240"/>
  <circle cx="53.5" cy="52.5" r="1.6" fill="#fff"/><circle cx="79.5" cy="52.5" r="1.6" fill="#fff"/>
  <path d="M61 67 h8 l-4 5z" fill="#f472b6"/><path d="M65 72 q-6 6 -11 2 M65 72 q6 6 11 2" fill="none" stroke="#1a1240" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M40 66 h-20 M40 72 l-18 5 M90 66 h20 M90 72 l18 5" stroke="#1a1240" stroke-opacity=".4" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
document.querySelectorAll('[data-cat]').forEach(el => {
  el.innerHTML = catSVG;
  const v = el.dataset.cat; if (v === 'b' || v === 'c') el.classList.add(v);
  if (el.classList.contains('hov')) el.addEventListener('mouseenter', () => hearts(el));
});
function hearts(el) {
  for (let i = 0; i < 3; i++) {
    const h = document.createElement('span');
    h.className = 'heart'; h.textContent = ['💜','✨','💖'][i];
    h.style.left = 20 + Math.random()*60 + '%';
    el.appendChild(h); setTimeout(() => h.remove(), 1000);
  }
}

/* ----- photos ----- */
photos.forEach((src, i) => {
  const f = document.createElement('figure'); f.className = 'photo';
  f.innerHTML = `<img src="${src}" alt="Memory ${i+1}" loading="lazy"><p>${captions[i]}</p>`;
  f.querySelector('img').onerror = e => { e.target.src = "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'><rect width='400' height='500' fill='#2a1f5e'/><text x='200' y='240' font-size='64' text-anchor='middle'>📸</text><text x='200' y='300' fill='#c4bfe6' font-family='sans-serif' font-size='22' text-anchor='middle'>photo${i+1}</text></svg>`); };
  $('#gallery').appendChild(f);
});

/* ----- flow: landing -> cat intro -> main (same page, no reload) ----- */
function swap(from, to, done) {
  from.classList.add('fade-out');
  setTimeout(() => {
    from.classList.add('hidden');
    to.classList.remove('hidden');
    to.classList.add('fade-in');
    if (done) done();
  }, reduce ? 0 : 650);
}

$('#openBtn').addEventListener('click', () => {
  swap($('#landing'), $('#intro'), runIntro);
});

/* cat screen sequence: cat -> Hey -> Happy Birthday -> message -> Continue */
function runIntro() {
  const times = [1000, 2200, 3400, 4600];           // ms after the cat appears; edit to speed up/slow down
  ['#step1', '#step2', '#step3', '#continueBtn'].forEach((sel, i) =>
    setTimeout(() => $(sel).classList.add('show'), times[i]));
}

$('#continueBtn').addEventListener('click', () => {
  swap($('#intro'), $('#main'), () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    watch();
  });
});

/* ----- reveal + code typing ----- */
const code = `<span class="k">function</span> birthdayWish() {
    happiness<span class="n">++</span>;
    creativity<span class="n">++</span>;
    bugs<span class="n">--</span>;
    dreams<span class="n">++</span>;

    <span class="k">return</span> <span class="s">"Have an amazing year!"</span>;
}`;
let typed = false;
function typeCode() {
  if (typed) return; typed = true;
  const el = $('#code'); if (reduce) { el.innerHTML = code; return; }
  let i = 0;
  (function step() {
    if (code[i] === '<') i = code.indexOf('>', i);   // never split an HTML tag
    el.innerHTML = code.slice(0, ++i);
    if (i < code.length) setTimeout(step, 28);
  })();
}
function watch() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.querySelector('#code')) typeCode();
  }), { threshold: .2 });
  document.querySelectorAll('.reveal').forEach(s => io.observe(s));
}

/* ----- final surprise ----- */
$('#finalBtn').onclick = () => {
  $('#finalPre').classList.add('hidden');
  $('#finalMsg').classList.remove('hidden');
  $('#finalMsg').classList.add('fade-in');
  if (!reduce) confetti();
  $('#finalMsg').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
};

/* ----- confetti (canvas, no library) ----- */
function confetti() {
  const c = $('#confetti'), x = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const cols = ['#a78bfa','#f472b6','#60a5fa','#22d3ee','#fde68a','#fff'];
  const ps = Array.from({ length: 160 }, () => ({
    x: Math.random()*c.width, y: -20 - Math.random()*c.height*.6,
    w: 6 + Math.random()*7, h: 8 + Math.random()*8, v: 2 + Math.random()*4,
    r: Math.random()*6, vr: (Math.random()-.5)*.3, dx: (Math.random()-.5)*2, col: cols[Math.floor(Math.random()*cols.length)]
  }));
  let t = 0;
  (function frame() {
    x.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.y += p.v; p.x += p.dx; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.col; x.fillRect(-p.w/2, -p.h/2, p.w, p.h); x.restore(); });
    if (++t < 320) requestAnimationFrame(frame); else x.clearRect(0, 0, c.width, c.height);
  })();
}
