# Fullstack Pleno Challenge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained 30-minute fullstack eligibility challenge with an intentionally incomplete candidate version and a complete evaluator reference solution.

**Architecture:** Use an npm-workspaces monorepo containing a small Express API and a React/Vite SPA. Keep business rules in a service behind an asynchronous in-memory repository, keep HTTP concerns in a controller and middleware, and isolate complete answers and hidden tests under `evaluator/`.

**Tech Stack:** Node.js 20+, TypeScript, npm workspaces, Express, React 18, Vite, Vitest, Supertest, React Testing Library

**Spec:** `docs/superpowers/specs/2026-09-14-fullstack-pleno-challenge-design.md`

## Global Constraints

- `npm install` must be sufficient; no Docker, database, VPN, private registry, or external service.
- `npm run dev` must start API on port 3001 and web on port 5173.
- Use only fictional patient data exactly as defined in `AGENTS.md`.
- Do not use `any`.
- Candidate files contain exactly two TODO markers.
- The reference solution must typecheck, build, and pass all tests.
- Keep the implementation deliberately small enough for a 30-minute exercise.

---

### Task 1: Workspace Foundation

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/tsconfig.node.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/index.html`

**Interfaces:**
- Produces: root scripts `dev`, `test`, `test:api`, `test:web`, `build`, and `typecheck`
- Produces: workspace packages `@challenge/api` and `@challenge/web`

- [ ] **Step 1: Define the workspace manifest**

Create npm workspaces for `apps/*`, add `concurrently`, and add the exact root scripts from `AGENTS.md`.

- [ ] **Step 2: Define TypeScript defaults**

Create strict shared compiler options targeting modern Node and browsers, with no implicit `any`.

- [ ] **Step 3: Define API tooling**

Add Express, CORS, TypeScript, `tsx`, Vitest, and Supertest scripts and dependencies.

- [ ] **Step 4: Define web tooling**

Add React 18, Vite, Vitest, jsdom, and React Testing Library scripts and dependencies. Configure `/api` to proxy to `http://localhost:3001`.

- [ ] **Step 5: Install dependencies**

Run: `npm install`

Expected: a root `package-lock.json` with no workspace resolution errors.

- [ ] **Step 6: Commit**

```bash
git add .gitignore package.json package-lock.json tsconfig.base.json apps/api/package.json apps/api/tsconfig.json apps/web/package.json apps/web/tsconfig.json apps/web/tsconfig.node.json apps/web/vite.config.ts apps/web/index.html
git commit -m "chore: scaffold challenge workspaces"
```

### Task 2: Candidate API

**Files:**
- Create: `apps/api/src/models/patient.ts`
- Create: `apps/api/src/repositories/patient.repository.ts`
- Create: `apps/api/src/errors/not-found.error.ts`
- Create: `apps/api/src/services/eligibility.service.ts`
- Create: `apps/api/src/controllers/eligibility.controller.ts`
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/server.ts`
- Create: `apps/api/tests/eligibility.e2e.test.ts`

**Interfaces:**
- Produces: `PatientRepository.findById(patientId: string): Promise<Patient | null>`
- Produces: `EligibilityService.execute(patientId: string): Promise<EligibilityResult>`
- Produces: Express `app`
- Produces: `GET /health` and `GET /api/patients/:patientId/eligibility`

- [ ] **Step 1: Write the public HTTP test**

Test `patient-001` and assert status 200 with:

```ts
{
  patientId: 'patient-001',
  eligible: true,
  reasons: [],
}
```

- [ ] **Step 2: Create domain types and repository**

Define `EligibilityReason`, `Exam`, `Patient`, and `EligibilityResult` exactly as specified. Add the four exact patients and an asynchronous `findById`.

- [ ] **Step 3: Create error handling and HTTP wiring**

Add `NotFoundError`, a controller that calls the service, `/health`, the eligibility route, CORS, JSON middleware, and error middleware returning `{ message: 'Patient not found' }` for 404.

- [ ] **Step 4: Create the intentional service exercise**

Look up the patient, throw `NotFoundError` when absent, retain one `TODO: implementar regra de elegibilidade.`, and throw `new Error('Not implemented')`.

- [ ] **Step 5: Verify candidate compilation**

Run: `npm run typecheck -w apps/api && npm run build -w apps/api`

Expected: PASS; runtime behavior test may fail only because of the intentional TODO.

- [ ] **Step 6: Commit**

```bash
git add apps/api
git commit -m "feat: add candidate eligibility API"
```

### Task 3: Candidate Web Application

**Files:**
- Create: `apps/web/src/types/eligibility.ts`
- Create: `apps/web/src/services/eligibility-api.ts`
- Create: `apps/web/src/components/EligibilityCard.tsx`
- Create: `apps/web/src/components/EligibilityCard.test.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/styles.css`
- Create: `apps/web/src/test/setup.ts`
- Create: `apps/web/src/vite-env.d.ts`

**Interfaces:**
- Consumes: `GET /api/patients/:patientId/eligibility`
- Produces: `getEligibility(patientId: string): Promise<EligibilityResponse>`
- Produces: `EligibilityCard({ patientId }: { patientId: string })`

- [ ] **Step 1: Write the public component test**

Render `EligibilityCard` and assert a button named `Verificar elegibilidade`.

- [ ] **Step 2: Add the typed API client**

Fetch `/api/patients/${encodeURIComponent(patientId)}/eligibility`, reject non-OK responses with `Unable to fetch eligibility`, and return typed JSON.

- [ ] **Step 3: Create the intentional component exercise**

Import `useState`, the API client, and response type; retain one `TODO: implementar estados e integração com a API.` and render the initial button in a section.

- [ ] **Step 4: Build the application shell**

Render a Portuguese heading, associated label and select for all four patient IDs, and the card keyed by selected patient ID. Add minimal responsive CSS and semantic HTML.

- [ ] **Step 5: Verify candidate compilation**

Run: `npm run typecheck -w apps/web && npm run build -w apps/web`

Expected: PASS and a Vite production bundle.

- [ ] **Step 6: Commit**

```bash
git add apps/web
git commit -m "feat: add candidate eligibility interface"
```

### Task 4: Evaluator Materials and Reference Solution

**Files:**
- Create: `evaluator/README.md`
- Create: `evaluator/rubric.md`
- Create: `evaluator/reference-solution/eligibility.service.ts`
- Create: `evaluator/reference-solution/EligibilityCard.tsx`
- Create: `evaluator/reference-solution/eligibility-api.ts`
- Create: `evaluator/tests/eligibility.e2e.test.ts`
- Create: `evaluator/tests/EligibilityCard.test.tsx`
- Create: `evaluator/reference-solution.patch`

**Interfaces:**
- Consumes: candidate API and web contracts
- Produces: complete service and component drop-in replacements
- Produces: evaluator coverage for all required business and UI states

- [ ] **Step 1: Write evaluator API tests**

Cover the exact results for `patient-001` through `patient-004` plus unknown-patient 404.

- [ ] **Step 2: Write evaluator web tests**

Mock `getEligibility` and cover initial button, disabled loading state, eligible response, ineligible response, and rejected request using visible behavior.

- [ ] **Step 3: Implement the reference backend**

Accumulate reasons in order: inactive, invalid document, no exams, ineligible exam. Return `eligible: reasons.length === 0`.

- [ ] **Step 4: Implement the reference frontend**

Use `result`, `isLoading`, and `error` state; disable the button during requests; clear stale state before each request; render the exact Portuguese result and error messages in an `aria-live="polite"` region.

- [ ] **Step 5: Generate the reference patch**

Create a patch that replaces the two candidate TODO files. Keep the
already-complete API client as a separate reference file for review
convenience because it has no candidate/reference diff.

- [ ] **Step 6: Write evaluator guidance and rubric**

Document the 100-point rubric, score bands, four discussion questions, reference application steps, test commands, and warning that `evaluator/` must not be distributed.

- [ ] **Step 7: Commit**

```bash
git add evaluator
git commit -m "docs: add evaluator kit and reference solution"
```

### Task 5: Candidate Documentation and End-to-End Validation

**Files:**
- Create: `README.md`
- Modify if required: files from Tasks 1-4

**Interfaces:**
- Produces: candidate setup and exercise instructions without revealing implementation
- Verifies: install, typecheck, build, tests, dev startup, and HTTP behavior

- [ ] **Step 1: Write candidate README**

Include the exact setup, URLs, rule list, reason codes, endpoint, frontend behavior, test command, and final discussion prompt from `AGENTS.md`, without solution hints.

- [ ] **Step 2: Verify intentional TODO scope**

Run:

```bash
rg -n "TODO" apps/api/src apps/web/src
```

Expected: exactly the service TODO and component TODO.

- [ ] **Step 3: Verify the candidate baseline**

Run:

```bash
npm run typecheck
npm run build
```

Expected: PASS. Candidate tests may fail only where they exercise unfinished behavior.

- [ ] **Step 4: Verify the reference solution**

Temporarily copy the evaluator service and component over the candidate files, run `npm test`, `npm run typecheck`, and `npm run build`, then restore the candidate files.

Expected: all commands PASS.

- [ ] **Step 5: Smoke-test the running application**

Run `npm run dev`, request `/health`, all four known patients, and one unknown patient, then confirm the frontend root returns HTTP 200.

Expected: exact JSON and status codes from `AGENTS.md`.

- [ ] **Step 6: Confirm candidate files were restored**

Run the TODO scan again and rerun root typecheck and build.

Expected: exactly two TODOs; typecheck and build PASS.

- [ ] **Step 7: Commit**

```bash
git add README.md package-lock.json .
git commit -m "docs: finalize candidate challenge"
```
