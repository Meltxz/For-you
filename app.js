/* ════════════════════════════════════════════════════════════════
   FOR YOU ❤️ — Interactive Love Experience
   ════════════════════════════════════════════════════════════════ */

// ── Configuration ──
const CONFIG = {
    poemLines: [
        "In a universe of endless stars,",
        "my heart found its way to yours.",
        "Every moment with you",
        "is a constellation of joy,",
        "a melody I never want to end.",
        "You are my favorite hello",
        "and my hardest goodbye."
    ],
    reasons: [
        { emoji: "✨", text: "The way your smile lights up every room you walk into" },
        { emoji: "🌙", text: "How you make even the ordinary moments feel magic" },
        { emoji: "🦋", text: "Your kindness that touches everyone around you" },
        { emoji: "🌹", text: "The sound of your laugh — my favorite melody" },
        { emoji: "💫", text: "How you believe in me, even when I don't believe in myself" },
        { emoji: "🌊", text: "The way you make the world feel calm and safe" },
        { emoji: "🔥", text: "Your passion that inspires me to be better every day" },
        { emoji: "🌸", text: "Because every love story is beautiful, but ours is my favorite" }
    ],
    finaleText: "I Love You",
    finaleSub: "Today, tomorrow, and every day after that.",
    heartParticleCount: 300,
    starCount: 150
};

// ── State ──
let currentScene = 0;
let currentReason = 0;
let reasonInterval = null;
let audioCtx = null;
let isAudioPlaying = false;

// ── DOM Refs ──
const scenes = document.querySelectorAll('.scene');
const envelope = document.getElementById('envelope');
const heartCanvas = document.getElementById('heartCanvas');
const galaxyCanvas = document.getElementById('galaxyCanvas');
const fireworksCanvas = document.getElementById('fireworksCanvas');
const messageOverlay = document.getElementById('messageOverlay');
const reasonsOverlay = document.getElementById('reasonsOverlay');
const finaleOverlay = document.getElementById('finaleOverlay');
const loveTitle = document.getElementById('loveTitle');
const lovePoem = document.getElementById('lovePoem');
const reasonsCarousel = document.getElementById('reasonsCarousel');
const carouselDots = document.getElementById('carouselDots');
const floatingHeartsContainer = document.getElementById('floatingHearts');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');

// ════════════════════════════════════════════════════════════════
//  STARS BACKGROUND
// ════════════════════════════════════════════════════════════════
function createStars() {
    const container = document.getElementById('stars-bg-1');
    for (let i = 0; i < CONFIG.starCount; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 3 + 1;
        star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: white;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.7 + 0.3};
      animation: starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.5);
    `;
        container.appendChild(star);
    }
}

// ════════════════════════════════════════════════════════════════
//  SCENE TRANSITIONS
// ════════════════════════════════════════════════════════════════
function transitionToScene(index) {
    scenes[currentScene].classList.remove('active');
    currentScene = index;
    scenes[currentScene].classList.add('active');
}

// ════════════════════════════════════════════════════════════════
//  SCENE 1: ENVELOPE
// ════════════════════════════════════════════════════════════════
function initEnvelope() {
    const container = document.querySelector('.envelope-container');
    container.addEventListener('click', () => {
        envelope.classList.add('opened');
        spawnFloatingHearts(15);
        setTimeout(() => {
            transitionToScene(1);
            initHeartScene();
        }, 1000);
    });
}

// ════════════════════════════════════════════════════════════════
//  SCENE 2: HEART PARTICLES
// ════════════════════════════════════════════════════════════════
let heartParticles = [];
let heartAnimId = null;

function initHeartScene() {
    const ctx = heartCanvas.getContext('2d');
    resizeCanvas(heartCanvas);

    const w = heartCanvas.width;
    const h = heartCanvas.height;
    const scale = Math.min(w, h) / 30;

    heartParticles = [];

    // Heart shape parametric function
    function heartX(t) { return 16 * Math.pow(Math.sin(t), 3); }
    function heartY(t) {
        return -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    }

    for (let i = 0; i < CONFIG.heartParticleCount; i++) {
        const t = (Math.PI * 2 * i) / CONFIG.heartParticleCount;
        const targetX = w / 2 + heartX(t) * scale;
        const targetY = h / 2 + heartY(t) * scale - 20;

        heartParticles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            targetX,
            targetY,
            size: Math.random() * 3 + 1.5,
            speed: Math.random() * 0.02 + 0.01,
            hue: Math.random() * 30 + 340,  // pink-red range
            glow: Math.random() * 0.5 + 0.5,
            progress: 0
        });
    }

    function animateHeart() {
        ctx.fillStyle = 'rgba(10, 0, 20, 0.08)';
        ctx.fillRect(0, 0, w, h);

        let allArrived = true;

        heartParticles.forEach(p => {
            p.progress += p.speed;
            if (p.progress > 1) p.progress = 1;
            else allArrived = false;

            const ease = 1 - Math.pow(1 - p.progress, 3);
            p.x = p.x + (p.targetX - p.x) * ease * 0.05;
            p.y = p.y + (p.targetY - p.y) * ease * 0.05;

            // wobble when arrived
            const wobbleX = p.progress > 0.9 ? Math.sin(Date.now() * 0.003 + p.hue) * 1.5 : 0;
            const wobbleY = p.progress > 0.9 ? Math.cos(Date.now() * 0.002 + p.hue) * 1.5 : 0;

            const alpha = 0.5 + p.glow * 0.5;
            ctx.beginPath();
            ctx.arc(p.x + wobbleX, p.y + wobbleY, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
            ctx.fill();

            // glow
            ctx.beginPath();
            ctx.arc(p.x + wobbleX, p.y + wobbleY, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha * 0.15})`;
            ctx.fill();
        });

        heartAnimId = requestAnimationFrame(animateHeart);

        if (allArrived && !messageOverlay.classList.contains('visible')) {
            setTimeout(() => showMessage(), 500);
        }
    }

    animateHeart();
}

