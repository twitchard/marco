import "./style.css";

const app = document.querySelector("#app");

const STORAGE_KEY = "marco-alphabet-playtime-v2";
const LEARN_ROUTE = "learn";
const INVENT_ROUTE = "invent";

const LATIN_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  symbol: letter,
  name: `Latin letter ${letter}`,
  hint: "Useful for review, but English already uses this script every day.",
}));

const IPA_CORE_GLYPHS = [
  ["i", "close front unrounded vowel", "FLEECE vowel: see"],
  ["ɪ", "near-close near-front unrounded vowel", "KIT vowel: sit"],
  ["e", "close-mid front unrounded vowel", "DRESS-like quality in many accents"],
  ["æ", "near-open front unrounded vowel", "TRAP vowel: cat"],
  ["ə", "mid-central vowel", "schwa sound: about"],
  ["ʌ", "open-mid back unrounded vowel", "STRUT vowel: cup"],
  ["ɑ", "open back unrounded vowel", "PALM vowel: father"],
  ["ɒ", "open back rounded vowel", "LOT vowel in many British accents"],
  ["ɔ", "open-mid back rounded vowel", "THOUGHT vowel: law"],
  ["ʊ", "near-close near-back rounded vowel", "FOOT vowel: book"],
  ["u", "close back rounded vowel", "GOOSE vowel: blue"],
  ["aɪ", "diphthong", "PRICE vowel: my"],
  ["aʊ", "diphthong", "MOUTH vowel: now"],
  ["ɔɪ", "diphthong", "CHOICE vowel: boy"],
  ["eɪ", "diphthong", "FACE vowel: day"],
  ["oʊ", "diphthong", "GOAT vowel: go"],
  ["p", "voiceless bilabial plosive", "pin"],
  ["b", "voiced bilabial plosive", "bin"],
  ["t", "voiceless alveolar plosive", "top"],
  ["d", "voiced alveolar plosive", "dog"],
  ["k", "voiceless velar plosive", "cat"],
  ["g", "voiced velar plosive", "go"],
  ["f", "voiceless labiodental fricative", "fan"],
  ["v", "voiced labiodental fricative", "van"],
  ["θ", "voiceless dental fricative", "thin"],
  ["ð", "voiced dental fricative", "this"],
  ["s", "voiceless alveolar fricative", "sun"],
  ["z", "voiced alveolar fricative", "zoo"],
  ["ʃ", "voiceless postalveolar fricative", "ship"],
  ["ʒ", "voiced postalveolar fricative", "vision"],
  ["h", "voiceless glottal fricative", "hat"],
  ["tʃ", "voiceless postalveolar affricate", "church"],
  ["dʒ", "voiced postalveolar affricate", "judge"],
  ["m", "bilabial nasal", "man"],
  ["n", "alveolar nasal", "no"],
  ["ŋ", "velar nasal", "sing"],
  ["l", "alveolar lateral approximant", "leaf"],
  ["ɹ", "alveolar approximant", "red"],
  ["j", "palatal approximant", "yes"],
  ["w", "labio-velar approximant", "we"],
].map(([symbol, name, hint]) => ({ symbol, name, hint }));

const HIRAGANA_GLYPHS = [
  ["あ", "a", "as in father"],
  ["い", "i", "as in machine"],
  ["う", "u", "as in flute"],
  ["え", "e", "as in met"],
  ["お", "o", "as in for"],
  ["か", "ka", "as in calm"],
  ["き", "ki", "as in key"],
  ["く", "ku", "as in kook"],
  ["け", "ke", "as in kettle"],
  ["こ", "ko", "as in cola"],
].map(([symbol, name, hint]) => ({ symbol, name, hint }));

const GREEK_GLYPHS = [
  ["Α", "alpha", "first Greek letter"],
  ["Β", "beta", "second Greek letter"],
  ["Γ", "gamma", "third Greek letter"],
  ["Δ", "delta", "fourth Greek letter"],
  ["Ε", "epsilon", "fifth Greek letter"],
  ["Ζ", "zeta", "sixth Greek letter"],
  ["Η", "eta", "seventh Greek letter"],
  ["Θ", "theta", "eighth Greek letter"],
  ["Ι", "iota", "ninth Greek letter"],
  ["Κ", "kappa", "tenth Greek letter"],
  ["Λ", "lambda", "eleventh Greek letter"],
  ["Μ", "mu", "twelfth Greek letter"],
].map(([symbol, name, hint]) => ({ symbol, name, hint }));

