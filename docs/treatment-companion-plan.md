# Artizone Treatment Companion — Implementation Plan

Status: Planned  
Owner: Artizone  
Target site: https://artizonespa.com  
Companion: https://artizone-ai-advisor.maher-alfarr-0923.chatgpt.site  
Audience: Public visitors; no login, no payment, free to use

## Goal

Add a high-conversion Treatment Companion entry point to the Artizone homepage. A visitor selects a treatment they already had or plan to have, then receives:

- preparation or aftercare guidance;
- suitable product categories;
- safe movement or exercise guidance;
- the best compatible Artizone add-on, follow-up or package;
- direct booking and WhatsApp actions.

The commercial goal is to increase treatment continuity, product enquiries, package discovery, repeat bookings and average order value without putting a login wall in front of the customer.

## Customer journey

1. Visitor lands on the Artizone homepage.
2. Hero introduces the free Treatment Companion.
3. Visitor opens the companion without creating an account.
4. Visitor selects:
   - **I’m planning it**, or
   - **I already had it**.
5. Visitor chooses a treatment category and exact treatment.
6. Companion produces a personalised care plan.
7. Visitor can:
   - ask Artizone about recommended products on WhatsApp;
   - book the suggested follow-up treatment or package;
   - print/save the plan;
   - start again for another treatment.

## Homepage hero change

### Eyebrow

`FREE · NO LOGIN · 2 MINUTES`

### Headline

`Had a treatment—or planning one?`

### Description

`Get your free personalised preparation, aftercare, product and next-treatment plan in two minutes. No login required.`

### Primary CTA

`Build My Free Care Plan`

### Secondary CTA

`Explore Treatments`

### CTA behavior

- Primary CTA opens the companion in the cleanest supported experience.
- Prefer an in-page modal or drawer on desktop and full-screen flow on mobile.
- If embedded delivery is not practical, open the public companion URL in the same tab with a clear **Back to Artizone** route.
- Do not require authentication or collect personal details before showing results.

## Treatment taxonomy

Keep the existing Artizone catalog structure and naming rules:

1. Face & Skin Care
2. Advanced Skin Treatments
3. Laser Hair Removal
4. Body Slimming & Contouring
5. Waxing, Threading & Brows
6. Nails & Foot Care
7. Men’s Grooming & Aesthetics
8. Packages

Requirements:

- Keep **Advanced Skin Treatments** separate from **Face & Skin Care**.
- Use **Laser Hair Removal**, not “Laser & Advanced”.
- Keep men’s services as a separate path.
- Do not duplicate the Nails section.
- Reuse the live treatment names, prices, package inclusions, durations, badges and loyalty points from the canonical catalog.

## Recommendation model

Each treatment record should support:

```ts
type TreatmentCompanionRecord = {
  id: string;
  slug: string;
  category: string;
  name: string;
  priceJod?: number;
  durationMinutes?: number;
  preparation: string[];
  aftercare: string[];
  productRecommendations: {
    label: string;
    productId?: string;
    reason: string;
  }[];
  movementGuidance?: string;
  recommendedNextSteps: {
    treatmentId?: string;
    packageId?: string;
    reason: string;
    minimumWait?: string;
  }[];
  redFlags: string[];
  sourceReviewedAt: string;
  clinicallyApproved: boolean;
};
```

Rules:

- Display product categories until actual Artizone product SKUs, inventory and prices are confirmed.
- Never imply that an upsell is medically required.
- Treat recommendations as educational and conditional on the customer’s consultation.
- Show the treating professional’s instructions as authoritative.
- If red-flag symptoms are selected, stop the sales path and show appropriate medical guidance.
- Do not make diagnoses or guarantee outcomes.

## Initial treatment coverage

Prioritise the current business mix:

### Phase 1 — Skin and facial care

- Signature ArtiZone Facial
- HydraFacial
- Chemical Peels
- RF Microneedling
- Carbon Laser Facial
- LED Light Therapy
- Acne & Scar Care
- Skin Boosters
- Anti-Aging Collagen Lift

### Phase 2 — Body and slimming

- Cryolipolysis (Fat Freezing)
- Ultrasound Cavitation
- RF Skin Tightening
- EMS Body Sculpting
- Lymphatic Drainage Massage
- Cellulite Therapy
- Detox Body Wraps
- Custom Slimming Programs

### Phase 3 — Laser, grooming and maintenance

- Full Body Laser
- Face & Neck Laser
- Underarms & Bikini Laser
- Full Legs & Arms Laser
- Small Zone Laser Session
- Laser Touch-Up Plan
- Waxing, threading and brows
- Nails and foot care
- Men’s treatments

