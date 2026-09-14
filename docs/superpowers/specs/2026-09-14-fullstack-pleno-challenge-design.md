# Fullstack Pleno Challenge Design

## Goal

Create a self-contained technical challenge that evaluates a mid-level
fullstack candidate through a small end-to-end eligibility feature. The
candidate should spend approximately 20-25 minutes implementing the feature
and retain 5-10 minutes for tests and discussion.

## Repository Shape

The project is an npm-workspaces monorepo with two applications:

- `apps/api`: Node.js, TypeScript, Express, Vitest, and Supertest.
- `apps/web`: React, TypeScript, Vite, Vitest, and React Testing Library.

The root owns shared scripts and development orchestration. No database,
container, external service, authentication system, or private dependency is
required.

## Backend Design

The API exposes:

- `GET /health`
- `GET /api/patients/:patientId/eligibility`

An in-memory repository contains the four fictional patients defined in
`AGENTS.md`. The controller delegates to `EligibilityService`, which owns all
eligibility rules and raises `NotFoundError` for an unknown patient. Express
error middleware maps that error to the required 404 response and treats
unexpected errors as HTTP 500.

The candidate version leaves only the rule implementation in
`apps/api/src/services/eligibility.service.ts` unfinished. Infrastructure,
routing, repository access, and error handling are complete.

## Frontend Design

`App` renders a semantic heading, a labeled patient selector containing the
four fictional patient IDs, and `EligibilityCard` for the selected patient.
The card calls the prebuilt API client and presents explicit idle, loading,
eligible, ineligible, and error states. A changed patient resets stale output
because the card is keyed by patient ID.

The candidate version leaves only state and API integration in
`apps/web/src/components/EligibilityCard.tsx` unfinished. The button and
semantic structure are provided.

## Candidate and Evaluator Separation

The distributed application contains exactly two TODO markers:

- `apps/api/src/services/eligibility.service.ts`
- `apps/web/src/components/EligibilityCard.tsx`

`evaluator/reference-solution` stores complete replacement files, while
`evaluator/tests` stores evaluator-only behavior tests. The evaluator guide
explains how to apply the reference solution without exposing it as part of
the candidate instructions.

## Data and Error Flow

1. The user chooses a patient and activates the eligibility button.
2. The card enters loading state and calls the typed API client.
3. Express resolves the patient through the repository.
4. The service returns all applicable reasons, or raises `NotFoundError`.
5. The UI displays the result or a stable Portuguese error message.

The API client rejects every non-successful HTTP response. Eligibility
failure is represented only by a successful response with `eligible: false`;
transport or server failures are not confused with business ineligibility.

## Testing and Validation

Public tests demonstrate one API success scenario and the initial frontend
button. Evaluator tests cover all four business cases, 404 handling, loading,
eligible and ineligible results, and API failure.

Validation uses only project-provided commands:

1. `npm install`
2. `npm run typecheck`
3. `npm run build`
4. Apply the reference solution and run `npm test`
5. Run the development servers and smoke-test health plus all eligibility
   endpoints
6. Restore the candidate TODO files and confirm only intentional failures
   remain

## Non-Goals

The implementation intentionally excludes persistence, authentication,
Docker, external APIs, advanced state management, schema frameworks beyond
what the small boundary requires, and architectural abstractions that do not
improve the 30-minute exercise.
