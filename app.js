import { videos } from './assets/videos.js';

const $ = (selector) => document.querySelector(selector);
const root = document.documentElement;
const themeButton = $('#theme-toggle');
// Theme is a browser display preference; no personal information is collected.
let savedTheme;
try { savedTheme = localStorage.getItem('hukus-theme'); } catch {}
function setTheme(dark) {
  root.dataset.theme = dark ? 'dark' : 'light';
  themeButton.textContent = dark ? '☼' : '☾';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  themeButton.setAttribute('aria-pressed', String(dark));
}
setTheme(savedTheme ? savedTheme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
themeButton.addEventListener('click', () => {
  const dark = root.dataset.theme !== 'dark';
  setTheme(dark);
  try { localStorage.setItem('hukus-theme', dark ? 'dark' : 'light'); } catch {}
});
$('#year').textContent = new Date().getFullYear();

const dialog = $('#player-dialog');
let lastFocus;
function playVideo(id, title, playlist) {
  lastFocus = document.activeElement;
  $('#player-title').textContent = title;
  $('#youtube-fallback').href = `https://www.youtube.com/watch?v=${id}${playlist ? `&list=${playlist}` : ''}`;
  const frame = document.createElement('iframe');
  frame.title = title;
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${playlist ? `&list=${playlist}` : ''}`;
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  $('#player-frame').replaceChildren(frame);
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}
$('#close-player').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => {
  $('#player-frame').replaceChildren();
  document.body.style.overflow = '';
  lastFocus?.focus();
});

// Interleave the two supplied playlists so both are represented on the first screen.
const kids = videos.filter(v => v.category === 'Kids learning');
const diaries = videos.filter(v => v.category === 'Kashmir diaries');
const catalog = [];
for(let i = 0; i < Math.max(kids.length, diaries.length); i++) {
  if (kids[i]) catalog.push(kids[i]);
  if (diaries[i]) catalog.push(diaries[i]);
}
let filter = 'all';
let limit = 6;
function makeVideoCard(video) {
  const button = document.createElement('button');
  button.className = 'video-card';
  button.setAttribute('aria-label', `Watch ${video.title}`);
  const picture = document.createElement('div');
  picture.className = 'thumbnail';
  const image = document.createElement('img');
  const original = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  image.src = `/.netlify/images?url=${encodeURIComponent(original)}&w=560&h=315&fit=cover&fm=webp`;
  image.alt = ''; image.loading = 'lazy'; image.width = 560; image.height = 315;
  image.addEventListener('error', () => { image.src = original; }, { once: true });
  const play = document.createElement('span');
  play.className = 'play-icon'; play.textContent = '▶'; play.setAttribute('aria-hidden', 'true');
  picture.append(image, play);
  const tag = document.createElement('span'); tag.className = 'video-category'; tag.textContent = video.category;
  const title = document.createElement('h3'); title.textContent = video.title;
  const channel = document.createElement('span'); channel.className = 'channel';
  const mark = document.createElement('span'); mark.className = 'channel-mark'; mark.textContent = 'hb';
  channel.append(mark, 'Hukus Bukus · Watch & learn');
  button.append(picture, tag, title, channel);
  button.addEventListener('click', () => playVideo(video.id, video.title, video.playlist));
  return button;
}
function renderVideos() {
  const query = $('#search').value.trim().toLocaleLowerCase();
  const matches = catalog.filter(v => (filter === 'all' || v.category === filter) && v.title.toLocaleLowerCase().includes(query));
  const grid = $('#video-grid');
  grid.replaceChildren(...matches.slice(0, limit).map(makeVideoCard));
  if (!matches.length) {
    const empty = document.createElement('div'); empty.className = 'empty-state';
    const heading = document.createElement('h3'); heading.textContent = 'A new discovery is just around the corner.';
    const help = document.createElement('p'); help.textContent = 'Try a different word, or choose All adventures to explore both playlists.';
    empty.append(heading, help); grid.append(empty);
  }
  $('#video-status').textContent = matches.length ? `Showing ${Math.min(limit, matches.length)} of ${matches.length} little discoveries` : 'No matching videos';
  $('#load-more').hidden = limit >= matches.length;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter; limit = 6;
  document.querySelectorAll('[data-filter]').forEach(tab => {
    const active = tab === button; tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active));
  });
  renderVideos();
}));
$('#search').addEventListener('input', () => { limit = 6; renderVideos(); });
$('#load-more').addEventListener('click', () => { limit += 6; renderVideos(); });
renderVideos();

function extractVideoId(value) {
  let url;
  try { url = new URL(value); } catch { return null; }
  if (!['http:', 'https:'].includes(url.protocol)) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  let id;
  if (host === 'youtu.be') id = url.pathname.split('/')[1];
  else if (['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'].includes(host)) {
    const parts = url.pathname.split('/').filter(Boolean);
    id = ['shorts', 'embed', 'live'].includes(parts[0]) ? parts[1] : parts[0] === 'watch' ? url.searchParams.get('v') : null;
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}
$('#video-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#video-url'); const id = extractVideoId(input.value.trim());
  if (!id) {
    $('#url-error').textContent = 'Please add a complete YouTube video link, such as https://youtu.be/o76NltZjNfg';
    input.setAttribute('aria-invalid', 'true'); input.focus(); return;
  }
  $('#url-error').textContent = ''; input.removeAttribute('aria-invalid');
  playVideo(id, 'Your little discovery');
});
$('#video-url').addEventListener('input', () => { $('#url-error').textContent = ''; $('#video-url').removeAttribute('aria-invalid'); });
const challenges = [
  'Draw your dream village. What would you add to make everyone smile?',
  'Ask an elder about a game they played as a child. Can you learn it together?',
  'Invent a new way to save water at home. Sketch your idea and explain how it works.',
  'Look at a chinar leaf. Draw its shape, then turn it into an imaginary animal.',
  'Write three questions you would ask an astronaut from Kashmir.',
  'Make a tiny storybook about helping a new friend feel welcome at school.',
  'With a grown-up, find three birds near your home. Draw what makes each one different.'
];
let challenge = 0;
$('#new-challenge').addEventListener('click', () => { challenge = (challenge + 1) % challenges.length; $('#challenge-text').textContent = challenges[challenge]; });
$('#challenge-text').setAttribute('aria-live','polite');
const places = [
  {name:'Harwan',area:'SRINAGAR FOOTHILLS',near:'Harwan Garden & Dachigam',description:'A green corner at the foot of the mountains. Discover the garden and learn about the rare hangul deer of nearby Dachigam.',motif:'harwan',query:'Harwan Garden Srinagar'},
  {name:'Burzahom',area:'A WINDOW INTO THE PAST',near:'Burzahom archaeological site',description:'An ancient settlement near Srinagar. Imagine life thousands of years ago and discover the story of Kashmir’s early homes.',motif:'burzahom',query:'Burzahom archaeological site'},
  {name:'Shalimar',area:'BY THE DAL LAKE',near:'Shalimar Bagh & Dal Lake',description:'Explore a famous Mughal garden near the Shalimar locality. Look for terraces, chinar trees, and beautiful water channels.',motif:'shalimar',query:'Shalimar Bagh Srinagar'},
  {name:'Ganderbal',area:'BEYOND SRINAGAR',near:'Tulmulla & Kheer Bhawani',description:'Follow your curiosity towards the Sind valley. Nearby Tulmulla village is home to the well-known Kheer Bhawani temple.',motif:'ganderbal',query:'Tulmulla Kheer Bhawani'}
];
const placesGrid = $('#places-grid');
places.forEach((place, index) => {
  const article = document.createElement('article'); article.className = 'place';
  const imageWrap = document.createElement('div'); imageWrap.className = 'place-image';
  const image = document.createElement('img'); image.src = `assets/${place.motif}.svg`; image.alt = `Decorative illustration inspired by ${place.name}`; image.loading = 'lazy'; image.width = 500; image.height = 310;
  const number = document.createElement('span'); number.className = 'place-number'; number.textContent = `0${index+1}`;
  imageWrap.append(image, number);
  const info = document.createElement('div'); info.className = 'place-info';
  const area = document.createElement('small'); area.textContent = place.area;
  const title = document.createElement('h3'); title.textContent = place.name;
  const desc = document.createElement('p'); desc.textContent = place.description;
  const link = document.createElement('a'); link.textContent = 'Explore the area ↗'; link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label',`Explore ${place.name}: ${place.near} on Google Maps`);
  info.append(area,title,desc,link); article.append(imageWrap,info); placesGrid.append(article);
});