## Upsell strategy

Every result should contain one primary next step and no more than two secondary suggestions.

Examples:

| Selected treatment | Product support | Primary next step |
|---|---|---|
| Signature ArtiZone Facial | Gentle cleanser, moisturiser, SPF | Glow Starter Package |
| Chemical Peel | Recovery cream, gentle cleanser, SPF | Skin Booster Hydration after full healing |
| RF Microneedling | Clinic-approved recovery care, SPF | LED Light Therapy if clinically suitable |
| Full Body Laser | Gentle body wash, fragrance-free moisturiser | Laser Essentials Bundle |
| Cryolipolysis | Hydration and body-care support | Full Body Slimming Plan |
| EMS Body Sculpting | Hydration and progress tracking | Custom Slimming Program |
| Gentleman’s Deep-Clean Facial | Face wash, moisturiser, SPF | Men’s Grooming Package |

## Conversion links

- Booking: `https://artizonespa.com/booking`
- Services: `https://artizonespa.com/services`
- WhatsApp: `https://wa.me/962790412758`
- Companion: `https://artizone-ai-advisor.maher-alfarr-0923.chatgpt.site`

WhatsApp messages should be prefilled with the selected treatment and recommended next step. Do not send a message until the customer explicitly taps the WhatsApp action.

## Analytics

Track anonymous funnel events only:

- `companion_cta_viewed`
- `companion_started`
- `journey_moment_selected`
- `treatment_category_selected`
- `treatment_selected`
- `care_plan_viewed`
- `product_whatsapp_clicked`
- `next_step_booking_clicked`
- `plan_printed`
- `companion_restarted`

Event properties:

- treatment ID;
- category;
- journey moment: planning or after;
- recommended next-step ID;
- device class;
- referrer/UTM values.

Do not place medical answers, free text, contact details or other sensitive health information into analytics.

## Delivery phases

### 1. Content and clinical review

- Export the canonical Artizone treatment and package catalog.
- Confirm treatment naming, price, duration, package inclusion, badge and loyalty-point data.
- Have the appropriate Artizone professional approve preparation, aftercare, product and movement guidance.
- Add a review owner and review date to every record.

### 2. Homepage integration

- Add the Treatment Companion description and CTA to the homepage hero.
- Preserve existing **Book Appointment** and **Explore Treatments** access.
- Add mobile-first modal/full-screen behavior.
- Add the public companion return path to Artizone.

### 3. Catalog integration

- Move companion content out of the UI component and into typed data.
- Connect treatment and package IDs to the existing booking catalog.
- Make prices and availability derive from one canonical source.
- Add product SKU links only after catalog confirmation.

### 4. Conversion and measurement

- Add anonymous funnel events.
- Prefill booking/WhatsApp with treatment context.
- Add UTM attribution from the Artizone hero.
- Create a simple weekly funnel report:
  - hero views;
  - companion starts;
  - completed plans;
  - product enquiries;
  - booking clicks;
  - estimated assisted revenue.

### 5. Quality and launch

- Test all treatments in both planning and aftercare journeys.
- Test keyboard navigation, focus trapping and Escape behavior.
- Test small mobile screens and Arabic/English text expansion readiness.
- Verify that urgent/red-flag states never show an aggressive sales CTA.
- Validate external links and WhatsApp message text.
- Run type-check, lint, tests and production build.
- Launch behind a feature flag, then review conversion and safety feedback after the first week.

## Acceptance criteria

- [ ] Homepage hero clearly explains the free Treatment Companion.
- [ ] Customer can start without login, payment or contact details.
- [ ] Planning and aftercare journeys are both supported.
- [ ] All treatment categories follow the approved Artizone taxonomy.
- [ ] Recommendations include care, products, movement and a next step.
- [ ] Booking and WhatsApp carry the selected treatment context.
- [ ] Red-flag flows prioritise safety and suppress inappropriate upsells.
- [ ] No sensitive health information is sent to analytics.
- [ ] Guidance has an Artizone reviewer and review date.
- [ ] Mobile, keyboard and screen-reader flows pass QA.
- [ ] All links, prices and package references match the live Artizone catalog.
- [ ] The feature can be disabled without removing the existing booking journey.

## Definition of done

The Treatment Companion is considered complete when a public visitor can move from the Artizone hero to a useful treatment-specific plan, understand the correct preparation or aftercare, discover a relevant product or follow-up, and reach booking or WhatsApp without signing in—while clinical review, privacy, accessibility and analytics requirements are satisfied.
