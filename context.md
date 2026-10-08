CONTEXT
You're working inside my existing Next.js repo for my personal portfolio (Mori Aryan, CSE undergrad, SVNIT Surat). Before doing anything, read the repo: package.json, app/, components, and any existing DB, auth or upload setup. Work with what's already installed.

Stack: Next.js App Router, TypeScript, Tailwind, Framer Motion, MongoDB + Mongoose. Do not add heavy dependencies (Three.js, GSAP, etc.) without asking me first.

GROUND RULES
- Work in the phases below, in order. At the end of each phase, stop, summarize what changed and how I should test it, and wait for me. Do not start the next phase.
- Modify existing files where sensible. Do not rewrite the whole site in one pass.
- If my brief conflicts with the repo, or two pieces of content conflict, list the conflict and ask me. Do not guess.
- Never invent numbers, dates, user counts, metrics or achievements. If a field needs data I haven't given, leave it empty and list it for me at the end of the phase.
- I do not want a maximally complex site. I want a small number of interactions done really well.

WHAT THIS SITE IS
Not a résumé split into sections. A journey: one continuous path the visitor travels along, where each section is a place on that path (start, the road so far, the workshop, the research outpost, capabilities, the vault, the crossroads). Section names and order are editable from admin.

=== PHASE 1: FIX THE PROJECT VAULT (mobile first, nothing else) ===
The existing implementation is in app/components/ProjectVault.tsx. Refactor it, keep it self-contained, and keep using a local array of projects for now. If I attached a screen recording or screenshots of Instagram Instants, that reference overrides anything below about visuals and timing.

The Vault holds my fun and side projects that are NOT in the featured list. The point is fast, tactile flicking through them, like flicking through instant photos.

Behavior:
- A messy pile. The top card is fully visible and 2 to 3 cards peek out beneath it, slightly offset, rotated and scaled.
- Tap anywhere on the top card and it flicks away with a fast spring and a tiny overshoot. The pile shifts up and the next card becomes active.
- I can go back. Swipe right on the pile (or press ArrowLeft on desktop) and the most recently dismissed card returns to the top with the reverse motion. Going back from the first card rubber-bands and does not wrap.
- The stack is finite. It does NOT loop endlessly. When the last card is dismissed the pile is empty. After a short beat, the cards re-deal into a fresh messy pile with a quick stagger, and it starts again.
- No arrows and no swipe hints. At most, one small unobtrusive counter.
- The title, one-line hook, tech and link for the active card sit beneath the stack and crossfade quickly as the top card changes.
- "View" opens a lighter detail sheet using a shared-element transition from the card. Closing it returns the card to its exact slot in the pile. Full chaptered project pages are for featured projects only.

Mobile correctness matters most:
- Vertical page scrolling must never be hijacked. Handle horizontal gestures only (touch-action: pan-y). A scroll must never register as a tap, and a tap must never fire twice.
- Animate transform and opacity only. Render only the top ~4 cards and preload the next 2 images.
- Any randomness in card rotation or corner shape must be deterministic per card (seeded), so there are no hydration mismatches.
- Respect prefers-reduced-motion with a simple crossfade.

Desktop: click, ArrowLeft/ArrowRight and Space, active only while the vault is in view or focused. Do not capture the page scroll wheel.

=== PHASE 2: DATA LAYER AND ADMIN ===
Goal: I can change anything on the site without touching code.