const CYRILLIC_GLYPHS = [
  ["А", "a", "Cyrillic capital A"],
  ["Б", "be", "Cyrillic capital Be"],
  ["В", "ve", "Cyrillic capital Ve"],
  ["Г", "ghe", "Cyrillic capital Ghe"],
  ["Д", "de", "Cyrillic capital De"],
  ["Е", "ie", "Cyrillic capital Ie"],
  ["Ж", "zhe", "Cyrillic capital Zhe"],
  ["З", "ze", "Cyrillic capital Ze"],
  ["И", "i", "Cyrillic capital I"],
  ["Й", "short i", "Cyrillic capital Short I"],
  ["К", "ka", "Cyrillic capital Ka"],
  ["Л", "el", "Cyrillic capital El"],
].map(([symbol, name, hint]) => ({ symbol, name, hint }));

const ALPHABETS = [
  {
    id: "ipa-core",
    name: "IPA - International Phonetic Alphabet",
    glyphs: IPA_CORE_GLYPHS,
    notes:
      "Featured set: this helps map speech sounds clearly, and is great for pronunciation practice.",
    priority: "spotlight",
  },
  {
    id: "hiragana-starter",
    name: "Hiragana (Starter Set)",
    glyphs: HIRAGANA_GLYPHS,
    notes: "A beginner set from Japanese writing.",
    priority: "spotlight",
  },
  {
    id: "greek-starter",
    name: "Greek (Starter Set)",
    glyphs: GREEK_GLYPHS,
    notes: "Useful in math, science, and historical texts.",
    priority: "spotlight",
  },
  {
    id: "cyrillic-starter",
    name: "Cyrillic (Starter Set)",
    glyphs: CYRILLIC_GLYPHS,
    notes: "Common in many Eastern European languages.",
    priority: "spotlight",
  },
  {
    id: "latin-full",
    name: "Latin (Full A-Z Review)",
    glyphs: LATIN_GLYPHS,
    notes:
      "All 26 letters are here for completeness, but this app now highlights non-Latin scripts first.",
    priority: "review",
  },
];

const DEFAULT_STATE = {
  selectedAlphabetId: "ipa-core",
  glyphIndexByAlphabet: {},
  inventedAlphabet: [],
};

let state = loadState();

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clampIndex(value, total) {
  if (total <= 0) {
    return 0;
  }
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }
  const rounded = Math.trunc(numericValue);
  if (rounded < 0) {
    return 0;
  }
  if (rounded >= total) {
    return total - 1;
  }
  return rounded;
}

function sanitizeField(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getAlphabetById(alphabetId) {
  return ALPHABETS.find((alphabet) => alphabet.id === alphabetId);
}

function normalizeState(inputState) {
  const fallback = structuredClone(DEFAULT_STATE);
  const candidate = inputState && typeof inputState === "object" ? inputState : {};
  const selectedAlphabetId = ALPHABETS.some(
    (alphabet) => alphabet.id === candidate.selectedAlphabetId,
  )
    ? candidate.selectedAlphabetId
    : fallback.selectedAlphabetId;

  const glyphIndexByAlphabet = {};
  for (const alphabet of ALPHABETS) {
    const fromStorage = candidate.glyphIndexByAlphabet?.[alphabet.id];
    glyphIndexByAlphabet[alphabet.id] = clampIndex(fromStorage, alphabet.glyphs.length);
  }

  const inventedAlphabet = Array.isArray(candidate.inventedAlphabet)
    ? candidate.inventedAlphabet
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          id: typeof entry.id === "string" ? entry.id : createId(),
          symbol: sanitizeField(entry.symbol, 8),
          name: sanitizeField(entry.name, 80),
          sound: sanitizeField(entry.sound, 80),
          example: sanitizeField(entry.example, 120),
        }))
        .filter((entry) => entry.symbol && entry.name)
    : [];

  return {
    selectedAlphabetId,
    glyphIndexByAlphabet,
    inventedAlphabet,
  };
}

