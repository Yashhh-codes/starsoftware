---
name: design-system-stripe
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Stripe

## Mission
Deliver implementation-ready design-system guidance for Stripe that can be applied consistently across marketing site interfaces.

## Brand
- Product/brand: Stripe
- URL: https://stripe.com/in
- Audience: buyers, teams, and decision-makers
- Product surface: marketing site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=sohne-var`, `font.family.stack=sohne-var, SF Pro Display, sans-serif`, `font.size.base=16px`, `font.weight.base=300`, `font.lineHeight.base=20px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=16px`, `font.size.lg=18px`, `font.size.xl=20px`, `font.size.2xl=22px`, `font.size.3xl=26px`, `font.size.4xl=32px`
- Color palette: `color.text.primary=#50617a`, `color.text.secondary=#533afd`, `color.text.tertiary=#061b31`, `color.text.inverse=#ffffff`, `color.surface.base=#000000`, `color.surface.strong=#e3ecf7`
- Spacing scale: `space.1=2px`, `space.2=5.5px`, `space.3=10.5px`, `space.4=11.5px`, `space.5=12px`, `space.6=12.5px`, `space.7=13.5px`, `space.8=14.5px`
- Radius/shadow/motion tokens: `radius.xs=4px` | `motion.duration.instant=100ms`, `motion.duration.fast=200ms`, `motion.duration.normal=240ms`, `motion.duration.slow=300ms`, `motion.duration.slower=400ms`, `motion.duration.step6=800ms`, `motion.duration.step7=1200ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
