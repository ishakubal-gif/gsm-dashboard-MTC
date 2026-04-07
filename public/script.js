const API_BASE = '';

async function api(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed. Server error.' }));
      throw new Error(err.error || `HTTP Error ${res.status}`);
    }
    
    const ct = res.headers.get('Content-Type') || '';
    if (ct.includes('text/csv') || ct.includes('spreadsheetml') || ct.includes('octet-stream')) {
      return res; // Forward blob-like responses
    }
    
    return res.json();
  } catch (err) {
    console.error('[API Fetch Error]', err.message);
    throw err;
  }
}

function getToastContainer() {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}

function showToast(message, type = 'info', duration = 4000) {
  const container = getToastContainer();
  const toast = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: '📡' };
  
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span style="font-weight:700; font-size:1.1rem; padding-right:8px;">${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 400); // Wait for exit animation
  }, duration);
}

function animateValue(el, target, suffix = '', duration = 1200, decimals = 0) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();
  
  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // Quartic ease out
    const val = start + (target - start) * eased;
    el.textContent = val.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  revealEls.forEach(el => observer.observe(el));
}

function classifyQuality(rssi) {
  if (rssi >= -65) return 'Strong';
  if (rssi >= -85) return 'Medium';
  return 'Weak';
}

function qualityColor(q) {
  if (q === 'Strong') return '#00FA9A';
  if (q === 'Medium') return '#FFB300';
  return '#FF3366';
}

function qualityCSSClass(q) {
  return q.toLowerCase();
}

function timeAgo(isoString) {
  if (!isoString) return 'No sync';
  const diff = Date.now() - new Date(isoString).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 10) return 'Just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function downloadFile(url, fallbackName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fallbackName || '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
  
  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#94A3B8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
  }
});
