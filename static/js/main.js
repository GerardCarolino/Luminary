/* ── Photo Album — main.js ───────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initToasts();
  initFileDrop();
  initPhotoUploadForm();
  initDeleteConfirm();
  initLightbox();
});

/* ── Toasts ──────────────────────────────────────── */
function initToasts() {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  container.querySelectorAll('.toast').forEach(toast => {
    const btn = toast.querySelector('.toast-dismiss');
    if (btn) btn.addEventListener('click', () => dismissToast(toast));
    setTimeout(() => dismissToast(toast), 5200);
  });
}

function dismissToast(toast) {
  toast.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(10px) scale(0.97)';
  setTimeout(() => toast.remove(), 230);
}

/* ── File Drop Zone ───────────────────────────────── */
function initFileDrop() {
  document.querySelectorAll('.file-drop').forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    const label = zone.querySelector('.file-drop-label');
    if (!input) return;

    zone.addEventListener('dragenter', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', e => { if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        updateFileLabel(label, e.dataTransfer.files);
      }
    });

    input.addEventListener('change', () => updateFileLabel(label, input.files));
  });
}

function updateFileLabel(label, files) {
  if (!label || !files.length) return;
  if (files.length === 1) {
    label.textContent = files[0].name;
  } else {
    label.textContent = `${files.length} files selected`;
  }
}

/* ── Photo Upload Form ────────────────────────────── */
function initPhotoUploadForm() {
  const form = document.getElementById('photo-upload-form');
  if (!form) return;

  const bar   = form.querySelector('.upload-bar');
  const fill  = form.querySelector('.upload-fill');
  const btn   = form.querySelector('[type="submit"]');

  form.addEventListener('submit', () => {
    if (bar)  { bar.style.display = 'block'; animateBar(fill); }
    if (btn)  { btn.disabled = true; btn.textContent = 'Uploading…'; }
  });
}

function animateBar(fill) {
  if (!fill) return;
  let w = 0;
  const id = setInterval(() => {
    w = Math.min(w + (Math.random() * 6 + 2), 90);
    fill.style.width = w + '%';
    if (w >= 90) clearInterval(id);
  }, 200);
}

/* ── Delete Confirm ───────────────────────────────── */
function initDeleteConfirm() {
  document.querySelectorAll('[data-confirm]').forEach(el => {
    el.addEventListener('click', e => {
      const msg = el.dataset.confirm || 'Are you sure?';
      if (!confirm(msg)) e.preventDefault();
    });
  });
}

/* ── Inline Lightbox ──────────────────────────────── */
function initLightbox() {
  const tiles = document.querySelectorAll('.photo-tile[data-href]');
  if (!tiles.length) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <img class="lb-img" src="" alt="" />
      <div class="lb-caption"></div>
    </div>`;

  document.body.appendChild(overlay);

  const lbImg     = overlay.querySelector('.lb-img');
  const lbCaption = overlay.querySelector('.lb-caption');
  const lbClose   = overlay.querySelector('.lb-close');

  function openLB(src, caption) {
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLB() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 200);
  }

  tiles.forEach(tile => {
    tile.addEventListener('click', e => {
      if (e.target.closest('.photo-tile-actions')) return;
      e.preventDefault();
      const img     = tile.querySelector('img');
      const caption = tile.querySelector('.photo-tile-caption')?.textContent?.trim() || '';
      if (img) openLB(img.src, caption);
    });
  });

  lbClose.addEventListener('click', closeLB);
  overlay.querySelector('.lb-backdrop').addEventListener('click', closeLB);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeLB();
  });
}

/* ── Lightbox Styles (injected) ───────────────────── */
const lbStyle = document.createElement('style');
lbStyle.textContent = `
#lightbox {
  position: fixed; inset: 0; z-index: 9000;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.22s ease;
}
#lightbox.active { opacity: 1; pointer-events: auto; }
.lb-backdrop {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.lb-content {
  position: relative; z-index: 1;
  max-width: min(90vw, 1000px);
  max-height: 90vh;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  transform: scale(0.96); transition: transform 0.22s ease;
}
#lightbox.active .lb-content { transform: scale(1); }
.lb-img {
  max-width: 100%; max-height: 82vh;
  border-radius: 12px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.8);
  object-fit: contain;
  display: block;
}
.lb-caption {
  font-size: 13px; color: rgba(255,255,255,0.6);
  text-align: center; max-width: 500px; line-height: 1.5;
}
.lb-close {
  position: fixed; top: 20px; right: 24px;
  width: 38px; height: 38px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.8);
  transition: all 0.15s ease; z-index: 2;
}
.lb-close:hover { background: rgba(255,255,255,0.14); color: white; transform: scale(1.08); }
`;
document.head.appendChild(lbStyle);
