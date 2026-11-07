# Stop-design-slop checklist (SUBSTITUTE SOURCE)

**Provenance:** the requested repo `Juuzoe/stop-design-slop` does not exist publicly (GitHub returns "Repository not found"; user Juuzoe has zero public repos, checked 2026-11-07 via the GitHub API). This file is built from the nearest same-named repo, **arnunym/stop-design-slop** @ 75971d7 (MIT, plugin v0.4.0, last commit 2026-05-12). It contains **no "removal tiers"** and no art-direction checks: its Typography, Color, Spacing, Hierarchy and critique-rubric sections are literally "*To be filled.*" Only the populated sections are extracted. If the lead has a different URL for the Juuzoe repo, this file must be redone.

Source: `skills/common-design-mistakes/SKILL.md`, `skills/signup-and-onboarding/SKILL.md`.

## Forms (applies to /contact and /demo)
- [ ] Every field has a real visible label above it; placeholders hold example values only.
- [ ] Mark the minority: label optional fields "Optional" instead of asterisking required ones.
- [ ] <= 5 fields per step; split longer forms into steps.
- [ ] Validation runs inline as the user types (email format, rules), not only on submit.
- [ ] Field constraints visible before the user fails them.

## Dark patterns (never ship)
- [ ] No card required up front for a free trial and no silent rollover to paid; send a reminder before any charge.
- [ ] No pre-ticked user-negative boxes (newsletter, data sharing, marketing consent).
- [ ] Cookie banner (if any) gives Reject equal weight, placement and click count as Accept.
- [ ] No confirmshaming reject copy ("No, I don't want to save money").
- [ ] Cancel is as many steps as sign-up.

## Generic AI-slop tells
- [ ] No indigo/purple gradients on near-black or near-white; no "near-black + gradient orb logo" Linear pastiche.
- [ ] No palette of lavender + soft pink + mint without semantic roles.
- [ ] No identical shadcn card grids (same radius, shadow, padding, no density variance); every card not the same size/weight/colour.
- [ ] Bento only when the content justifies unequal cells.
- [ ] No glassmorphism + 3D floating person + "trusted by" logo bar triptych.
- [ ] Inter not used as both display and body by default; no Space Grotesk + Inter applied without reason.
- [ ] No emoji as functional icons; no platform icon sets off-platform (SF Symbols on web); one icon style (not outline + filled + duotone mixed).
- [ ] No decorative icon beside every number; no stock outline icons in feature grids at headline weight.
- [ ] Empty, loading and error states are distinct (never one "No data" for all three).
- [ ] Skeletons only where content is actually variable; every spinner has a timeout and an error path.

## Dashboard tells (applies to product screenshots / Scout UI crops)
- [ ] Not the donut + KPI tile + line chart triptych.
- [ ] No faux real-time animated counters on data that updates in batches.
- [ ] No gauges, dials or skeuomorphic meters.

## Signup and onboarding
- [ ] Show value before asking for an account; no "Sign up to continue" gate before any value.
- [ ] Welcome screen sells the outcome, not the feature list.
- [ ] Ask personalisation questions only if the answers visibly change the next screen.
- [ ] Contextual, just-in-time hints instead of forced spotlight tours.
- [ ] Every OS permission request preceded by a pre-screen with a real reason.
- [ ] Empty states after signup seed a sample, a starter, or one clear next step (never a dead end).
- [ ] Any conversion-lift claim we cite names its source and context.