function showMessage() {
    messageOverlay.classList.add('visible');
    typeText(loveTitle, "To Someone Special...", 60);

    setTimeout(() => {
        CONFIG.poemLines.forEach((line, i) => {
            const span = document.createElement('span');
            span.className = 'line';
            span.textContent = line;
            span.style.animationDelay = `${i * 0.4}s`;
            lovePoem.appendChild(span);
        });
    }, 1800);
}

function typeText(el, text, speed) {
    let i = 0;
    el.textContent = '';
    function type() {
        if (i < text.length) {
            el.textContent += text[i];
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ════════════════════════════════════════════════════════════════
//  SCENE 3: GALAXY + REASONS
// ════════════════════════════════════════════════════════════════
let galaxyStars = [];
let galaxyAnimId = null;

function initReasonsScene() {
    const ctx = galaxyCanvas.getContext('2d');
    resizeCanvas(galaxyCanvas);

    const w = galaxyCanvas.width;
    const h = galaxyCanvas.height;

    // Create galaxy stars
    galaxyStars = [];
    for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.min(w, h) * 0.5;
        galaxyStars.push({
            angle,
            dist,
            speed: (Math.random() * 0.0005 + 0.0001) * (Math.random() > 0.5 ? 1 : -1),
            size: Math.random() * 2.5 + 0.5,
            hue: Math.random() * 60 + 280, // purple-pink range
            brightness: Math.random() * 0.5 + 0.5
        });
    }

    function animateGalaxy() {
        ctx.fillStyle = 'rgba(10, 0, 20, 0.05)';
        ctx.fillRect(0, 0, w, h);

        galaxyStars.forEach(s => {
            s.angle += s.speed;
            const x = w / 2 + Math.cos(s.angle) * s.dist;
            const y = h / 2 + Math.sin(s.angle) * s.dist * 0.6;

            const pulse = Math.sin(Date.now() * 0.002 + s.angle) * 0.3 + 0.7;

            ctx.beginPath();
            ctx.arc(x, y, s.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${s.brightness * pulse})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, s.size * 3 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${s.brightness * pulse * 0.1})`;
            ctx.fill();
        });

        galaxyAnimId = requestAnimationFrame(animateGalaxy);
    }

    animateGalaxy();
    buildReasonsCarousel();

    setTimeout(() => {
        reasonsOverlay.classList.add('visible');
    }, 500);
}

function buildReasonsCarousel() {
    reasonsCarousel.innerHTML = '';
    carouselDots.innerHTML = '';

    CONFIG.reasons.forEach((reason, i) => {
        const card = document.createElement('div');
        card.className = `reason-card ${i === 0 ? 'active' : ''}`;
        card.innerHTML = `
      <span class="reason-emoji">${reason.emoji}</span>
      <p class="reason-text">${reason.text}</p>
    `;
        reasonsCarousel.appendChild(card);

        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => showReason(i));
        carouselDots.appendChild(dot);
    });

    // Auto-advance
    reasonInterval = setInterval(() => {
        showReason((currentReason + 1) % CONFIG.reasons.length);
    }, 4000);
}

function showReason(index) {
    const cards = document.querySelectorAll('.reason-card');
    const dots = document.querySelectorAll('.carousel-dot');

    cards[currentReason]?.classList.remove('active');
    dots[currentReason]?.classList.remove('active');

    currentReason = index;

    cards[currentReason]?.classList.add('active');
    dots[currentReason]?.classList.add('active');

    spawnFloatingHearts(3);
}

// ════════════════════════════════════════════════════════════════
//  SCENE 4: FIREWORKS FINALE
// ════════════════════════════════════════════════════════════════
let fireworks = [];
let fwParticles = [];
let fireworksAnimId = null;

function initFinale() {
    if (reasonInterval) clearInterval(reasonInterval);

    const ctx = fireworksCanvas.getContext('2d');
    resizeCanvas(fireworksCanvas);

    const w = fireworksCanvas.width;
    const h = fireworksCanvas.height;

    function spawnFirework() {
        const x = Math.random() * w * 0.6 + w * 0.2;
        const y = Math.random() * h * 0.4 + h * 0.1;
        const hue = Math.random() * 60 + 320; // pink-magenta
        const count = 60 + Math.floor(Math.random() * 40);

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 4 + 2;
            fwParticles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: Math.random() * 0.015 + 0.008,
                hue: hue + Math.random() * 30 - 15,
                size: Math.random() * 3 + 1.5,
                trail: []
            });
        }
    }

    function animateFireworks() {
        ctx.fillStyle = 'rgba(10, 0, 20, 0.12)';
        ctx.fillRect(0, 0, w, h);

        fwParticles.forEach(p => {
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 6) p.trail.shift();

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.03; // gravity
            p.vx *= 0.99;
            p.life -= p.decay;

            // Draw trail
            p.trail.forEach((t, i) => {
                const alpha = (i / p.trail.length) * p.life * 0.3;
                ctx.beginPath();
                ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
                ctx.fill();
            });

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life})`;
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life * 0.1})`;
            ctx.fill();
        });

        fwParticles = fwParticles.filter(p => p.life > 0);

        fireworksAnimId = requestAnimationFrame(animateFireworks);
    }

    animateFireworks();

    // Firework bursts
    let burstCount = 0;
    const burstInterval = setInterval(() => {
        spawnFirework();
        spawnFloatingHearts(5);
        burstCount++;
        if (burstCount > 20) {
            clearInterval(burstInterval);
            // Continue with slower periodic bursts
            setInterval(() => {
                spawnFirework();
                spawnFloatingHearts(2);
            }, 3000);
        }
    }, 600);

    // Show finale text
    setTimeout(() => {
        finaleOverlay.classList.add('visible');
        typeText(document.getElementById('finaleText'), CONFIG.finaleText, 120);
        setTimeout(() => {
            document.getElementById('finaleSub').textContent = CONFIG.finaleSub;
        }, CONFIG.finaleText.length * 120 + 500);
    }, 1500);
}

// ════════════════════════════════════════════════════════════════
//  FLOATING HEARTS
// ════════════════════════════════════════════════════════════════
function spawnFloatingHearts(count) {
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '🩷', '🤍'];
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.className = 'float-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.setProperty('--delay', `${Math.random() * 2}s`);
        heart.style.setProperty('--duration', `${Math.random() * 3 + 4}s`);
        heart.style.setProperty('--rotate', `${Math.random() * 60 - 30}deg`);
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.bottom = `-20px`;
        heart.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
        floatingHeartsContainer.appendChild(heart);

        // Cleanup
        setTimeout(() => heart.remove(), 7000);
    }
}

// ════════════════════════════════════════════════════════════════
//  AMBIENT AUDIO (Web Audio API — simple warm tones)
// ════════════════════════════════════════════════════════════════
function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playAmbient() {
    if (!audioCtx) initAudio();

    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.08;
    masterGain.connect(audioCtx.destination);

    // Soft pad chord: C4, E4, G4, B4
    const frequencies = [261.63, 329.63, 392.00, 493.88];

    frequencies.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.03;

        // Gentle LFO for warmth
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.value = 0.5 + i * 0.1;
        lfoGain.gain.value = 2;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();

        // Fade in
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 2);
    });

    isAudioPlaying = true;
    audioIcon.textContent = '🔊';
}

function stopAudio() {
    if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
    }
    isAudioPlaying = false;
    audioIcon.textContent = '🔇';
}

// ════════════════════════════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════════════════════════════
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

// ════════════════════════════════════════════════════════════════
//  EVENT LISTENERS
// ════════════════════════════════════════════════════════════════
document.getElementById('nextBtn').addEventListener('click', () => {
    if (heartAnimId) cancelAnimationFrame(heartAnimId);
    transitionToScene(2);
    initReasonsScene();
});

document.getElementById('finalBtn').addEventListener('click', () => {
    if (galaxyAnimId) cancelAnimationFrame(galaxyAnimId);
    transitionToScene(3);
    initFinale();
});

audioToggle.addEventListener('click', () => {
    if (isAudioPlaying) {
        stopAudio();
    } else {
        playAmbient();
    }
});

window.addEventListener('resize', () => {
    if (currentScene === 1) {
        resizeCanvas(heartCanvas);
    } else if (currentScene === 2) {
        resizeCanvas(galaxyCanvas);
    } else if (currentScene === 3) {
        resizeCanvas(fireworksCanvas);
    }
});

// ════════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════════
function init() {
    createStars();
    initEnvelope();
}

init();
