import "./style.css";

const app = document.querySelector("#app");

const state = {
  selectedAlphabetId: "latin-basic",
  alphabets: [
    {
      id: "latin-basic",
      name: "Latin (Basic)",
      glyphs: ["A", "B", "C", "D", "E", "F"],
      notes: "Starter set for western languages.",
    },
    {
      id: "hiragana-starter",
      name: "Hiragana (Starter)",
      glyphs: ["あ", "い", "う", "え", "お", "か"],
      notes: "A very small sample set for Japanese.",
    },
    {
      id: "invented-demo",
      name: "Invented Script (Demo)",
      glyphs: ["◊", "△", "○", "□", "☆", "⨀"],
      notes: "Placeholder symbols for a custom writing system.",
    },
  ],
};

function selectAlphabet(alphabetId) {
  state.selectedAlphabetId = alphabetId;
  render();
}

function getSelectedAlphabet() {
  return state.alphabets.find((item) => item.id === state.selectedAlphabetId);
}

function render() {
  const selected = getSelectedAlphabet();

  // TODO(app-shell): Replace string templates with reusable UI components.
  // TODO(a11y): Add keyboard navigation, skip links, and focus management.
  // TODO(i18n): Externalize all user-facing strings for localization.
  app.innerHTML = `
    <main class="layout">
      <header class="panel hero">
        <h1>Marco Alphabet Lab</h1>
        <p>
          Stub app for exploring existing alphabets and sketching new ones.
          Everything below is intentionally incomplete and marked with TODOs.
        </p>
      </header>

      <section class="grid">
        <article class="panel">
          <h2>Alphabet Library</h2>
          <p class="muted">Choose a seed alphabet to study.</p>
          <ul class="alphabet-list">
            ${state.alphabets
              .map(
                (alphabet) => `
              <li>
                <button
                  class="alphabet-item ${
                    alphabet.id === state.selectedAlphabetId ? "active" : ""
                  }"
                  data-alphabet-id="${alphabet.id}"
                  type="button"
                >
                  <strong>${alphabet.name}</strong>
                  <span>${alphabet.notes}</span>
                </button>
              </li>
            `,
              )
              .join("")}
          </ul>
          <button class="secondary" type="button" disabled>
            Create New Alphabet (TODO)
          </button>
          <p class="todo-note">
            TODO(library): Load alphabets dynamically from backend and allow
            filtering/sorting/searching.
          </p>
        </article>

        <article class="panel">
          <h2>Selected Alphabet</h2>
          <p class="muted">Current dataset: ${selected?.name ?? "None selected"}</p>
          <div class="glyph-grid">
            ${
              selected?.glyphs
                .map((glyph) => `<span class="glyph-cell">${glyph}</span>`)
                .join("") ?? "<p>No glyphs loaded.</p>"
            }
          </div>
          <div class="actions">
            <button type="button" disabled>Play Pronunciation (TODO)</button>
            <button type="button" disabled>View Stroke Order (TODO)</button>
          </div>
          <p class="todo-note">
            TODO(content): Attach pronunciation, transliteration, and stroke metadata
            to each glyph.
          </p>
        </article>

        <article class="panel">
          <h2>Alphabet Composer</h2>
          <p class="muted">
            Draft and iterate on your own writing system.
          </p>
          <form class="composer-form">
            <label>
              Alphabet name
              <input type="text" placeholder="My New Script" disabled />
            </label>
            <label>
              Glyph ideas
              <textarea
                rows="4"
                placeholder="Paste symbols, sketches, and notes..."
                disabled
              ></textarea>
            </label>
            <button type="submit" disabled>Save Draft (TODO)</button>
          </form>
          <p class="todo-note">
            TODO(composer): Persist drafts, validate symbols, and support version
            history with undo/redo.
          </p>
        </article>

        <article class="panel">
          <h2>Practice Mode</h2>
          <p class="muted">Small drills to improve recall speed.</p>
          <ul>
            <li>Flashcards (TODO)</li>
            <li>Glyph-to-sound quiz (TODO)</li>
            <li>Sound-to-glyph quiz (TODO)</li>
            <li>Timed challenge mode (TODO)</li>
          </ul>
          <button type="button" disabled>Start Practice Session (TODO)</button>
          <p class="todo-note">
            TODO(progress): Track per-user performance metrics and adaptive
            difficulty.
          </p>
        </article>
      </section>

      <footer class="panel">
        <h2>Stub Status</h2>
        <p>
          TODO(api): Define API contracts for auth, alphabet catalog, and user data.
        </p>
        <p>
          TODO(testing): Add unit tests, component tests, and end-to-end coverage.
        </p>
        <p>
          TODO(obs): Add logging/telemetry and error reporting strategy.
        </p>
      </footer>
    </main>
  `;

  const alphabetButtons = app.querySelectorAll("[data-alphabet-id]");
  alphabetButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const alphabetId = target.dataset.alphabetId;
      if (!alphabetId) {
        return;
      }
      selectAlphabet(alphabetId);
    });
  });
}

render();
