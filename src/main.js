import "./style.css";

const app = document.querySelector("#app");

const state = {
  selectedAlphabetId: "latin-basic",
  glyphIndex: 0,
  alphabets: [
    {
      id: "latin-basic",
      name: "Latin (Basic)",
      glyphs: ["A", "B", "C", "D", "E", "F"],
      notes: "A simple starter set.",
    },
    {
      id: "hiragana-starter",
      name: "Hiragana (Starter)",
      glyphs: ["あ", "い", "う", "え", "お", "か"],
      notes: "A tiny set from Japanese.",
    },
    {
      id: "invented-demo",
      name: "Invented Script (Demo)",
      glyphs: ["◊", "△", "○", "□", "☆", "⨀"],
      notes: "Fun symbols for pretend writing.",
    },
  ],
};

function selectAlphabet(alphabetId) {
  state.selectedAlphabetId = alphabetId;
  state.glyphIndex = 0;
  render();
}

function getSelectedAlphabet() {
  return state.alphabets.find((item) => item.id === state.selectedAlphabetId);
}

function moveAlphabet(direction) {
  const currentIndex = state.alphabets.findIndex(
    (item) => item.id === state.selectedAlphabetId,
  );
  if (currentIndex < 0) {
    return;
  }

  const total = state.alphabets.length;
  const nextIndex = (currentIndex + direction + total) % total;
  selectAlphabet(state.alphabets[nextIndex].id);
}

function moveGlyph(direction) {
  const selected = getSelectedAlphabet();
  if (!selected || selected.glyphs.length === 0) {
    return;
  }

  const total = selected.glyphs.length;
  state.glyphIndex = (state.glyphIndex + direction + total) % total;
  render();
}

function render() {
  const selected = getSelectedAlphabet();
  const glyphCount = selected?.glyphs.length ?? 0;
  const currentGlyph =
    glyphCount > 0 ? selected?.glyphs[state.glyphIndex] ?? "?" : "?";

  app.innerHTML = `
    <main class="layout">
      <header class="panel hero">
        <h1>Marco Alphabet Playtime</h1>
        <p>One small step at a time.</p>
      </header>

      <section class="panel step">
        <p class="step-badge">Step 1 of 2</p>
        <h2>Pick a letter set</h2>
        <div class="choice-row">
          <button class="secondary big-button" data-action="prev-alphabet" type="button">
            Back
          </button>
          <div class="choice-card">
            <strong>${selected?.name ?? "No set selected"}</strong>
            <span>${selected?.notes ?? "Pick a set to start."}</span>
          </div>
          <button class="secondary big-button" data-action="next-alphabet" type="button">
            Next
          </button>
        </div>
      </section>

      <section class="panel step">
        <p class="step-badge">Step 2 of 2</p>
        <h2>Learn one symbol</h2>
        <div class="glyph-stage" aria-live="polite">
          <span class="big-glyph">${currentGlyph}</span>
        </div>
        <p class="progress-text">${glyphCount > 0 ? state.glyphIndex + 1 : 0} of ${glyphCount} symbols</p>
        <div class="choice-row">
          <button class="big-button" data-action="prev-glyph" type="button">
            Previous symbol
          </button>
          <button class="big-button" data-action="next-glyph" type="button">
            Next symbol
          </button>
        </div>
      </section>
    </main>
  `;

  const actionButtons = app.querySelectorAll("[data-action]");
  actionButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const action = target.dataset.action;
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
        default:
          break;
      }
    });
  });
}

render();
