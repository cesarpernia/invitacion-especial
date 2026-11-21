"use strict";

const cfg = window.INVITACION_CONFIG;
const $ = (selector) => document.querySelector(selector);
const landing = $('#landing');
const questionsScreen = $('#questionsScreen');
const finalScreen = $('#finalScreen');
const surpriseScreen = $('#surpriseScreen');
const questionCard = $('#questionCard');
const yesButton = $('#yesButton');
const noButton = $('#noButton');
const responseStage = $('#responseStage');
const statusMessage = $('#statusMessage');
const photoGallery = $('#photoGallery');
let currentStep = 0;
let escapes = 0;
let moving = false;
let giftOpened = false;

function applyStaticCopy() {
  const title = $('#heroTitle');
  title.replaceChildren();
  cfg.bienvenida.forEach(line => {
    const span = document.createElement('span');
    span.textContent = line;
    title.append(span);
  });

  const intro = $('#invitationTitle');
  intro.replaceChildren();
  (cfg.invitacionLineas ?? []).forEach((line, index) => {
    if (index) intro.append(document.createElement('br'));
    intro.append(document.createTextNode(line));
  });

  $('#invitationSummary').textContent = cfg.resumenAventura || '';
  $('#mapCaption').textContent = cfg.mapaPie || '';
  $('#startQuestions').childNodes[0].textContent = (cfg.botonContinuar || 'Continuar') + ' ';

  $('#finalTitle').textContent = cfg.final.titulo;
  $('#finalMessage').textContent = cfg.final.mensaje;
  $('#openGiftButton').childNodes[0].textContent = (cfg.final.botonRegalo || 'Abre tu regalo sorpresa') + ' ';

  $('#surpriseTitle').textContent = cfg.regalo.titulo;
  $('#surpriseSubtitle').textContent = cfg.regalo.subtitulo;
  $('#giftMessage').textContent = cfg.regalo.mensaje;
}

function smoothTo(element) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

function makeImage(src, alt, className = '') {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.decoding = 'async';
  img.className = className;
  return img;
}

function paintGallery(images) {
  photoGallery.replaceChildren();
  photoGallery.classList.toggle('photo-gallery--single', images.length === 1);
  images.forEach((src, i) => {
    const frame = document.createElement('div');
    frame.className = 'photo-frame';
    frame.append(makeImage(src, `Gatito animado ${i + 1}`, 'kitty-image'));
    photoGallery.append(frame);
  });
}

function paintDots() {
  const parent = $('#stepDots');
  parent.replaceChildren();
  cfg.preguntas.forEach((step, i) => {
    const dot = document.createElement('span');
    dot.className = i === currentStep ? 'step-dot step-dot--active' : 'step-dot';
    dot.setAttribute('aria-label', `Pregunta ${i + 1}${i === currentStep ? ', actual' : ''}`);
    parent.append(dot);
  });
}

function resetNo() {
  escapes = 0;
  moving = false;
  noButton.textContent = cfg.respuestasNo[0] ?? 'No';
  noButton.style.left = '';
  noButton.style.top = '';
  noButton.classList.remove('no-moving');
  yesButton.style.transform = '';
  statusMessage.textContent = '';
}

function paintQuestion() {
  const step = cfg.preguntas[currentStep];
  resetNo();
  $('#questionLabel').textContent = step.etiqueta;
  $('#stepCounter').textContent = `${currentStep + 1} / ${cfg.preguntas.length}`;
  $('#questionTitle').textContent = step.texto;
  $('#questionSubtitle').textContent = step.subtitulo;
  paintGallery(step.imagenes);
  paintDots();
  questionCard.classList.remove('question-enter');
  void questionCard.offsetWidth;
  questionCard.classList.add('question-enter');
}

