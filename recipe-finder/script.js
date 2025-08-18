// ===== Recipe Finder (TheMealDB API) — Codeboid =====
const API = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

const form = document.getElementById('searchForm');
const input = document.getElementById('q');
const status = document.getElementById('status');
const grid = document.getElementById('results');

let aborter = null;
let debounceId = null;

// Restore last search
window.addEventListener('DOMContentLoaded', () => {
    const last = localStorage.getItem('cb:recipe:last') || 'pasta';
    input.value = last;
    search(last);
});

// Submit triggers search
form.addEventListener('submit', (e) => {
    e.preventDefault();
    search(input.value.trim());
});

// Debounce while typing (optional, feels fast)
input.addEventListener('input', () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => search(input.value.trim()), 400);
});

async function search(query) {
    if (!query) {
        setStatus('Type something like “pasta”, “chicken”, or “rice”.');
        grid.innerHTML = '';
        return;
    }

    // Save preference
    try { localStorage.setItem('cb:recipe:last', query); } catch { }

    // Cancel any in-flight request
    if (aborter) aborter.abort();
    aborter = new AbortController();

    setStatus('Searching…');
    grid.innerHTML = '';

    try {
        const res = await fetch(API + encodeURIComponent(query), { signal: aborter.signal });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();

        const meals = data.meals || [];
        if (meals.length === 0) {
            setStatus(`No recipes found for “${escapeHTML(query)}”.`);
            return;
        }

        setStatus(`Showing ${meals.length} result${meals.length !== 1 ? 's' : ''} for “${escapeHTML(query)}”.`);
        render(meals);
    } catch (err) {
        if (err.name === 'AbortError') return; // typing fast; ignore
        setStatus('Something went wrong. Please check your connection and try again.');
    }
}

function render(meals) {
    grid.innerHTML = meals.map(toCardHTML).join('');
}

function toCardHTML(m) {
    const img = m.strMealThumb || '';
    const title = m.strMeal || 'Untitled';
    const area = m.strArea || 'Unknown';
    const cat = m.strCategory || 'Recipe';
    const youtube = m.strYoutube || '';
    const source = m.strSource || '';
    const ing = ingredients(m).slice(0, 8); // show first ~8 for brevity
    const instr = (m.strInstructions || '').split('\n').filter(Boolean).slice(0, 2).join(' ');
    const safeTitle = escapeHTML(title);

    return `
  <article class="card">
    <img src="${img}" alt="${safeTitle}" loading="lazy">
    <div class="body">
      <h3>${safeTitle}</h3>
      <div class="meta">${escapeHTML(cat)} • ${escapeHTML(area)}</div>
      <div class="ingredients"><strong>Ingredients:</strong> ${ing.map(escapeHTML).join(', ') || '—'}</div>
      <p class="meta">${escapeHTML(instr)}${instr ? '…' : ''}</p>
      <div class="actions">
        ${youtube ? `<a href="${youtube}" target="_blank" rel="noopener">YouTube</a>` : ''}
        ${source ? `<a href="${source}"  target="_blank" rel="noopener">Source</a>` : ''}
        <button type="button" onclick="alert('Full instructions are on the Source/YouTube links. Try different keywords for more results!')">Details</button>
      </div>
    </div>
  </article>`;
}

function ingredients(m) {
    const list = [];
    for (let i = 1; i <= 20; i++) {
        const name = m[`strIngredient${i}`];
        const amt = m[`strMeasure${i}`];
        if (name && name.trim()) {
            list.push([amt, name].filter(Boolean).join(' ').trim());
        }
    }
    return list;
}

function setStatus(text) {
    status.textContent = text;
}

// Tiny sanitizer for any dynamic text
function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}
