# Portfolio redesign audit and strategy

Audit date: 29 October 2026 (Asia/Calcutta). **Audit only; redesign awaits review.**

## Decision and scope

Recommend **Option B: a restrained 2.5D character supporting a normal, responsive HTML portfolio**. Preserve the original portfolio's dark surface, cyan identity, prominent name, terminal-inspired biography, readable experience timeline, and direct project/contact navigation. Replace the prototype's full-page simulation with short, bounded character transitions and substantial project demonstrations. A convincing seated transition is optional and must pass a visual proof before inclusion.

The primary problems are content credibility, document layout, animation timing, and composition. Changing the rendering technology alone will not solve them.

### Evidence standard

- **C — Code confirmed:** directly supported by inspected implementation or asset metadata.
- **V — Visually reproduced:** observed in this audit's browser session and screenshots.
- **D — Document supported:** stated by a resume or project document; does not establish independent performance, employment, publication, or release verification.
- **U — Unverified:** needs additional evidence or a controlled measurement. Absence of evidence is not proof a capability never existed.

### Baseline and methods

- Inspected the local workspace before GitHub. It began with a clean tracked working tree at `80cfe22973cbe2157add7caf8322e86d8aeff127` (`failure 1`). GitHub's current prototype main reports the same commit. The local App blob `fa8365e640c7d3dd4c10a2f9257303a8f0a7dccd` also matches the fetched remote App. Local source is the implementation authority; these checks do not establish that every untracked asset matches GitHub.
- Original reference: [Portfolio repository](https://github.com/NithishKumarAI/Portfolio), tree `ca8aaf595d2299c96013bda5888d485dce5635a8`, and its [live site](https://nithishkumar-ai-portfolio.vercel.app/). Inspected its app, hero, experience, projects, navigation, awards, skills, contact, background, sphere, and styles. Source snapshots are in `audit-evidence/reference-original/`.
- Inspected all current `src` components and Three.js subsystems, CSS, entry point, package/lock configuration, assets, and QA script approaches. The inactive components are distinguished below.
- Read `public/resume.pdf` through PDF text extraction. Also inspected `C:/My PC/git/LEO/resume/nithish_kumar_resume.tex`; it is an additional resume candidate, not an established replacement for the served PDF.
- Compared local project READMEs, selected manifests/entry points, Robin's current scope, and GitHub main READMEs for Forge, Cognitive Memory Engine, ETA, and AI Diary. Repository snapshots are in `audit-evidence/reference-projects/`. Project functionality was not exhaustively integration-tested.
- Port **3001 already served this Vite app**. Reused it without killing, replacing, or starting another service. Browser resource inventory confirmed the active source modules. No other service was changed.
- Browser automation covered desktop scroll positions approximately 0%, 10%, 24.4%, 35.6%, 46.7%, 54.4%, 63.3%, 74.4%, and 98%, plus native forward/reverse scrolling, project selection, final-section tabs, and Contact navigation. Mobile covered approximately 0%, 31%, 53%, 74%, 97%, and reverse scrolling. Screenshots capture settled states except the separately identified fresh-load shot.
- Desktop size request was 1440×900; saved current-site images are **1432×895**. Mobile request was 393×851; saved images are **386×836**. Original desktop captures are 1272×716. These are desktop-browser responsive checks, not physical phone tests.
- Production compilation: `npm run build -- --outDir audit-evidence/build` passed, with the large-chunk warning. Scoped `npx oxlint src scripts` completed with 12 warnings, including unused script variables, the ThreeCanvas effect dependency, and inactive scrubber purity/state warnings. An initial broad lint also scanned the audit's generated bundle; that generated-code noise is not counted as an application finding.
- No application source, dependency, or configuration changes were made. No push or deployment occurred. New files are the report and audit evidence. The temporary production-build copy was removed after measurement.

## 1. Original portfolio analysis

### Layout and identity

**C/V:** A centered introduction presents the actual profile photograph, large Inter name, cyan JetBrains Mono subtitle, terminal biography, compact statistics, work and resume links. Navigation uses `NITHISH.AI`, cyan active indicators, and native document sections. Near-black backgrounds, slate cards, restrained cyan and purple accents, timeline markers, and generous section spacing establish the identity worth preserving.

The original is more content-oriented than the prototype: Home → Experience & Research → Featured Projects → Credibility & Awards → Skills → Contact. It has no distinct education section and no independent biography section beyond the hero. Adding those is a redesign requirement, not restoring an existing section.

### Introduction and biography behavior

**C/V:** `Hero.tsx` types a biography on mount. “Generate New Bio” cycles deterministically through **12 authored paragraphs**, using approximately 25 ms per character, then replaces plain typing text with its rich formatting. It does not call an AI service. The button is disabled while typing; clicking it visibly starts the next paragraph. Preserve this playful interaction, with an immediately available readable summary and reduced-motion behavior.

The professional subtitle itself is **static**. Automatically rotating role text is requested new behavior; it is not already implemented in the original. Avoid describing the bio selector as live generative AI.

### Navigation, scrolling, cursor, and responsiveness

**C/V:** Desktop anchors and a working mobile hamburger lead to actual content sections. Scrolling is native with smooth anchor jumps and a progress indicator. This makes content independently readable. The mobile menu was opened successfully in this audit.

**C:** `FluidBackground.tsx` draws 400 stars, cyan cursor spinners, and trailing particles on Canvas 2D. It throttles work and skips drawing while the document is hidden. Cards use modest pointer-driven tilt. `ProfileSphere.tsx` adds a separate Three.js wireframe sphere with pointer rotation and a perpetual render loop. Preserve the restrained sense of depth, not the simultaneous decorative loops.

**V:** On mobile, the heavily tracked subtitle wraps awkwardly and clips at the edges; the large sphere competes with the biography. The header and mobile menu are still more useful than the prototype's missing mobile section navigation. **C:** Light mode inverts the entire document and reinverts media; replace this with actual color tokens if light mode remains.

### Projects, experience, research, skills, contact

**C/V:** Projects contain meaningful descriptions, achievements, stacks, and specific repository/demo URLs. However, wide horizontal cards use the same abstract SVG visual, a decorative impact chart, large metric panels, and hover-dependent description expansion. Preserve the case-study depth and direct links; replace generic art/charts with real product evidence and visible text. Horizontal swiping should not be the only discovery path.

Experience includes IMET Tooling database work and an ICISS entry. Awards include IBM certification, CodeStorm, ICISS, and Hack the Horizon. Skills are grouped sensibly, but percentages such as Python 88% are subjective and should become evidence-linked capability groups. Contact exposes email, LinkedIn, GitHub, Hugging Face, location, and resume directly, with no fake submission form. Original content still requires the factual corrections in section 4; visual reference does not mean factual authority for every claim.

## 2. Current portfolio architecture

### Active rendering path

`main.tsx` mounts React StrictMode and imports `index.css`. `App.tsx` owns normalized scroll progress, direction, model selection, telemetry, and modal state. It creates a **550vh minimum-height spacer**, with all five scene overlays fixed to the viewport.

`ThreeCanvas.tsx` creates and disposes `PortfolioWorld`, copies React progress into it, loads the selected character, and exposes `window.__portfolioWorld`. Its speech bubble is separate HTML. `PortfolioWorld.ts` owns the renderer, camera director, studio environment, workstation, character, and one continuous requestAnimationFrame loop.

Each frame updates camera → character → workstation canvas → lights → renderer. Telemetry is sent into App approximately every 200 ms or on action changes. The page is therefore a fixed presentation above an empty scroll spacer, not a document whose content determines its length.

### Module responsibilities and problems

- `CharacterModel.ts`: loads Xbot or RobotExpressive, maps animation clips, synthesizes humanoid wave/sit/typing tracks, and positions the character by global scroll ranges. No foot contact solver, chair anchor, or distance-based gait phase exists.
- `CameraDirector.ts`: calculates separate eased waypoints and applies a fixed `0.08` lerp per frame. Its framing has no knowledge of HTML panel rectangles or title safe areas.
- `Workstation.ts`: procedural desk, chair, peripherals, and curved display; a 1024×512 CanvasTexture is redrawn/uploaded every frame, including static standby. The screen is an invented Robin presentation, not the actual application UI.
- `Environment.ts`: floor, grid, pillars, ambient light, three directional lights, and one point light. The key light has a 2048×2048 shadow map. There is no actual ray-traced floor reflection or postprocessing bloom despite promotional language.
- `Scene1Hero`: static role badges, duplicate rig controls, summary, resume/GitHub, and a work CTA that jumps to **About at 0.32**, rather than Projects.
- `Scene2About`: generic capability cards, with large right-side panels.
- `Scene3WorkstationEnter`: a full chapter describing the animation and hardware instead of useful professional content.
- `Scene4Projects`: five selectable text cards with unsupported metrics; no actual screenshot, video, or functional demonstration.
- `Scene5ToolkitJourneyContact`: four tab views share the final fixed viewport; facts are hardcoded independently of the resume.
- `Navigation` and `LiveTelemetry`: technical controls dominate space; chapter controls disappear below `lg`, with no mobile replacement.
- `ResearchModal`: reachable, but describes a former pre-rendered implementation and contains unsupported comparative scores and performance guarantees.
- `PhotoComparisonModal`: imported, but App never sets its open state to true. Its images are not an active-page download merely because this component exists.
- `SocialIcons`: inline social SVGs; harmless reusable presentation.

### Inactive and legacy material

`CinematicCanvasScrubber`, `Scene2Workstation`, and `Scene3Robin` are not imported by the active App. They contain legacy frame loading, terminal logs, and a labelled simulated voice interaction. They are not evidence that the current project panel has a working demo. Reduced-motion detection in the old scrubber does not protect the active Three.js experience.

`App.css` contains starter styles and is not imported by the active entry path. Starter SVG/hero assets remain in `src/assets`. GSAP is installed but is not imported by current application source. README and the architecture modal were not updated when the app moved to real-time 3D.

## 3. Bugs, root causes, and severity

Severity: **P0** damages trust or a core visitor outcome; **P1** substantially impairs usability/animation; **P2** affects polish, efficiency, or maintainability.

### P0 — Incorrect facts, unsupported metrics, and false contact success

**C/V:** The wrong Forge product, incorrect education, placeholder repository links, and unsupported performance claims are rendered. Details and replacements are in section 4.

**C:** `Scene5ToolkitJourneyContact.tsx:28` handles form submission only by setting `contactSent`, waiting four seconds, and clearing state. There is no network call, mail handoff, persistence, or delivery mechanism. “Message Dispatched!” is false success. The submit action was not used in this audit. Rebuild as a verified mailto/contact route or an actual endpoint with real pending/success/error handling.

### P1 — First 20% has no character traversal

**C/V:** `CharacterModel.ts:348` fixes the root at `(1.5, 0, 0)` through progress 0.20; the camera is also constant through 0.20. The wave changes to idle at 0.08. The hero stays fully opaque through 0.18. With a 550vh document, this is about **90vh of scroll travel before translation begins**. Identity is meaningful immediately, but the visual progression stagnates. Shorten the introductory transition and tie it to local section geometry.

### P1 — Walking in place and unsynchronized translation

**C/V:** `CharacterModel.ts:344` advances the mixer with wall-clock `delta`. Between progress 0.20 and 0.45, the group translates 2.7 world units horizontally according to scroll, while `walk` runs at a fixed time scale of 1. If scrolling stops, position stops and legs continue. Fast scrolling moves the root faster without increasing gait speed; reversing scroll moves the root backward while the clip continues forward. The root's facing angle also turns across the whole segment rather than aligning with its nearly constant path tangent.

The GLB actually contains both `walk` and `run`; the code selects `walk`. Calling it running does not mean the wrong clip name is selected. The confirmed problem is gait/translation timing, exacerbated by framing and the path. A 3D repair would derive gait phase from traveled distance, define foot contacts, normalize root motion, and make forward/reverse poses deterministic.

### P1 — Seating is an approximate pose change without contact alignment

**C/V:** At progress >0.51, the system fades into a synthesized sit pose while the root continues translating and turning through 0.65. The “sit” clip uses identical start/end keyframes; the transition is an elapsed-time crossfade, not a scroll-sampled stand-to-sit action. Typing uses the same lower-body constants. There is no measured seat/hip/hand target or IK.

**C:** The hip position is hardcoded to 56 local units (`CharacterModel.ts:235`), while the seat center is y=0.46 with thickness 0.08. Xbot's GLB includes an Armature scale of approximately 0.01; **56 bone units are not 56 world meters**. This is a real calibration problem, not evidence of a 100× scale error. Bone orientation and limb placement also need rig-space validation.

The workstation is independently positioned at `(-1.6, 0, -0.6)` with yaw 0.2. The chair finishes at local z=0.33, giving a seat center near world `(-1.534, 0.46, -0.277)`. The avatar ends at `(-1.5, 0, -0.48)`; the hip offset and pose are not derived from this seat. **V:** screenshots at 54.4% and 63.3% show an awkward pose largely hidden by the tall chair back. The camera's rearward view compounds contact ambiguity. Exact penetration distances remain U.

### P1 — Independent camera, DOM, and character timelines create clutter

**C/V:** App opacity ranges overlap at 0.20–0.25, 0.45–0.48, 0.65–0.68, and 0.85–0.88. Both chapters can display interactive content simultaneously. All overlays share fixed full-screen containers and z-index 10. The camera follows different segment boundaries and applies easing plus damping, whereas the character root is set immediately from progress. CSS adds another 300 ms opacity transition.

At 24.4%, the outgoing hero and incoming About visibly overlap. At 35.6%, the character is covered by About cards. At 54–74%, the chair back hides much of the avatar. The telemetry HUD at z-index 40 covers headings, selectors, and links. This is a composition/timing failure across components, not just camera tuning.

### P1 — Inadequate content space and broken mobile document model

**C/V:** Full-opacity projects occupy only progress 0.71–0.83: approximately **54vh of scroll travel**, although the panel itself is a viewport overlay. Toolkit/Journey/Research/Contact become fully visible at 0.90, leaving about **45vh of scroll travel for four views**. These quantities are scroll budgets, not content element heights.

Panels have no content-driven document height or dedicated vertical reading scroller. On mobile, stacked About/toolkit cards extend below the viewport and behind fixed controls; further page scrolling changes chapters instead of revealing the panel's lower content. A wider FOV cannot fix HTML overflow. At small widths, top scene labels, tabs, and the HUD collide. Native chapter navigation disappears without a hamburger alternative.

### P1 — Contact route does not select contact; controls are occluded

**C/V:** Navigation jumps to 0.98, but Scene5 initializes `activeTab='toolkit'` and receives only opacity. Clicking Contact highlighted Contact while showing Toolkit. The current tab can persist across chapter revisits because the component remains mounted and merely returns null.

The expanded HUD blocked a Journey click. Even minimized, it covered Connect in the desktop test; keyboard Enter activated that tab successfully. Remove the public HUD and use real section anchors/explicit tab state if tabs remain. The hero's “Explore My Work” also needs a true Projects destination.

### P2 — Frame-dependent camera damping and excessive allocation

**C:** `CameraDirector.update` uses fixed-per-frame interpolation, so settling varies with frame rate. It allocates multiple Vector3 objects each frame. Use a single shared local scene timeline and delta-based damping only where intentional; reuse vectors. The main lag sources still need tracing before attributing a measured percentage of cost to this allocation.

### P2 — Mobile startup, speech anchoring, and loading robustness

**C:** Camera construction always uses FOV 42; portrait FOV 58 is applied only on a resize event. ThreeCanvas registers the resize handler without calling it on mount. A fresh mobile load and desktop-to-mobile resize can therefore frame differently.

The speech anchor updates only when progress changes, not each frame or on model-load completion. The initial estimate can remain displaced until scrolling, and it can lag camera/head animation. Model loading lacks user-facing fallback/error UI; the unawaited character load can reject. There is no WebGL-unavailable content fallback boundary. The continuous rendering path does not implement reduced motion, visibility pause, or an idle render policy.

### P2 — Model replacement and resource lifecycle risks

**C, visible consequence U:** Loading clears children without disposing old geometry/material resources or uncaching mixers. `currentActionName` and head reference are not reset. Reloading a character while its previous action name is `wave` can cause `playAction('wave')` to return early for the new mixer. Stale load callbacks return without resolving their Promise or cleaning up fetched resources. `CharacterModel.dispose` only stops actions; Workstation only disposes its texture; Environment leaves pillar/light resources outside its cleanup. These paths need lifecycle tests before claiming a measured memory leak. React StrictMode makes mount/load/dispose robustness particularly relevant during development.

### P2 — Public technical claims, accessibility, and metadata

**C/V:** The reachable audit modal claims pre-rendering is the current implementation and advertises locked FPS, subjective likeness scores, generic GPU memory figures, and zero effort. These are not valid evidence. The README repeats this former architecture. Browser warnings confirm deprecated Three.Clock and a removed PCFSoftShadowMap constant falling back to PCFShadowMap.

**C:** Modal markup has dialog semantics but no focus trap, Escape handling, or focus return; close icons lack accessible labels. The clickable brand is a div; the range and textarea need labels. `select-none` prevents normal copying of useful content. Project selectors lack full tab semantics. The page title is still `avatar-portfolio`, with no portfolio description/social metadata. Keyboard, screen-reader, 200% zoom, reduced-motion and WebGL-failure acceptance need dedicated testing.

## 4. Content correction report

### Authority policy

Use the user's explicit product corrections first, current project implementation/scope second, and resumes/original copy for personal history subject to conflict resolution. A README verifies what the project documents, not that every feature works in production. Keep an evidence record per claim: source path/ref, date checked, status, and whether it is measured or document-supported.

### Robin — flagship, local-first personal AI assistant

- **Keep:** Robin — Everyone's PA; flagship status; Windows personal assistant; local-first storage, conversation, reviewed actions, reminders, memory, Google integrations, optional local voice. The user explicitly establishes flagship identity.
- **Correct stack (D with manifest corroboration):** Electron + Next.js/React/TypeScript + Python/FastAPI, SQLite + Qdrant, configured Ollama Local AI or separately configured Gemini. Current scope names Moonshine STT and Bella TTS. Replace the prototype's PySide6/Qt and Whisper.cpp stack; remove an unsupported fixed Llama-3.3 default.
- **Remove:** “100% On-Device Offline”, “zero cloud latency”, <145 ms speech, and unrestricted autonomous/multi-agent claims. Cloud inference and authorized online Google services exist. Current Robin scope explicitly excludes silent cloud fallback, automatic sending, and broad autonomous browser workflows.
- **Suggested copy:** “A local-first Windows personal assistant for conversation, memory, reminders, and reviewed everyday actions, with optional local voice and configurable local or cloud AI.”
- **Links/status:** [robinpa.in](https://robinpa.in/) loaded and advertises Windows beta 0.1.0 with an installer link. This verifies the public website, not the binary's acceptance or safety. No installer was downloaded or executed. The prototype's Repo URL points to the GitHub profile, not Robin source. The local implementation is in `C:/My PC/git/LEO`; a public LEO README could not be retrieved through the connector. Do not publish a guessed source URL or expose private source.
- The extra TeX resume's 40% retrieval improvement also lacks an inspected benchmark; do not migrate it into the portfolio automatically.

### Forge — placement preparation and learning

- **P0 correction, C/D/user confirmed:** Replace “Forge — Autonomous Code Refinement” and the AST/self-healing description entirely.
- **Suggested copy:** “A local-first placement preparation platform with authored lessons, deterministic assessments, Python/SQL coding practice, spaced review, and interview rehearsal.”
- **Verified documented stack:** React/TypeScript/Vite, Python/FastAPI/SQLModel, SQLite persistence, FSRS, Monaco, Pyodide and PGlite coding tools. Current runtime no longer requires model providers; do not present LangGraph/Tree-Sitter/Docker sandboxing or generative coaching as the current architecture without specific evidence.
- Remove 88.4% first-pass correction, Python/TypeScript/Go runtime claims, and autonomous code-refinement badges.
- The documented nine-subject/157-topic plan is incomplete, not a shipped syllabus. New Placement Foundations material remains unpublished pending independent review; do not advertise comprehensive interview readiness.
- Source: [Forge](https://github.com/NithishKumarAI/Forge). No verified public live demo was found in inspected material; show an approved local walkthrough instead.

### Cognitive Memory Engine / LearnTrack

- **D:** The current local and GitHub README call the product **LearnTrack**, with repository identity `cognitive-memory-engine`. Preserve the requested project ordering using “Cognitive Memory Engine — LearnTrack” until the public naming is approved.
- **Suggested copy:** “An evidence-based learning continuity app that turns reviewed captures into checkpoints, recommendations, and grounded recall linked to saved learning records.”
- Stack supported by current docs/manifests: Next.js/TypeScript/React, FastAPI, PostgreSQL/pgvector, Gemini, SentenceTransformers, SQLAlchemy/Alembic. Optional embeddings are distinct from confirmed-record recall.
- Remove 14.2 ms p95 retrieval, episodic clustering, exponential decay, and human-like memory consolidation unless implementation evidence is supplied. The prototype substitutes a different product story for a learning platform.
- [Source](https://github.com/NithishKumarAI/cognitive-memory-engine). The historical [Cloud Run URL](https://cognitive-memory-frontend-244986175934.asia-south1.run.app/) loaded an older Cognitive Memory Engine login. This does **not** establish that current LearnTrack V1 is deployed; its README explicitly says deployment pending verification. Use current screenshots/walkthrough as the main evidence.
- Neither the original's deployment wording nor the extra resume's sub-300 ms RAG claim establishes a current measured production result.

### Food Delivery ETA Prediction

- **D with deployment-entry corroboration:** Main shipped model is CatBoost; UI is Streamlit, packaged with Docker for Google Cloud Run. XGBoost and LightGBM are comparison models, not evidence that they are the production serving ensemble. FastAPI is documented as optional.
- Remove -22.6% MAE, 2,400 requests/sec, Redis feature store, and operational real-time logistics claims. No supporting benchmark was inspected.
- The original/resume/README agree on CatBoost R² 0.84. Treat it as a **documented historical hold-out result**, with split and source context; it was not recomputed here. It is not a real-world delivery SLA.
- [Source](https://github.com/NithishKumarAI/food-delivery-eta-pipeline) and [demo](https://food-delivery-api-814424211655.asia-south1.run.app/) both have supporting evidence. The live demo loaded its prediction form and educational-use notice; no prediction throughput test was run.

### AI Diary Assistant

- Replace the prototype's sentiment telemetry, multi-month reflection, Next.js/FastAPI/ChromaDB, and 94.1% F1 claim. “Sentiment precision” and F1 are also different metrics.
- [Main README](https://github.com/NithishKumarAI/AI-Personal-Assistant-System) describes Streamlit journaling, transcription, diary generation, and Notion storage, with branch-specific providers. Main uses Gemini/Groq/Notion; the local README identifies `ollama-private`, using local Whisper + Ollama and cloud Notion storage. Do not merge these into one fictional architecture or claim fully offline storage.
- Original copy's “browser-native” transcription wording conflicts with its named Groq API; describe the selected branch precisely.
- The original [demo URL](https://ai-diary-assistant-522323461346.asia-south1.run.app/) returned a visible **500 Server Error** during this audit. Treat availability as failed at this observation, not permanently unavailable. Present source/screenshots until rechecked.

### Personal information, experience, education, research, certifications

- **Name:** Nithish Kumar R agrees across sources.
- **Email:** Original and both inspected resumes use `nithishswim7@gmail.com`. Prototype uses `nithishkumar.ai@gmail.com`, unsupported by those sources. Restore the supported address unless the user confirms a deliberate change.
- **GitHub:** `https://github.com/NithishKumarAI` is a valid profile destination; all five current Repo buttons incorrectly reuse it. Use the specific verified repositories above, or omit unavailable source links.
- **LinkedIn conflict:** Original uses `linkedin.com/in/nithish-kumar-ai/`; the extra TeX resume uses `linkedin.com/in/nithishkumar-ai`. Verify the intended public profile before publishing. Hugging Face is present only in the original (`NithishKumarai`); account ownership was not independently checked.
- **Location conflict:** Original and extra TeX resume say Theni; served PDF says Chennai. College location also conflicts: served PDF says Chennai; extra TeX says Karur. Do not silently choose either.
- **Education:** Served PDF supports B.Tech Artificial Intelligence and Data Science, M. Kumarasamy College of Engineering, graduated 2026, CGPA 7.2/10. Extra TeX says 2022–2026. Prototype's 2020–2024 BE Computer Science & AI is contradicted. Original's 7.25 conflicts with both inspected resumes' 7.2; use no GPA until resolved or confirm 7.2 is intended rounding.
- **Experience:** Original documents Database Administrator Intern, IMET Tooling India Pvt Ltd, Jul 2024–Mar 2026, MySQL schemas/query optimization/API support/XAMPP. Neither inspected resume independently establishes that employment entry. Preserve as original-source supported, pending confirmation of exact title/dates. Prototype's 2023–2024 AI/ML Engineer & Researcher entry is not an established employer role; remove it as employment history. Label personal projects clearly as projects.
- **Research:** Both resumes identify “AI-Driven and NLP-Powered Multilingual Tutor for Indian Languages,” authors Vaishnavi J., Prasanth K. R., Nithish Kumar R., Pragadheesh M., Haresh K.; ICISS 2026; paper ICISS-0103; **Accepted**. Original calls it published. Use “Accepted” until a proceedings/DOI/publisher record is verified. A focused exact-title web search did not establish a matching primary publication record; this is not proof of nonpublication. Current prototype omits this paper and substitutes generic research interests.
- **Certifications:** IBM AI Developer Professional Certificate is supported by original and resumes; extra TeX assigns 2024. NPTEL Joy of Computing Using Python, 72%, appears in both resumes; Ethical Hacking appears in the extra TeX. Credential URLs/certificates were not verified. Original-only CodeStorm Elite Award (April 2025) and Hack the Horizon top-10 claim (February 2025) need certificates/event evidence before presenting as independently verified awards.
- **Toolkit:** Replace the unsupported broad badge inventory with skills linked to actual projects. AWS, vLLM, LlamaIndex, ChromaDB, Redis, and LangGraph are not established merely by their appearance in the prototype. Prefer supported Python/FastAPI, React/Next.js/TypeScript, PostgreSQL/pgvector, SQLite/Qdrant, Docker/GCP, and the specific ML tools each project uses.
- **Hardware/deployment decoration:** RTX 4090, “5 systems deployed,” “ALL SYSTEMS NOMINAL,” and fabricated workstation diagnostics are not project evidence. Remove them.

## 5. Performance audit

### Measured artifact sizes and actual requests

All sizes below are decimal bytes unless MiB is stated. Raw evidence: `audit-evidence/asset-measurements.json` and `browser-assets.json`.

- Production JavaScript: **940,779 bytes**, one eager application bundle. Vite printed approximately 250.01 kB gzip; an independent Node gzip pass produced 248,023 bytes. Compression settings differ. These are compression calculations, not measured production wire transfer.
- Production CSS: **56,369 bytes**; Node gzip 9,152 bytes. Build HTML was approximately 0.46 kB. No dynamic application chunk split was emitted.
- Default Xbot GLB: **2,930,032 bytes**. It contains 67 skin joints, two meshes, seven clips (`agree`, `headShake`, `idle`, `run`, `sad_pose`, `sneak_pose`, `walk`), and no embedded images. The humanoid's large initial model is not a 4K texture problem.
- Optional RobotExpressive: **463,988 bytes**, fourteen clips and no embedded images. Soldier: **2,160,468 bytes**, unused by the selected loader, with two embedded images.
- Browser-observed dev resource inventory: **33 resources** at the sampled state, including 30 script entries, one stylesheet, Xbot fetch, and favicon. No legacy scene frames, videos, profile image, Robin PNG, or Soldier fetch appeared in that inventory.
- Independent HTTP GET replay of those observed URLs returned **18,839,527 response-body bytes**, all 33 status 200, identity encoding. Xbot response body/content-length was exactly 2,930,032. This is an actual local HTTP body measurement of dev resources, **not** a browser HAR, a cold-load total, transfer including headers, or a production delivery benchmark. The root document and WebSocket traffic are outside this replay. Dev modules are not the production bundle.
- `public/` totals **26,108,573 bytes**. Vite copies public files into build output; the browser does not automatically fetch that total. Three MP4 files total 8,460,966 bytes; the intra version alone is 6,528,690. The 101 legacy WebPs total 5,086,044 bytes. Robin PNG is 3,804,639 bytes. Resume is 292,249 bytes and is requested when opened.
- Hashing found **18 duplicate frame groups**, with **1,197,794 excess identical bytes**. These duplicates waste repository/build storage but did not cause the active page's network/render cost.

### Runtime observations and limits

**V:** Sampled desktop HUD readings varied substantially: screenshots/AX observations included values around 25–61 FPS during early/desktop tests, with lower transient readings when navigating/capturing. Mobile emulation also produced values above 60. These are short self-reported rAF windows in an automated desktop browser, not controlled FPS distributions or physical-mobile results. There is no basis for “60 FPS locked.”

The desktop HUD repeatedly reported **50 draw calls and 99,394 triangles**. This is renderer self-telemetry; it does not independently profile GPU time or every shadow pass. Its approximately 1–2 ms “Frame Cost” samples measure synchronous JavaScript update/render submission, not GPU completion, compositor work, or frame presentation. A low number cannot prove smooth scrolling.

Only deprecated Clock/removed shadow-map warnings appeared in the saved warn/error log sample; no error entries were present in that sample. This is not an exhaustive error-free guarantee.

**U:** Browser wire transfer/HAR, cold production LCP/INP/CLS, long-task traces, GPU timing, memory growth, real-device battery/thermal behavior, and repeatable FPS percentiles were not available from the supported browser inspection surface. The read-only browser evaluator did not expose Performance APIs; a resource inventory plus separate HTTP replay was used instead. No fabricated timings or heap numbers replace these missing measurements. No new continuous screen recording was produced; screenshots are the current visual evidence. Existing `qa-recordings` and old README measurements are historical and were not treated as this audit's results.

### Code-confirmed cost drivers

1. Eager Three.js/loader/app loading and a 2.93 MB default model delay the supporting decoration without improving the first readable content.
2. Continuous rendering, shadow updates, skinning, camera calculations, and monitor texture uploads continue while the page is idle. There is no explicit hidden-tab/low-power policy in the active loop.
3. A 1024×512 RGBA monitor surface represents about **2 MiB of base pixel data** before mipmaps/driver copies; redrawing it at display refresh is avoidable. It updates even while showing static standby. This is a buffer calculation, not measured VRAM.
4. DPR capped at 2 can quadruple pixel workload relative to DPR 1; antialiasing and shadows add costs. No adaptive quality tier exists. Four directional/ambient/point lighting roles and material work should be justified by visual value.
5. App receives scroll state on each event and telemetry about five times/second, causing broad React reconciliation. ThreeCanvas additionally sets bubble state on scroll. Exact reconciliation cost is U without a React profile; don't claim React rerenders are the sole bottleneck.
6. Large translucent panels, backdrop blur, glows, CSS animation, and overlapping fixed layers increase compositing/paint pressure alongside WebGL.
7. Model/resource cleanup is incomplete; repeated replacements and StrictMode remounts deserve measurement.
8. The legacy scrubber would retain all decoded images if reactivated. At the inspected first-frame dimensions 1280×714, 101 RGBA frames would be roughly **352 MiB** if all frames matched that size, before overhead. That is an illustrative decoded-memory calculation, not current browser usage. A 5 MB compressed sequence is not automatically a lightweight 2.5D solution.

## 6. Option A versus Option B

### Option A — lightweight real-time humanoid plus HTML

- **Visual quality:** Strong depth and lighting when a coherent stylized asset is available; realism and personal likeness depend on asset quality. The generic Xbot is not evidence of a personal digital double.
- **Animation:** Best for reusable skeletal wave/walk/sit actions and actual depth changes. Requires root-motion normalization, distance-based gait, rig-aware contact alignment, reversible sampling, and coordinated camera/content safe zones.
- **Scroll smoothness:** Possible, but GPU workload and animation correctness need explicit budgets. Deterministic scroll poses do not require a lagging camera or a permanent full-screen render loop.
- **Complexity:** Higher: model pipeline, retargeting, compressed assets/decoder, disposal, context fallback, responsive framing, quality tiers, and contact QA.
- **Download:** Engine/loader plus compressed character; achievable size depends on the chosen asset. Existing Xbot alone is 2.93 MB. Do not assume all WebGL needs tens of MB or hundreds of MB of VRAM.
- **Mobile:** Requires tested reduced quality/static fallbacks; the current renderer is not proof of low-end suitability.
- **Replacement:** Easy only with an enforced skeleton/scale/action contract; otherwise animations/contact must be retargeted.
- **Projects:** Clear if HTML owns layout and the character remains secondary. 3D does not inherently improve project demonstration.

### Option B — bounded 2.5D character plus HTML (recommended)

- **Visual quality:** Consistent art direction and composition are easier to control for a small set of poses. Use a personally appropriate stylized character, layered depth, a subtle ground shadow, and restrained parallax.
- **Animation:** Strong for greetings, head/hand motion, short side-step/turn transitions, and authored seated poses. Arbitrary new viewpoints or convincing continuous full-body walking require more authored work. A rigid cutout translated across the screen is not an acceptable walking animation.
- **Scroll smoothness:** Transform/opacity transitions can avoid continuous 3D rendering. Still needs bounded decoded assets, compositing care, and reduced-motion handling. Do not reuse the 101-frame preload approach unchanged.
- **Complexity:** Lower browser/runtime complexity; art consistency and transitions remain real production work. Prefer a small pose/layer set with short loops only where useful.
- **Download:** No Three.js requirement; initial poster/layers can arrive before optional motion. Real media size must be tested; video/frame sequences can exceed a compressed GLB.
- **Mobile:** A static or short-loop greeting and normal document sections fit well; disable parallax and collapse decorative staging as needed.
- **Replacement:** Define an asset manifest with pose names, anchors, viewBox/bounds, subject scale, and attachment points. Replacement requires a coherent new pose family, not simply swapping one photograph.
- **Projects:** HTML screenshots, narrated clips, architecture details, and repository links remain fully independent and easy to maintain.

**Decision gate:** Build only an isolated visual proof after approval: greeting → brief transition → About pose, with an optional desk approach/seated cut. Approve consistent likeness/style, silhouette, hand/foot contact, reverse behavior, download, and mobile crop before building the whole site. If continuous walking/sitting cannot be convincing, use a composed turn/cut and a stationary seated pose. If arbitrary skeletal choreography becomes essential, reconsider Option A based on the proof, not sunk cost.

## 7. Proposed visual design and animation system

Keep the original near-black/slate palette, cyan primary accent, occasional purple for supporting research/AI details, Inter body/display text, and JetBrains Mono for small labels. Use one clear heading hierarchy, bounded reading widths, and comfortable text size. Avoid a border/glow/badge on every element. The character should occupy a deliberate illustration region, not sit behind readable copy.

Use normal semantic HTML sections. Desktop begins with name and one rotating role on the left, character greeting on the right. About reverses that balance. Projects receive most of the visual and reading space; the workstation becomes a small supporting composition. On mobile, stack content first and reduce the character to a bounded illustration. Avoid fixed-height text panels and global progress quotas for reading.

Role rotation is automatic, independent of scrolling: one stable line/region cycling the four requested roles with a short opacity/vertical transition and a comfortable hold. Reserve space to prevent layout shift; expose one stable accessible description instead of announcing every character. Pause decorative motion through a visible motion control and respect reduced-motion preferences. The original optional bio selector can remain, clearly authored and readable without waiting.

Use one section-local motion coordinator, with explicit scene poses and shared transition boundaries. Derive scroll progress from the relevant section's geometry, not total document height. Keep title/panel safe rectangles independent from character assets. Transitions should be reversible and meaningful throughout; idle motion may use elapsed time, but locomotion must use distance/progress. Stop unnecessary loops outside view and while hidden.

For 2.5D seating, use consistently authored approach/turn/seated poses anchored to the same desk coordinates. Do not scale a standing figure downward or dissolve a full-height body into a chair while it keeps moving. Use a short directed cut if contact cannot be established convincingly. Never require the visitor to watch the animation to reach projects.

Project demos must be real product screenshots, short opt-in recordings, or clearly labelled scripted walkthroughs using synthetic data. No fake terminal output, invented inference metrics, or live-looking success simulations. Defer videos until requested; show a poster and accessible text alternative.

## 8. Detailed page structure

1. **Header:** NITHISH.AI; About, Projects, Toolkit, Experience, Research, Contact; resume action. Working mobile menu, keyboard focus, hash links, and back/forward behavior. Workstation does not need its own top-level navigation item.
2. **Introduction:** Name, automatic rotating role, concise professional statement, View Projects, Resume, primary contact links. Bounded right-side greeting. First short scroll immediately changes composition; no 20% hold requirement.
3. **About:** Supporting avatar on left, professional summary on right; explain interests and engineering approach with links to relevant projects. Keep biography optional interaction compact.
4. **Desk transition:** Short bridge into work, conditional on approved visual quality. No standalone hardware/telemetry chapter; Projects remains directly reachable.
5. **Robin:** Largest feature case study. Real approved screenshot/poster, problem/use case, local/cloud boundary, reviewed-action workflow, architecture, current beta status, website and verified source availability. Small supporting seated character only if it does not reduce screenshot readability.
6. **Forge:** Real lesson/practice/review/interview walkthrough; honest authored-content status; current stack and source. Avoid deploying an assessment simulator merely to decorate the portfolio.
7. **Cognitive Memory Engine — LearnTrack:** Reviewed capture → evidence/checkpoint → recommendation → grounded recall, with source-linked screenshots; distinguish historical deployment from current V1.
8. **Other work:** ETA, then AI Diary; readable summaries, specific repositories, verified demo status, and optional details. Use vertical/grid discovery with genuine project media rather than one hidden horizontal rail.
9. **Technical toolkit:** Four concise groups—AI/ML, backend/data, frontend/desktop, delivery/tools—with project references. No proficiency percentages or unsubstantiated tool inventory.
10. **Experience:** Confirmed employment timeline separate from personal projects. IMET entry only with approved dates/title. Include concrete responsibilities without invented throughput or scale.
11. **Education:** Correct degree/institution/graduation, location/GPA only after conflicts are resolved.
12. **Research and certifications:** Paper title, authors, accepted/published status, real paper link when available; IBM/NPTEL and supported awards with credential/event evidence. Research interests are labelled as interests.
13. **Contact/footer:** Supported email, confirmed LinkedIn, GitHub, optional verified Hugging Face, resume. Prefer direct contact links initially. A future form must actually deliver and show truthful errors/success. All details remain readable without animation or WebGL.

## 9. Preserve

- Original NITHISH.AI identity, dark/cyan visual language, human photograph reference, confident name typography, and terminal-inspired biography interaction.
- Clear section navigation, actual project descriptions/achievements, specific code links, resume access, readable experience timeline, grouped skills, and direct contact routes.
- Modest card feedback and depth where it improves focus; reduced-motion alternatives everywhere.
- Robin as flagship, followed by Forge and Cognitive Memory Engine/LearnTrack as requested; preserve other projects with verified scope.

## 10. Remove

- Public HUD, manual scrubber, duplicate rig selectors, disabled audio indicator, port/version labels, fake workstation hardware/status, and implementation-comparison modal.
- Unsupported benchmarks, privacy guarantees, fabricated career/education copy, generic GitHub profile URLs labelled Repo, and false form success.
- Full-screen fixed content overlays, global spacer-controlled reading, long animation-only chapters, generic project illustrations presented as demonstrations, and skill percentages.
- In a later implementation cleanup, retire unused videos/frames/Soldier/starter assets and inactive components only after confirming no selected design uses them. Storage cleanup is not the primary current load fix. Nothing was deleted from the original application's assets during this audit.

## 11. Rebuild

- A single evidence-backed content model shared by project cards, details, navigation, and metadata.
- A responsive semantic document with real anchors, sufficient reading space, coherent type/spacing tokens, and accessible mobile navigation.
- A bounded character asset/motion system with a manifest and explicit supported actions; real project media independent of the character.
- Role rotation, optional authored bio interaction, honest contact behavior, correct resume/social links, metadata, motion control, and static fallbacks.
- A repeatable measurement/visual acceptance harness that samples intermediate states, reverse scroll, resize, and failure modes. Existing scripts with fixed CDP port 9222 and historical profiles should not be blindly rerun against other services.

## 12. Implementation phases — after review

1. **Content approval:** Resolve email/location/LinkedIn/GPA/degree dates, IMET history, paper status, public Robin source availability, credential links, project naming, and deploy/demo labels. Create a source/claim register; exclude unresolved numerical claims.
2. **Visual proof:** Produce the small Option B motion proof and desktop/mobile art direction. Review likeness/style, greeting/transition/contact quality, static fallback, and actual compressed/decoded size. Approve or simplify seating here.
3. **Content-first foundation:** Build navigation, normal sections, type/spacing system, project hierarchy, accessibility, metadata, and resume/contact behavior with static art. Confirm every visitor task before adding motion.
4. **Project evidence:** Add approved product screenshots, labelled synthetic walkthroughs, repository links, status notes, and opt-in recordings. Make Robin the strongest case study.
5. **Motion integration:** Add role rotation, optional bio transitions, bounded character scenes, shared local progress, pause/reduced motion, visibility/idle policy, and reverse handling. Recheck layout at every intermediate transition.
6. **Performance and release acceptance:** Test production delivery on a controlled network, ordinary laptop and physical phone, profile long tasks/memory, verify all links/forms, fix regressions, and collect reproducible screenshots/video. Deployment and publishing remain separate later actions.

Do not set a full-site effort estimate until the character art proof and approved content scope exist; these are the largest remaining uncertainties.

## 13. Performance targets and acceptance criteria

These are **proposed targets, not achieved measurements**.

### Delivery budgets

- Option B initial JavaScript ≤150 kB gzip; CSS ≤20 kB gzip; critical first-view body payload ≤1.5 MB including fonts/poster/initial character. Record both encoded transfer and decoded resource sizes.
- Total automatic media before user interaction ≤4 MB; resume and opt-in demo videos excluded and fetched only when requested. Avoid preloading all project media or a full frame sequence.
- If Option A wins the proof, target a deferred compressed character ≤1 MB and explicitly account for engine/decoder bytes; preserve the HTML first view without waiting for WebGL. Revisit the budget transparently if approved visual quality cannot fit it.
- Reserve image/role/avatar geometry to avoid layout shift; limit concurrently decoded animation media. Use measured texture/image inventories rather than a blanket “low VRAM” claim.

### Runtime and loading acceptance

- Production lab LCP ≤2.5 s, CLS ≤0.1, and tested interaction latency ≤200 ms under a named mobile network/CPU profile. INP must be measured with representative interactions/field data; a Lighthouse run alone does not establish field INP.
- Target 60 Hz visual motion on the named ordinary laptop, with p95 frame interval ≤20 ms during scripted forward/reverse transitions. Provide a stable static/reduced-motion path on constrained devices. Do not claim success based on one HUD reading.
- No recurring main-thread tasks >50 ms attributable to decorative animation during the tested scroll. Capture traces before and after optimization.
- No ongoing decoration work when hidden; settle idle renders/loops when motion is paused. Test repeated section visits, resize, and at least ten asset lifecycle cycles for sustained memory growth; report measurements, not assumed leak freedom.
- Record browser version, OS, device/CPU/GPU, viewport/DPR, refresh rate, power mode, network/CPU settings, build revision, cache state, and measurement method. Use at least three cold production runs and a separate warm run. Physical mobile results must be named separately from desktop emulation.

### Visitor and visual acceptance

- Name, professional statement, work CTA, resume, and contact are usable immediately; project access never depends on completing choreography.
- No stagnant animation-only scroll segment approaching a viewport. No large empty spacer added to slow the story. Long reading sections can naturally occupy more space without forcing motion.
- At 320, 390, 768, 1024, and 1440 CSS-pixel widths, plus 200% zoom, all text/actions remain reachable in normal document flow. No HUD/control obscures content; no unintended horizontal page overflow.
- Sample every transition at regular intermediate increments, pause there, reverse, jump via navigation, reload at a hash, and resize. Title/card safe zones must hold throughout. With 3D, stopped walking must stop locomotion pose progression; forward/reverse root and feet must agree. With 2.5D, no visible cutout sliding masquerading as walking.
- Seating is included only if hips/feet/hands and desk/chair match throughout at supported view sizes; otherwise use the approved directed cut or remove it.
- Robin, Forge, LearnTrack, ETA, and AI Diary each have an accurate summary, real evidence, specific available source, and truthful demo status. Every numerical claim has a reproducible source/method or is omitted.
- Keyboard navigation, focus visibility/return, modal Escape/focus containment, labelled inputs, screen-reader reading order, contrast, motion pause, reduced-motion, and static/error fallbacks pass. Copying text/contact details works.
- Contact navigation reaches contact. Any form success requires actual confirmed delivery. No email or form submission is performed merely as a decorative demonstration.

### Evidence index and outstanding verification

- `audit-evidence/desktop-00.jpg`, `desktop-10.jpg`: introduction and stationary opening.
- `desktop-24.jpg`, `desktop-36.jpg`: crossfade collision and About occlusion.
- `desktop-47.jpg`, `desktop-54.jpg`, `desktop-63.jpg`: approach and seating composition.
- `desktop-74.jpg`, `desktop-forge.jpg`: project presentation and incorrect Forge copy.
- `desktop-contact-nav.jpg`: Contact highlighted while Toolkit is displayed; `desktop-journey.jpg`, `desktop-research.jpg`, `desktop-connect.jpg`: final tab contents.
- `mobile-home.jpg`, `mobile-about.jpg`, `mobile-seat.jpg`, `mobile-projects.jpg`, `mobile-toolkit.jpg`: responsive overlap/clipping. `mobile-fresh-home.jpg` is a startup-state capture, not evidence of a persistent unloaded model.
- `original-home.jpg`, `original-experience.jpg`, `original-projects.jpg`, `original-awards.jpg`, `original-skills.jpg`, `original-contact.jpg`, `original-mobile-home.jpg`: reference visual review.
- `asset-measurements.json`, `browser-assets.json`, `browser-logs.json`, `lint.txt`, and reference snapshots preserve the supporting measurements/observations. Screenshot labels are rounded; the HUD/recorded positions above give more precision.
- Outstanding: primary publication/credential/employment evidence, personal-source conflicts, current LearnTrack deployed revision, AI Diary availability, Robin public source/release acceptance, production browser wire/performance traces, physical-device acceptance, detailed contact penetration/rig evaluation, and continuous screen recording. These limitations do not change the confirmed architectural and factual defects.

**Review checkpoint:** approve the corrected content direction, Option B proof scope, page structure, and performance budgets before any redesign implementation.