function showQuestions() {
  landing.hidden = true;
  finalScreen.hidden = true;
  surpriseScreen.hidden = true;
  questionsScreen.hidden = false;
  currentStep = 0;
  paintQuestion();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function isOverlapping(x, y, width, height, other) {
  const gap = 14;
  return x < other.x + other.w + gap && x + width + gap > other.x &&
         y < other.y + other.h + gap && y + height + gap > other.y;
}

function dodgeNo(event) {
  if (questionsScreen.hidden || moving) return;
  if (event && event.cancelable && event.type === 'touchstart') event.preventDefault();
  escapes += 1;
  noButton.textContent = cfg.respuestasNo[Math.min(escapes, cfg.respuestasNo.length - 1)];
  if (escapes === 2) statusMessage.textContent = 'Mmm… ese botón parece querer llevarte de compras sí o sí.';
  if (escapes === 5) statusMessage.textContent = 'Creo que el universo y los regalitos están votando por el sí. ♡';

  const area = responseStage.getBoundingClientRect();
  const yes = yesButton.getBoundingClientRect();
  const no = noButton.getBoundingClientRect();
  const w = no.width;
  const h = no.height;
  const maxX = Math.max(0, area.width - w - 6);
  const maxY = Math.max(0, area.height - h - 6);
  const occupied = { x: yes.left - area.left, y: yes.top - area.top, w: yes.width, h: yes.height };

  let target = { x: maxX, y: maxY };
  for (let i = 0; i < 35; i++) {
    const x = 5 + Math.random() * Math.max(0, maxX - 5);
    const y = 4 + Math.random() * Math.max(0, maxY - 4);
    const farFromCurrent = Math.hypot(x - (no.left - area.left), y - (no.top - area.top)) > 62;
    if (!isOverlapping(x, y, w, h, occupied) && farFromCurrent) {
      target = { x, y };
      break;
    }
  }
  moving = true;
  noButton.classList.add('no-moving');
  noButton.style.left = `${Math.round(target.x)}px`;
  noButton.style.top = `${Math.round(target.y)}px`;
  const scale = Math.min(1.18, 1 + escapes * 0.026);
  yesButton.style.transform = `scale(${scale})`;
  window.setTimeout(() => {
    moving = false;
    noButton.classList.remove('no-moving');
  }, 220);
}

function advance() {
  if (currentStep < cfg.preguntas.length - 1) {
    currentStep += 1;
    paintQuestion();
  } else {
    showFinal();
  }
}

function showFinal() {
  questionsScreen.hidden = true;
  surpriseScreen.hidden = true;
  finalScreen.hidden = false;
  const photos = $('#finalPhotos');
  photos.replaceChildren();
  cfg.final.imagenes.forEach((src, i) => {
    const photo = document.createElement('div');
    photo.className = 'final-photo';
    photo.append(makeImage(src, `Gatito celebrando ${i + 1}`, 'final-kitty'));
    photos.append(photo);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  throwConfetti('confettiLayer');
}

function showSurprise() {
  finalScreen.hidden = true;
  surpriseScreen.hidden = false;
  resetGiftBox();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function paintGiftCards() {
  const host = $('#giftCards');
  host.replaceChildren();
  cfg.regalo.imagenes.forEach((src, i) => {
    const item = document.createElement('figure');
    item.className = 'gift-card-image';
    item.append(makeImage(src, `Tarjeta de regalo sorpresa ${i + 1}`, 'gift-card-art'));
    host.append(item);
  });
}

function resetGiftBox() {
  giftOpened = false;
  const giftButton = $('#giftBoxButton');
  giftButton.classList.remove('opened');
  $('#giftReveal').hidden = true;
  $('#giftHint').hidden = false;
  paintGiftCards();
}

function openGiftBox() {
  if (giftOpened) return;
  giftOpened = true;
  const giftButton = $('#giftBoxButton');
  giftButton.classList.add('opened');
  $('#giftHint').hidden = true;
  window.setTimeout(() => {
    $('#giftReveal').hidden = false;
    throwConfetti('surpriseConfettiLayer');
  }, 600);
}

function throwConfetti(layerId = 'confettiLayer') {
  const host = $('#' + layerId);
  if (!host) return;
  host.replaceChildren();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#e7b8bf', '#e9c174', '#e4e9da', '#a4cbb1', '#d89da9'];
  for (let i = 0; i < 80; i++) {
    const flake = document.createElement('span');
    flake.className = 'confetti';
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.backgroundColor = colors[i % colors.length];
    flake.style.animationDelay = `${Math.random() * 1.7}s`;
    flake.style.animationDuration = `${3 + Math.random() * 3}s`;
    flake.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 240)}px`);
    host.append(flake);
  }
  window.setTimeout(() => host.replaceChildren(), 7200);
}

function restart() {
  finalScreen.hidden = true;
  questionsScreen.hidden = true;
  surpriseScreen.hidden = true;
  landing.hidden = false;
  currentStep = 0;
  resetNo();
  resetGiftBox();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

applyStaticCopy();
$('#openInvitation').addEventListener('click', () => smoothTo($('#invitacion')));
$('#startQuestions').addEventListener('click', showQuestions);
yesButton.addEventListener('click', advance);
noButton.addEventListener('pointerenter', (event) => {
  if (event.pointerType !== 'touch') dodgeNo(event);
});
noButton.addEventListener('touchstart', dodgeNo, { passive: false });
noButton.addEventListener('click', dodgeNo);
$('#openGiftButton').addEventListener('click', showSurprise);
$('#giftBoxButton').addEventListener('click', openGiftBox);
$('#replayButton').addEventListener('click', restart);
$('#replayFromGift').addEventListener('click', restart);