First, propose the schema in a short summary and wait for approval. It should cover: profile (hero text, bio, current focus, what I'm learning, internship goal, contact email, avatar, SEO metadata), social and coding links with editable display text (e.g. "LeetCode: 400+ solved"), resume, education, experience, research, projects, skills, achievements, positions of responsibility, journey and timeline entries, and section order and visibility.

Projects have: slug, cover, gallery, hook, problem, tech, year, status, links, optional chapters, isFeatured (hard cap of 5), isVault, order, and published.

Admin:
- A hidden /admin route that is not linked anywhere and is noindex.
- Single-owner auth. Choose the simplest secure option (e.g. NextAuth credentials with a hashed password from env) and tell me why. Use httpOnly session cookies and rate-limit login. Every admin API route must verify the session server-side, not just in middleware.
- Full CRUD for every model above, drag-and-drop reordering, publish/unpublish, featured/vault toggles, and image upload (use whatever storage the repo already uses, otherwise recommend one).
- Usable on my phone.
- Resume: I set the current resume file or link in admin. The public site exposes a stable /resume route that always redirects to the current one, so links that were printed or shared never break.
- Validate all input with zod. No secrets in the repo.

Public site:
- Server components read from MongoDB.
- Every admin save triggers revalidateTag or revalidatePath, so changes appear on the live site immediately without a redeploy.
- If the DB is empty or unreachable, fall back to seed data so the public site is never blank.
- Write an idempotent seed script from the SEED CONTENT below.
- Move the Vault to read from the DB.

=== PHASE 3: THE JOURNEY (content and structure) ===
Restructure the page as one continuous path with these places:
1. Trailhead: hero with name, one-line description and current focus.
2. The Road So Far: timeline (SVNIT, HSC and JEE, ACM, MindBend, hackathons, ISRO research). Achievements live on this road, not in a separate counters section.
3. The Workshop: featured projects (max 5) with chaptered project pages: problem, how I built it, the hard parts, result, what I'd change. Chapters are optional per project and hidden if empty.
4. The Research Outpost: the ISRO-sponsored project. Frame it honestly as a faculty-led, ISRO-sponsored project at SVNIT.
5. Capabilities: no progress bars. Group by category, highlight my "top skills", and on hover or tap show which projects used each skill.
6. The Vault.
7. The Crossroads: minimal contact and the resume link.

Motion is fast and confident: springs and momentum, no slow fade-ins. Every interaction should have a purpose.

=== PHASE 4: THE TRAVELLER ===
A silent companion that travels the site with the visitor.

What it must be:
- Present along the whole journey, not parked in a corner. It moves with the visitor's scroll at their pace, speeds up when they scroll fast, stops when they stop, and rests after a while of inactivity.
- Never the main character. A visitor could go through the whole site and only realize afterwards that someone was walking with them. No speech bubbles, no text, no tooltips, no popups, no distractions.
- Aware of place, quietly. Its posture or behavior shifts by section (for example, it pauses while the visitor flicks through the Vault, and it steps back when a project opens). It never blocks content or click targets (pointer-events: none).
- Thoughtful and human-scale, with crafted character. Not a robot, not a cartoon mascot, not a generic astronaut.

Directions to consider (not a spec; propose something better if you have it):
- A surveyor or cartographer walking the path, with the trail behind them drawing itself like a map contour. It echoes my remote-sensing research.
- A lone walker whose lantern makes the path ahead legible. The light is the only thing that reacts.
- A silhouetted figure with a satchel that quietly collects what the visitor visits, tying into the Vault.
- A hand-drawn figure that shares the same visual language as the path line.
Anything from my own story is fair game (earth observation, farming and procurement, code, hackathon nights), but keep it subtle and never literal.

Technical constraints:
- Use the lightest approach that still looks hand-made (SVG, CSS, Framer Motion). Lottie or Rive only if you justify it. No video and no large GIFs. Tell me the added weight in KB.
- Drive it from scroll motion values, not React state, so there is no jank and no re-render storms.
- Respect prefers-reduced-motion. On mobile it must not cover content. If it can't work there, ship a simplified version.
- Add an on/off toggle in admin.

PROCESS GATE: before writing any code for this phase, give me a one-paragraph concept and a short description of its behaviors, and wait for my approval.

=== PHASE 5: POLISH ===
Performance sanity (lazy images, no layout shift, no unused heavy libraries), accessibility basics, and editable SEO metadata. Optional and desktop-pointer-only: a custom cursor with a soft ring, smooth interpolation, expanding over buttons and compressing on click. Ask me before building it.

=== SEED CONTENT (resume is the source of truth) ===
Name: Mori Aryan. Keep the existing hero text and contact email from the current site. Links: take the LinkedIn, GitHub, LeetCode and Codeforces URLs from the current repo. Show LeetCode as "400+ solved". Leave Codeforces rating blank.

Education: SVNIT Surat, B.Tech CSE, 2024 to 2028. Dholakiya School, Rajkot, HSC, 2022 to 2024. Keep CGPA out of the public seed. I'll add it from admin if I want it.

Experience: Machine Learning Research Intern (ISRO-sponsored project), SVNIT CSE Dept, under faculty supervision, Dec 2025 to present. Topic: super-resolution and fusion of hyperspectral and multispectral images.
- Implemented transformer-based hyperspectral super-resolution models in PyTorch.
- Reproduced and benchmarked EDSR and RCAN, training both for 300+ epochs on a custom dataset, comparing reconstruction quality with quantitative metrics and visual analysis.
- Currently extending the pipeline with frequency-guided attention inspired by FreqNet, with frequency-domain (FFT) analysis.
- Leave metric fields empty (PSNR, SSIM, dataset size, bands) for me to fill.

Projects:
- Rabuste Coffee: a live full-stack platform for a real cafe. Next.js, TypeScript, Supabase (PostgreSQL), Prisma, Razorpay, Tailwind. Online ordering, QR pickup verification, workshop bookings, loyalty rewards, payments, an AI admin dashboard, a normalized schema, and role-based auth for Customers, Staff, Managers and Admins.
- OrbitOS: an interactive 3D OS explorer. Python, WebSockets, Next.js, Three.js, React Three Fiber, Scapy. The task manager becomes a 3D solar system of 200+ processes with live CPU and RAM. OS metrics stream every 500 ms via psutil and WebSockets. A traceroute visualizer shows real packet travel on a 3D globe using ICMP tracing and IP geolocation.
- VendorBridge: a procurement and vendor-management ERP built at the Odoo x KSV Hackathon. React, Node, Express, MongoDB, JWT. Role-based workflows for Procurement Officers, Vendors, Managers and Admins.
- SIH 2026 (PS 26032): a farmer procurement slot-booking and queue-management platform. Won the internal round.
- NextEvent Now and Sehat Mitra AI Assistant exist on my current portfolio but not on my resume. Ask me whether each is featured, vault, or removed.

Achievements: Smart India Hackathon 2026, winner of the internal round. Arbitrum Builder Pods 2026, top 5 team in the state-level competition. Odoo x Indus University Hackathon 2026, finalist.
CONFLICT TO ASK ME ABOUT: the current portfolio lists "SIH 2025 Internal Round Participant", "IBM Hackathon 2025 Participant" and "Finalist, ACM Summer Challenge 2025". Do not seed them until I confirm.

Positions: Executive, ACM SVNIT Surat, since 2025. Co-Head, MindBend (Gujarat's largest techno-managerial fest), SVNIT Surat, since 2025.

Skills (from resume): C++, Python, JavaScript, TypeScript; React, Next.js, HTML, CSS, Tailwind; Node, Express, REST, WebSockets, authentication; PostgreSQL, MongoDB, Supabase, Prisma, Mongoose; PyTorch, scikit-learn, Pandas, NumPy, OpenCV; Git, GitHub, Linux, Jupyter; DSA, OOP, DBMS, OS, networks. XGBoost and Google Cloud appear only on the old portfolio, so ask me before seeding them.

Current focus, what I'm learning and internship goal: leave blank for me to fill from admin.