function loadState() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return normalizeState(DEFAULT_STATE);
    }
    return normalizeState(JSON.parse(rawValue));
  } catch (error) {
    return normalizeState(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getSelectedAlphabet() {
  return getAlphabetById(state.selectedAlphabetId) ?? ALPHABETS[0];
}

function getGlyphIndex(alphabetId) {
  const alphabet = getAlphabetById(alphabetId);
  if (!alphabet) {
    return 0;
  }
  return clampIndex(state.glyphIndexByAlphabet[alphabetId], alphabet.glyphs.length);
}

function setSelectedAlphabet(alphabetId) {
  const alphabet = getAlphabetById(alphabetId);
  if (!alphabet) {
    return;
  }
  state.selectedAlphabetId = alphabet.id;
  state.glyphIndexByAlphabet[alphabet.id] = getGlyphIndex(alphabet.id);
  saveState();
  render();
}

function moveAlphabet(direction) {
  const selected = getSelectedAlphabet();
  const currentIndex = ALPHABETS.findIndex((alphabet) => alphabet.id === selected.id);
  if (currentIndex < 0) {
    return;
  }
  const nextIndex = (currentIndex + direction + ALPHABETS.length) % ALPHABETS.length;
  setSelectedAlphabet(ALPHABETS[nextIndex].id);
}

function moveGlyph(direction) {
  const alphabet = getSelectedAlphabet();
  const total = alphabet.glyphs.length;
  if (total <= 0) {
    return;
  }
  const currentIndex = getGlyphIndex(alphabet.id);
  const nextIndex = (currentIndex + direction + total) % total;
  state.glyphIndexByAlphabet[alphabet.id] = nextIndex;
  saveState();
  render();
}

function getRouteFromHash() {
  const hash = window.location.hash.replace("#", "").trim().toLowerCase();
  return hash === INVENT_ROUTE ? INVENT_ROUTE : LEARN_ROUTE;
}

function renderTopNav(route) {
  return `
    <header class="panel top-nav">
      <div class="brand-group">
        <p class="brand-overline">Marco Alphabet Playtime</p>
        <h1 class="brand-title">Language Explorer</h1>
      </div>
      <nav class="link-row" aria-label="Main sections">
        <a class="top-link ${route === LEARN_ROUTE ? "active" : ""}" href="#${LEARN_ROUTE}">
          Learn alphabets
        </a>
        <a class="top-link ${route === INVENT_ROUTE ? "active" : ""}" href="#${INVENT_ROUTE}">
          Alphabet invention lab
        </a>
      </nav>
    </header>
  `;
}

function renderAlphabetOptions(selectedId) {
  return ALPHABETS.map((alphabet) => {
    const prefix = alphabet.priority === "spotlight" ? "Featured" : "Review";
    return `
      <option value="${escapeHtml(alphabet.id)}" ${
        alphabet.id === selectedId ? "selected" : ""
      }>
        ${escapeHtml(`${prefix}: ${alphabet.name}`)}
      </option>
    `;
  }).join("");
}

function renderLearnPage() {
  const selected = getSelectedAlphabet();
  const glyphIndex = getGlyphIndex(selected.id);
  const glyphCount = selected.glyphs.length;
  const currentGlyph = selected.glyphs[glyphIndex] ?? {
    symbol: "?",
    name: "No symbol available",
    hint: "Try another alphabet set.",
  };
  const progressPercent =
    glyphCount > 0 ? Math.round(((glyphIndex + 1) / glyphCount) * 100) : 0;
  const focusTag =
    selected.priority === "spotlight" ? "Featured non-Latin focus" : "Latin review set";

  return `
    <section class="panel hero">
      <p class="eyebrow">Learning mode</p>
      <h2 class="hero-title">Explore scripts beyond everyday English</h2>
      <p class="hero-copy">
        Since we already read English with Latin letters, this experience now puts
        other writing systems first, especially the IPA.
      </p>
      <a class="hero-link" href="#${INVENT_ROUTE}">
        Jump to the alphabet invention page
      </a>
    </section>

    <section class="panel chat-panel">
      <h3>Coach chat</h3>
      <div class="chat-log">
        <article class="chat-bubble coach">
          Today&apos;s first stop is <strong>IPA</strong>, the International Phonetic Alphabet.
          It helps us map speech sounds instead of spelling habits.
        </article>
        <article class="chat-bubble learner">
          I&apos;m currently studying <strong>${escapeHtml(selected.name)}</strong>.
        </article>
        <article class="chat-bubble coach">
          Symbol <strong>${glyphCount > 0 ? glyphIndex + 1 : 0}</strong> of
          <strong>${glyphCount}</strong>:
          <span class="inline-glyph">${escapeHtml(currentGlyph.symbol)}</span>
          - ${escapeHtml(currentGlyph.name)}.
        </article>
      </div>
    </section>

    <section class="panel">
      <h3>Choose an alphabet set</h3>
      <div class="selector-row">
        <button class="secondary big-button" data-action="prev-alphabet" type="button">
          Back
        </button>
        <label class="select-field">
          <span>Current set</span>
          <select data-control="alphabet-select">
            ${renderAlphabetOptions(selected.id)}
          </select>
        </label>
        <button class="secondary big-button" data-action="next-alphabet" type="button">
          Next
        </button>
      </div>

      <div class="set-card">
        <p class="set-chip ${
          selected.priority === "spotlight" ? "chip-spotlight" : "chip-review"
        }">${focusTag}</p>
        <h4>${escapeHtml(selected.name)}</h4>
        <p>${escapeHtml(selected.notes)}</p>
      </div>
    </section>

    <section class="panel">
      <h3>Practice a symbol</h3>
      <div class="glyph-stage" aria-live="polite">
        <span class="big-glyph">${escapeHtml(currentGlyph.symbol)}</span>
      </div>
      <p class="glyph-title">${escapeHtml(currentGlyph.name)}</p>
      <p class="glyph-hint">${escapeHtml(currentGlyph.hint)}</p>

      <div class="progress-meta">
        <span>${glyphCount > 0 ? glyphIndex + 1 : 0} of ${glyphCount} symbols</span>
        <strong>${progressPercent}% complete</strong>
      </div>
      <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPercent}">
        <span style="width: ${progressPercent}%"></span>
      </div>

      <div class="choice-row">
        <button class="big-button" data-action="prev-glyph" type="button">
          Previous symbol
        </button>
        <button class="big-button" data-action="next-glyph" type="button">
          Next symbol
        </button>
      </div>
    </section>
  `;
}

function renderQuickSymbolButtons() {
  const starterSymbols = ["◈", "△", "⨀", "✶", "☰", "⟡", "⌘", "𐓃"];
  return starterSymbols
    .map(
      (symbol) => `
        <button
          class="secondary mini"
          data-action="quick-symbol"
          data-symbol="${escapeHtml(symbol)}"
          type="button"
        >
          ${escapeHtml(symbol)}
        </button>
      `,
    )
    .join("");
}

function renderInventedAlphabetList() {
  if (state.inventedAlphabet.length === 0) {
    return `
      <p class="empty-state">
        No symbols yet. Add your first one and it will be saved automatically.
      </p>
    `;
  }

  const items = state.inventedAlphabet
    .map(
      (entry) => `
        <li class="invent-item">
          <div class="invent-main">
            <span class="invent-symbol">${escapeHtml(entry.symbol)}</span>
            <div class="invent-copy">
              <strong>${escapeHtml(entry.name)}</strong>
              <span>Sound: ${escapeHtml(entry.sound || "Not specified")}</span>
              <span>Example: ${escapeHtml(entry.example || "Not specified")}</span>
            </div>
          </div>
          <button
            class="secondary"
            data-action="remove-invented"
            data-entry-id="${escapeHtml(entry.id)}"
            type="button"
          >
            Remove
          </button>
        </li>
      `,
    )
    .join("");

  return `<ul class="invent-list">${items}</ul>`;
}

function renderInventPage() {
  const total = state.inventedAlphabet.length;
  const latest = total > 0 ? state.inventedAlphabet[total - 1] : null;

  return `
    <section class="panel hero">
      <p class="eyebrow">Alphabet invention mode</p>
      <h2 class="hero-title">Find your own alphabet</h2>
      <p class="hero-copy">
        Build symbols, give them names, and keep growing your own writing system.
        Progress is stored in local browser storage so your work is not lost.
      </p>
      <a class="hero-link" href="#${LEARN_ROUTE}">
        Back to alphabet learning
      </a>
    </section>

    <section class="panel chat-panel">
      <h3>Invention chat</h3>
      <div class="chat-log">
        <article class="chat-bubble coach">
          Welcome to your script lab. Create symbols that feel personal and memorable.
        </article>
        <article class="chat-bubble learner">
          I have created <strong>${total}</strong> custom ${
            total === 1 ? "symbol" : "symbols"
          } so far.
        </article>
        <article class="chat-bubble coach">
          ${
            latest
              ? `Latest entry: ${escapeHtml(latest.symbol)} means ${escapeHtml(latest.name)}.`
              : "Tip: start with one shape and one sound, then grow the set gradually."
          }
        </article>
      </div>
    </section>

    <section class="panel">
      <h3>Add a new symbol</h3>
      <form class="invent-form" data-role="invent-form">
        <label>
          Symbol
          <input name="symbol" maxlength="8" required placeholder="e.g. ⟡" />
        </label>
        <label>
          Name
          <input name="name" maxlength="80" required placeholder="e.g. Sky marker" />
        </label>
        <label>
          Sound or pronunciation note
          <input name="sound" maxlength="80" placeholder="e.g. sounds like sh" />
        </label>
        <label>
          Example meaning
          <input name="example" maxlength="120" placeholder="e.g. star, light, or home" />
        </label>
        <div class="quick-row">
          <span>Starter symbols:</span>
          <div class="quick-buttons">
            ${renderQuickSymbolButtons()}
          </div>
        </div>
        <button class="big-button" type="submit">Save symbol</button>
      </form>
      <p class="save-note">
        Saved automatically to local storage on this device.
      </p>
    </section>

    <section class="panel">
      <div class="inventory-head">
        <h3>Your invented alphabet</h3>
        <button
          class="secondary"
          data-action="clear-invented"
          type="button"
          ${total === 0 ? "disabled" : ""}
        >
          Clear all
        </button>
      </div>
      ${renderInventedAlphabetList()}
    </section>
  `;
}

function render() {
  const route = getRouteFromHash();
  app.innerHTML = `
    <main class="layout">
      ${renderTopNav(route)}
      ${route === INVENT_ROUTE ? renderInventPage() : renderLearnPage()}
    </main>
  `;
}

function removeInventedEntry(entryId) {
  state.inventedAlphabet = state.inventedAlphabet.filter((entry) => entry.id !== entryId);
  saveState();
  render();
}

function clearInventedEntries() {
  if (state.inventedAlphabet.length === 0) {
    return;
  }
  if (!window.confirm("Clear every symbol from your invented alphabet?")) {
    return;
  }
  state.inventedAlphabet = [];
  saveState();
  render();
}

function handleAction(actionElement) {
  const action = actionElement.dataset.action;
  switch (action) {
    case "prev-alphabet":
      moveAlphabet(-1);
      break;
    case "next-alphabet":
      moveAlphabet(1);
      break;
    case "prev-glyph":
      moveGlyph(-1);
      break;
    case "next-glyph":
      moveGlyph(1);
      break;
    case "quick-symbol": {
      const symbol = sanitizeField(actionElement.dataset.symbol, 8);
      const symbolInput = app.querySelector('input[name="symbol"]');
      if (symbolInput instanceof HTMLInputElement) {
        symbolInput.value = symbol;
        symbolInput.focus();
      }
      break;
    }
    case "remove-invented": {
      const entryId = sanitizeField(actionElement.dataset.entryId, 100);
      if (entryId) {
        removeInventedEntry(entryId);
      }
      break;
    }
    case "clear-invented":
      clearInventedEntries();
      break;
    default:
      break;
  }
}

app.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const actionElement = target.closest("[data-action]");
  if (!(actionElement instanceof HTMLElement)) {
    return;
  }
  handleAction(actionElement);
});

app.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.dataset.control === "alphabet-select" && target instanceof HTMLSelectElement) {
    setSelectedAlphabet(target.value);
  }
});

app.addEventListener("submit", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement)) {
    return;
  }
  if (target.dataset.role !== "invent-form") {
    return;
  }

  event.preventDefault();
  const formData = new FormData(target);
  const symbol = sanitizeField(formData.get("symbol"), 8);
  const name = sanitizeField(formData.get("name"), 80);
  const sound = sanitizeField(formData.get("sound"), 80);
  const example = sanitizeField(formData.get("example"), 120);

  if (!symbol || !name) {
    return;
  }

  state.inventedAlphabet.push({
    id: createId(),
    symbol,
    name,
    sound,
    example,
  });
  saveState();
  target.reset();
  render();
});

window.addEventListener("hashchange", () => {
  render();
});

if (!window.location.hash) {
  window.location.hash = `#${LEARN_ROUTE}`;
}

render();
