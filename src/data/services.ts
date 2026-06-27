export interface Treatment {
  name: string;
  duration: string;
  price: string;
  description: string;
  popular?: boolean;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceDetail {
  slug: string;
  name: string;
  tagline: string;
  heroDescription: string;
  imageSlot: string;
  videoSlot?: string;
  accentColor: string;
  intro: string;
  benefits: string[];
  treatments: Treatment[];
  howItWorks: { step: string; title: string; body: string }[];
  faqs: ServiceFAQ[];
  results: string;
  seoTitle: string;
  seoDescription: string;
}

export const servicesData: ServiceDetail[] = [
  {
    slug: 'face-skin-care',
    name: 'Face & Skin Care',
    tagline: 'Reveal Your Best Skin',
    heroDescription: 'Advanced facial treatments tailored to your skin type — from deep cleansing to anti-aging.',
    imageSlot: 'services/face-skin-care',
    videoSlot: 'services/facial-video',
    accentColor: '#C4A882',
    intro: 'Our face and skin care treatments are designed to address every skin concern — from acne and pigmentation to dullness and aging. Using internationally certified products and the latest technology, our certified aestheticians create a personalised treatment plan that delivers visible, lasting results.',
    benefits: [
      'Deeply cleanses pores and removes impurities',
      'Brightens and evens skin tone',
      'Reduces fine lines and signs of aging',
      'Hydrates and restores skin barrier',
      'Targets acne, pigmentation, and scarring',
      'Stimulates collagen production',
    ],
    treatments: [
      { name: 'Deep Cleansing Facial', duration: '60 min', price: 'From 35 JD', description: 'A thorough cleanse, exfoliation, extraction, and mask tailored to your skin type.', popular: false },
      { name: 'Hydrafacial', duration: '75 min', price: 'From 65 JD', description: 'Multi-step treatment that cleanses, exfoliates, extracts, and infuses serums for instant glow.', popular: true },
      { name: 'Chemical Peel', duration: '45 min', price: 'From 50 JD', description: 'Exfoliating acid treatment to resurface skin, reduce pigmentation, and improve texture.', popular: false },
      { name: 'Microneedling', duration: '60 min', price: 'From 80 JD', description: 'Collagen-induction therapy using fine needles to rejuvenate skin and reduce scars.', popular: true },
      { name: 'Anti-Aging Treatment', duration: '90 min', price: 'From 90 JD', description: 'Targeted treatment combining peptides, RF, and LED to firm and lift mature skin.', popular: false },
      { name: 'Brightening Facial', duration: '60 min', price: 'From 45 JD', description: 'Vitamin C-rich treatment to fade dark spots and restore radiance.', popular: false },
      { name: 'Oxygen Facial', duration: '60 min', price: 'From 55 JD', description: 'Pressurised oxygen infusion to plump, hydrate, and revive tired skin.', popular: false },
      { name: 'LED Light Therapy', duration: '30 min', price: 'From 25 JD', description: 'Red and blue light wavelengths to treat acne, reduce inflammation, and boost collagen.', popular: false },
    ],
    howItWorks: [
      { step: '01', title: 'Skin Consultation', body: 'Your specialist assesses your skin type, concerns, and goals to recommend the ideal treatment.' },
      { step: '02', title: 'Preparation', body: 'Skin is cleansed and prepped to ensure maximum absorption and treatment effectiveness.' },
      { step: '03', title: 'Treatment', body: 'Your chosen facial is performed using premium products and professional techniques.' },
      { step: '04', title: 'Post-Care Guidance', body: 'You receive personalised aftercare advice and a recommended home routine to maintain results.' },
    ],
    faqs: [
      { q: 'How often should I get a facial?', a: 'For maintenance, once a month is ideal. For targeted concerns like acne or pigmentation, your specialist may recommend more frequent sessions initially.' },
      { q: 'Is there downtime after a chemical peel?', a: 'Light peels have minimal downtime — mild redness for 1–2 days. Medium peels may cause peeling for 3–5 days. Your specialist will advise based on the peel strength used.' },
      { q: 'Can I wear makeup after a facial?', a: 'We recommend avoiding makeup for at least 24 hours after most facials to allow your skin to breathe and absorb the treatment benefits.' },
      { q: 'Are facials suitable for sensitive skin?', a: 'Yes. We have treatments specifically formulated for sensitive skin. Always inform your specialist about any sensitivities or allergies before your session.' },
    ],
    results: 'Most clients notice an immediate improvement in skin brightness and texture after their first session. For concerns like pigmentation, acne scarring, or deep wrinkles, a course of 4–6 treatments is recommended for optimal results.',
    seoTitle: 'Face & Skin Care Treatments — ArtiZone Amman',
    seoDescription: 'Professional facial and skin care treatments in Amman — Hydrafacial, chemical peels, microneedling, anti-aging, and more at ArtiZone Beauty Clinic.',
  },
  {
    slug: 'laser-hair-removal',
    name: 'Laser Hair Removal',
    tagline: 'Permanently Smooth Skin',
    heroDescription: 'Safe, effective, and long-lasting laser hair removal for all skin tones — face and body.',
    imageSlot: 'services/laser-hair-removal',
    videoSlot: 'services/laser-video',
    accentColor: '#C4A882',
    intro: 'Say goodbye to razors, waxing, and ingrown hairs. Our advanced laser hair removal technology targets hair follicles precisely, delivering permanent reduction with minimal discomfort. Suitable for all skin tones, our certified laser specialists create a customised treatment plan for every client.',
    benefits: [
      'Permanent hair reduction after a full course',
      'Suitable for all skin tones and body areas',
      'Minimal discomfort with cooling technology',
      'No more ingrown hairs or razor bumps',
      'Smooth, hair-free skin year-round',
      'Fast sessions — full legs in under 45 minutes',
    ],
    treatments: [
      { name: 'Upper Lip & Chin', duration: '15 min', price: 'From 20 JD', description: 'Precise laser targeting for facial hair on the upper lip and chin area.', popular: false },
      { name: 'Underarms', duration: '15 min', price: 'From 25 JD', description: 'Quick and effective underarm laser for permanently smooth results.', popular: true },
      { name: 'Bikini / Brazilian', duration: '30 min', price: 'From 45 JD', description: 'Full bikini or Brazilian laser hair removal with complete privacy and care.', popular: true },
      { name: 'Half Legs', duration: '30 min', price: 'From 50 JD', description: 'Laser hair removal for upper or lower legs.', popular: false },
      { name: 'Full Legs', duration: '45 min', price: 'From 80 JD', description: 'Complete leg laser hair removal from ankle to hip.', popular: true },
      { name: 'Full Arms', duration: '30 min', price: 'From 60 JD', description: 'Laser hair removal for full arms including hands.', popular: false },
      { name: 'Back (Men)', duration: '45 min', price: 'From 70 JD', description: 'Full back laser hair removal for men — smooth, clean results.', popular: false },
      { name: 'Full Body', duration: '120 min', price: 'From 250 JD', description: 'Comprehensive full-body laser hair removal session for maximum coverage.', popular: false },
    ],
    howItWorks: [
      { step: '01', title: 'Consultation & Patch Test', body: 'A specialist assesses your skin and hair type and performs a patch test to ensure suitability.' },
      { step: '02', title: 'Preparation', body: 'The area is shaved and cleansed. A cooling gel is applied to protect the skin and enhance comfort.' },
      { step: '03', title: 'Laser Treatment', body: 'The laser device emits pulses of light that target and destroy hair follicles without damaging surrounding skin.' },
      { step: '04', title: 'Aftercare', body: 'SPF and soothing cream are applied. You receive full aftercare instructions to protect your skin between sessions.' },
    ],
    faqs: [
      { q: 'How many sessions do I need?', a: 'Most clients need 6–8 sessions spaced 4–6 weeks apart for permanent hair reduction. Hormonal areas may require maintenance sessions.' },
      { q: 'Does laser hair removal hurt?', a: 'Most clients describe it as a mild snapping sensation. Our devices include built-in cooling to minimise discomfort significantly.' },
      { q: 'Can I get laser on tanned skin?', a: 'We recommend avoiding sun exposure for 2 weeks before and after treatment. Tanned skin increases the risk of pigmentation changes.' },
      { q: 'What should I do before my session?', a: 'Shave the area 24 hours before your appointment. Avoid waxing or threading for at least 4 weeks prior, as the hair root must be intact.' },
    ],
    results: 'After a full course of 6–8 sessions, most clients achieve 80–95% permanent hair reduction. Results vary based on hair colour, thickness, and hormonal factors. Maintenance sessions once or twice a year may be needed for some areas.',
    seoTitle: 'Laser Hair Removal in Amman — ArtiZone Clinic',
    seoDescription: 'Permanent laser hair removal for all skin tones in Amman. Full legs, underarms, bikini, face, and full body at ArtiZone Beauty & Aesthetic Clinic.',
  },
  {
    slug: 'hair-removal',
    name: 'Hair Removal',
    tagline: 'Smooth Skin, Every Time',
    heroDescription: 'Professional waxing, threading, and sugaring for silky-smooth results that last.',
    imageSlot: 'services/hair-removal',
    videoSlot: 'services/laser-video',
    accentColor: '#C4A882',
    intro: 'Our traditional hair removal services — waxing, threading, and sugaring — are performed by experienced specialists using premium products. Whether you prefer the precision of threading for facial hair or the smoothness of full-body waxing, we deliver clean, long-lasting results in a comfortable, hygienic environment.',
    benefits: [
      'Smooth results lasting 3–6 weeks',
      'Finer, softer regrowth over time',
      'Precise shaping for brows and facial hair',
      'Gentle formulas suitable for sensitive skin',
      'Hygienic single-use applicators',
      'Quick sessions with minimal discomfort',
    ],
    treatments: [
      { name: 'Eyebrow Threading', duration: '15 min', price: 'From 8 JD', description: 'Precise eyebrow shaping using the threading technique for defined, natural-looking brows.', popular: true },
      { name: 'Full Face Threading', duration: '30 min', price: 'From 18 JD', description: 'Complete facial hair removal including upper lip, chin, cheeks, and forehead.', popular: false },
      { name: 'Upper Lip Wax', duration: '10 min', price: 'From 8 JD', description: 'Quick and effective upper lip waxing for smooth, hair-free results.', popular: false },
      { name: 'Full Face Wax', duration: '30 min', price: 'From 22 JD', description: 'Complete facial waxing for smooth, hair-free skin.', popular: false },
      { name: 'Half Leg Wax', duration: '30 min', price: 'From 20 JD', description: 'Waxing for upper or lower legs — smooth results lasting up to 4 weeks.', popular: false },
      { name: 'Full Leg Wax', duration: '45 min', price: 'From 35 JD', description: 'Complete leg waxing from ankle to hip for silky-smooth skin.', popular: true },
      { name: 'Full Arms Wax', duration: '30 min', price: 'From 25 JD', description: 'Full arm waxing including hands for smooth, hair-free results.', popular: false },
      { name: 'Sugaring — Full Body', duration: '90 min', price: 'From 80 JD', description: 'Natural sugar paste hair removal for the full body — gentle on sensitive skin.', popular: false },
    ],
    howItWorks: [
      { step: '01', title: 'Consultation', body: 'Your specialist discusses your preferences, skin sensitivity, and the best method for your needs.' },
      { step: '02', title: 'Skin Prep', body: 'The area is cleansed and prepped. A pre-wax oil or powder is applied to protect the skin.' },
      { step: '03', title: 'Hair Removal', body: 'Your chosen method — waxing, threading, or sugaring — is performed with precision and care.' },
      { step: '04', title: 'Soothing Finish', body: 'A calming lotion or aloe gel is applied to soothe the skin and reduce redness.' },
    ],
    faqs: [
      { q: 'How long does hair need to be for waxing?', a: 'Hair should be at least 5mm (about the length of a grain of rice) for waxing to be effective. Avoid shaving for 2–3 weeks before your appointment.' },
      { q: 'Is threading better than waxing for eyebrows?', a: 'Threading offers more precision and is gentler on the skin around the eyes. Waxing is faster for larger areas. Our specialists can advise which is best for your brow shape and skin type.' },
      { q: 'How long do results last?', a: 'Waxing and threading results typically last 3–4 weeks. With regular sessions, regrowth becomes finer and sparser over time.' },
      { q: 'Can I wax if I have sensitive skin?', a: 'Yes. We use sensitive-formula waxes and sugaring paste, which is naturally gentle. Always inform your specialist about any skin conditions or medications.' },
    ],
    results: 'Results last 3–6 weeks depending on your hair growth cycle. Regular waxing or threading over time leads to finer, slower regrowth — making each session easier and longer-lasting.',
    seoTitle: 'Waxing & Threading in Amman — ArtiZone Clinic',
    seoDescription: 'Professional waxing, threading, and sugaring in Amman. Eyebrow shaping, full body waxing, and facial hair removal at ArtiZone Beauty Clinic.',
  },
  {
    slug: 'nails-foot-care',
    name: 'Nails & Foot Care',
    tagline: 'Perfectly Polished, Head to Toe',
    heroDescription: 'Luxurious nail and foot treatments — from classic manicures to nail art and spa pedicures.',
    imageSlot: 'services/nails-foot-care',
    videoSlot: 'services/nails-video',
    accentColor: '#C4A882',
    intro: 'Our nail and foot care services combine expert technique with premium products to give you beautiful, long-lasting results. From a quick gel manicure to an indulgent spa pedicure with foot scrub and massage, every treatment is performed in a clean, relaxing environment by our skilled nail technicians.',
    benefits: [
      'Long-lasting gel and shellac finishes',
      'Nail strengthening and repair treatments',
      'Relaxing foot and hand massages included',
      'Wide range of nail art designs',
      'Hygienic tools — sterilised or single-use',
      'Suitable for natural nails and extensions',
    ],
    treatments: [
      { name: 'Classic Manicure', duration: '45 min', price: 'From 15 JD', description: 'Nail shaping, cuticle care, hand massage, and regular polish application.', popular: false },
      { name: 'Gel Manicure', duration: '60 min', price: 'From 22 JD', description: 'Long-lasting gel polish that stays chip-free for up to 3 weeks.', popular: true },
      { name: 'Nail Extensions', duration: '90 min', price: 'From 45 JD', description: 'Acrylic or gel nail extensions for added length and strength.', popular: false },
      { name: 'Nail Art', duration: '30–60 min', price: 'From 15 JD', description: 'Custom nail art designs — from minimalist to intricate patterns.', popular: true },
      { name: 'Classic Pedicure', duration: '45 min', price: 'From 18 JD', description: 'Nail shaping, cuticle care, foot file, and regular polish.', popular: false },
      { name: 'Gel Pedicure', duration: '60 min', price: 'From 28 JD', description: 'Gel polish pedicure with nail shaping, cuticle care, and foot massage.', popular: true },
      { name: 'Spa Pedicure', duration: '75 min', price: 'From 38 JD', description: 'Indulgent pedicure with foot soak, scrub, mask, extended massage, and gel polish.', popular: false },
      { name: 'Foot Scrub & Mask', duration: '30 min', price: 'From 20 JD', description: 'Exfoliating foot scrub and nourishing mask to soften and refresh tired feet.', popular: false },
    ],
    howItWorks: [
      { step: '01', title: 'Nail Assessment', body: 'Your technician assesses your nail condition and discusses your preferred style and finish.' },
      { step: '02', title: 'Preparation', body: 'Nails are shaped, cuticles are treated, and the nail surface is prepped for the chosen treatment.' },
      { step: '03', title: 'Treatment & Polish', body: 'Your chosen treatment is performed — whether gel, extensions, or nail art — with precision and care.' },
      { step: '04', title: 'Finishing Touch', body: 'A nourishing oil or lotion is applied, and you receive tips to maintain your nails at home.' },
    ],
    faqs: [
      { q: 'How long does gel polish last?', a: 'Gel polish typically lasts 2–3 weeks without chipping. Longevity depends on nail care habits and growth rate.' },
      { q: 'Can I get nail extensions on short nails?', a: 'Yes. Nail extensions can be applied to very short nails. Your technician will advise on the best extension type for your nail shape.' },
      { q: 'How do I remove gel polish safely?', a: 'We recommend professional removal to avoid nail damage. We offer gel removal as a standalone service or included with your next appointment.' },
      { q: 'Are your tools sterilised?', a: 'Yes. All metal tools are sterilised in an autoclave between clients. Many tools are single-use and disposed of after each appointment.' },
    ],
    results: 'Gel manicures and pedicures last 2–3 weeks. Nail extensions can last 3–4 weeks with proper care. Regular nail care appointments every 3–4 weeks keep your nails healthy, strong, and beautifully maintained.',
    seoTitle: 'Nail & Foot Care in Amman — ArtiZone Clinic',
    seoDescription: 'Gel manicures, pedicures, nail extensions, nail art, and spa foot treatments in Amman at ArtiZone Beauty & Aesthetic Clinic.',
  },
  {
    slug: 'body-slimming',
    name: 'Body Slimming & Contouring',
    tagline: 'Sculpt. Tone. Transform.',
    heroDescription: 'Non-invasive body contouring treatments to slim, tone, and reshape your figure.',
    imageSlot: 'services/body-slimming',
    videoSlot: 'services/slimming-video',
    accentColor: '#C4A882',
    intro: 'Our body slimming and contouring treatments use the latest non-invasive technology to target stubborn fat, tighten skin, and sculpt your figure — without surgery or downtime. From cavitation and radiofrequency to EMS sculpting and cryolipolysis, our certified specialists design a personalised plan to help you achieve your body goals.',
    benefits: [
      'Non-invasive — no surgery, no needles',
      'Targets stubborn fat deposits',
      'Tightens and firms loose skin',
      'Improves body shape and contour',
      'No downtime — return to daily activities immediately',
      'Visible results from the first few sessions',
    ],
    treatments: [
      { name: 'Cavitation Fat Reduction', duration: '45 min', price: 'From 55 JD', description: 'Ultrasound waves break down fat cells in targeted areas for measurable inch loss.', popular: true },
      { name: 'Radiofrequency Skin Tightening', duration: '45 min', price: 'From 60 JD', description: 'RF energy heats deep skin layers to stimulate collagen and firm loose skin.', popular: true },
      { name: 'EMS Body Sculpting', duration: '30 min', price: 'From 70 JD', description: 'Electromagnetic muscle stimulation to build muscle and burn fat simultaneously.', popular: false },
      { name: 'Cryolipolysis (Fat Freezing)', duration: '60 min', price: 'From 120 JD', description: 'Controlled cooling to freeze and permanently eliminate fat cells in targeted areas.', popular: false },
      { name: 'Lymphatic Drainage Massage', duration: '60 min', price: 'From 45 JD', description: 'Manual massage technique to reduce water retention, bloating, and improve circulation.', popular: false },
      { name: 'Slimming Body Wrap', duration: '60 min', price: 'From 40 JD', description: 'Detoxifying body wrap with slimming actives to reduce inches and improve skin texture.', popular: false },
      { name: 'Cellulite Treatment', duration: '45 min', price: 'From 50 JD', description: 'Targeted treatment combining RF and massage to smooth and reduce cellulite appearance.', popular: false },
      { name: 'Full Body Contouring Package', duration: '90 min', price: 'From 180 JD', description: 'Comprehensive session combining cavitation, RF, and lymphatic drainage for full-body results.', popular: true },
    ],
    howItWorks: [
      { step: '01', title: 'Body Assessment', body: 'Your specialist measures target areas, discusses your goals, and designs a personalised treatment plan.' },
      { step: '02', title: 'Preparation', body: 'The treatment area is cleansed and a conductive gel or cream is applied to enhance device effectiveness.' },
      { step: '03', title: 'Treatment Session', body: 'The chosen device is applied to target areas. Sessions are comfortable — most clients describe a warm or tingling sensation.' },
      { step: '04', title: 'Post-Treatment Care', body: 'You receive hydration and aftercare guidance. Drinking plenty of water helps flush out treated fat cells.' },
    ],
    faqs: [
      { q: 'How many sessions do I need?', a: 'Most clients see noticeable results after 4–6 sessions. A full course of 8–10 sessions is recommended for optimal, lasting results.' },
      { q: 'Is cavitation safe?', a: 'Yes. Cavitation is a non-invasive, clinically proven treatment. It is not suitable during pregnancy or for clients with certain medical conditions — your specialist will screen you before treatment.' },
      { q: 'Will I lose weight with these treatments?', a: 'Body contouring treatments are designed to reshape and slim specific areas, not replace weight loss. Best results are achieved alongside a healthy diet and regular exercise.' },
      { q: 'Is there any downtime?', a: 'No. All our body contouring treatments are non-invasive with zero downtime. You can return to normal activities immediately after your session.' },
    ],
    results: 'Most clients notice measurable inch loss and improved skin firmness after 4–6 sessions. For optimal results, a course of 8–10 sessions combined with healthy lifestyle habits is recommended. Results are long-lasting when maintained.',
    seoTitle: 'Body Slimming & Contouring in Amman — ArtiZone Clinic',
    seoDescription: 'Non-invasive body slimming, fat reduction, and contouring treatments in Amman — cavitation, RF, EMS, cryolipolysis at ArtiZone Beauty Clinic.',
  },
  {
    slug: 'mens-grooming',
    name: "Men's Grooming",
    tagline: 'Grooming Built Around You',
    heroDescription: 'Dedicated men\'s treatments — skin care, laser, body, and grooming in a private, comfortable setting.',
    imageSlot: 'services/mens-grooming',
    videoSlot: 'services/mens-video',
    accentColor: '#C4A882',
    intro: "ArtiZone's men's grooming department is designed specifically for men who take their appearance seriously. From deep cleansing facials and laser hair removal to body contouring and nail care, every treatment is tailored to men's skin and grooming needs — delivered with complete privacy and professionalism.",
    benefits: [
      'Treatments formulated for men\'s skin',
      'Complete privacy and a comfortable environment',
      'Experienced male and female specialists',
      'Laser hair removal for back, chest, and face',
      'Skin care for acne, oiliness, and aging',
      'Quick, efficient sessions that fit your schedule',
    ],
    treatments: [
      { name: "Men's Deep Cleansing Facial", duration: '60 min', price: 'From 40 JD', description: 'Deep pore cleanse, exfoliation, and hydration tailored to men\'s skin — targets oiliness and congestion.', popular: true },
      { name: "Men's Anti-Aging Facial", duration: '75 min', price: 'From 65 JD', description: 'Firming and lifting facial to address fine lines, dullness, and loss of elasticity.', popular: false },
      { name: 'Eyebrow Shaping (Men)', duration: '15 min', price: 'From 10 JD', description: 'Natural, masculine eyebrow shaping via threading or waxing.', popular: true },
      { name: 'Beard Grooming & Shaping', duration: '30 min', price: 'From 15 JD', description: 'Professional beard shaping, trimming, and grooming for a clean, defined look.', popular: false },
      { name: 'Back Laser Hair Removal', duration: '45 min', price: 'From 70 JD', description: 'Permanent hair reduction for the full back — smooth, clean results.', popular: true },
      { name: 'Chest Laser Hair Removal', duration: '30 min', price: 'From 55 JD', description: 'Laser hair removal for the chest and stomach area.', popular: false },
      { name: "Men's Manicure & Pedicure", duration: '60 min', price: 'From 30 JD', description: 'Clean, well-groomed nails with shaping, cuticle care, and buffing — no polish unless requested.', popular: false },
      { name: 'Body Contouring (Men)', duration: '60 min', price: 'From 70 JD', description: 'Targeted fat reduction and muscle toning using EMS and cavitation technology.', popular: false },
    ],
    howItWorks: [
      { step: '01', title: 'Private Consultation', body: 'A one-on-one consultation with your specialist to discuss your grooming goals and skin concerns — completely confidential.' },
      { step: '02', title: 'Personalised Plan', body: 'Your specialist recommends the most effective treatments and creates a plan tailored to your needs and schedule.' },
      { step: '03', title: 'Treatment', body: 'Your session is performed in a private room with full professionalism and discretion.' },
      { step: '04', title: 'Ongoing Care', body: 'You receive a personalised home care routine and can book follow-up sessions at your convenience.' },
    ],
    faqs: [
      { q: 'Is the clinic comfortable for men?', a: 'Absolutely. ArtiZone has a dedicated men\'s section with private treatment rooms. Many of our clients are men who appreciate the discreet, professional environment.' },
      { q: 'Do I need to shave before a facial?', a: 'No. Our facials are designed to work with or without facial hair. Your specialist will adapt the treatment accordingly.' },
      { q: 'How many laser sessions do I need for my back?', a: 'Most men need 6–8 sessions for the back and chest. Hair in these areas tends to be coarser, so a full course is recommended for best results.' },
      { q: 'Can I book a facial and laser in the same visit?', a: 'Yes. We can combine treatments in a single visit to save you time. Your specialist will advise on the best order and any contraindications.' },
    ],
    results: "Men's grooming results vary by treatment. Facials show immediate improvement in skin clarity and hydration. Laser hair removal delivers permanent reduction after 6–8 sessions. Body contouring results are visible after 4–6 sessions.",
    seoTitle: "Men's Grooming & Treatments in Amman — ArtiZone Clinic",
    seoDescription: "Dedicated men's grooming treatments in Amman — facials, laser hair removal, beard grooming, body contouring, and nail care at ArtiZone Beauty Clinic.",
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return servicesData.find((s) => s.slug === slug);
}
