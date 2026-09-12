# Git Commit & Centralized Logging Standards

## 1. Commit Message Format
Every commit message must strictly follow this structure:
`<LogID>(<type>): <description>`

- **LogID**: Tracking ID starting sequentially from `DC01` (e.g., `DC01`, `DC02`, `DC03`, etc.).
- **type (4 letters max)**:
  - `feat` (New feature / capability)
  - `fix`  (Bug fix)
  - `ui`   (UI design / styling / layout changes)
  - `refc` (Refactoring / code cleanup)
  - `docs` (Documentation updates)
  - `perf` (Performance improvements)
  - `chor` (Chores / dependency / build updates)
  - `styl` (Styling / CSS / theme UI changes)
  - `test` (Testing / test scripts)
- **description**: Clear, concise explanation of the change in sentence case.

**Examples**:
- `DC01(feat): add hero banner carousel on landing page`
- `DC02(ui): update navbar responsiveness and cart drawer layout`
- `DC03(fix): resolve price calculation discrepancy in checkout`

---

## 2. No Lazy Commits
- Never make lazy, generic, or single-word commits (e.g. `up`, `fix`, `test`, `wip`, `temp`, `changes`).
- Every commit must describe the exact business or technical logic changed.

---

## 3. Docs, Credentials & Execution Directives
- **Docs Folder Location**: All client docs, credentials, server configs, and deployment guides are located at:
  ```
  J:\My Drive\CLIENTS\DEMO
  ```
- **Follow Docs for Credentials**: Follow the docs in `J:\My Drive\CLIENTS\DEMO` for any server or specific credentials.
- **Always Execute as Instructed**: Strictly execute as the user directs. Do not make unauthorized modifications or deviations.
- **Code Inspection for UI**: Do not always use terminal to skim files. Frontend needs careful UI updates, so thoroughly read through the frontend files using dedicated file viewing tools to understand layouts, components, and styling before making changes.

---

## 4. Centralized Logging via Central Hub (Zero Local Docs)
- **NO LOCAL DOCUMENTATION OR BATCH FILES IN `Docs/`**: We no longer write or maintain markdown logs/batch files locally.
- All actions, changes, requirements, and test audits must be logged directly into the Central Cloudflare D1 Hub using the rich logger CLI:
  ```bash
  node client-kit/log.js "<ID>(<type>): <Summary>" \
    --reqs "- Business requirement and problem context" \
    --changes "- File and logic changes breakdown" \
    --notes "Verification and test notes"
  ```
- Refer to `AL_Instruction.md` / `AI_INSTRUCTIONS.md` for full scopes, endpoint details, and operating guidelines.

---

## 5. Code Style, Commenting & Core Logic Guardrails
- **Arrow Functions**: Always use arrow functions (`const myFunc = () => {}`) for functional components and all custom logic/handlers. Do not use standard `function` declarations.
- **No Inline Comments**: NEVER put inline comments inside code bodies, loops, conditions, or JSX blocks. Keep internal logic clean.
- **Single-Line Preceding Function Comment Only**: Place exactly one concise, single-line relative comment on the line immediately preceding the function declaration.
- **Core Logic Verification**: Always clarify and verify with the user before modifying core architectural, multi-tenant, inventory deduction, or payment logic.

**Example**:
```javascript
// Calculates and returns total discount applied across cart items
const calculateDiscount = (items) => {
  return items.reduce((acc, item) => acc + (item.price - item.discount), 0);
};
```

---

## 6. Deployment Rules (STRICT — NO EXCEPTIONS)
- **না বলা পর্যন্ত কোনো ডিপ্লয় দিবে না (NEVER deploy unless explicitly instructed).**
- **NEVER run any VPS build, `docker compose up --build`, or deployment command without explicit user instruction.**
- When user instructs *"ডিপ্লয় দাও"*, execute the deployment commands directly using tools instead of outputting code text.
- **`temp` branch commits and `git push` are fine without confirmation.**
- **Merging `temp` into `Live` and pushing to GitHub is fine without confirmation.**
- **Only the actual VPS build/deploy step requires explicit user command.**
