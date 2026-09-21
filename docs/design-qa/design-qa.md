# BionLife — Design QA

## Comparison target

- Source visual truth: [design-qa-reference.png](design-qa-reference.png)
- Desktop implementation: [design-qa-implementation-desktop.png](design-qa-implementation-desktop.png)
- Mobile implementation: [design-qa-implementation-mobile.png](design-qa-implementation-mobile.png)
- Route: `/bionlife`
- Hostname route tested: `bionlife.localhost`
- State: page fully loaded, fonts ready, lazy images loaded, reveal animations completed, first FAQ open.

## Viewports and normalization

- Source: 942 × 1670 px.
- Desktop implementation: 1440 × 7994 px at a 1440 × 1050 CSS viewport, device scale factor 1.
- Mobile implementation: 390 × 11699 px at a 390 × 844 CSS viewport, device scale factor 1.
- The reference is a shorter editorial landing page. The implementation is intentionally longer because it includes the complete approved BionLife copy, three detailed models, assisted choice, delivery, seven FAQs and the required health disclaimer.
- Full-page images were normalized by height for the composition pass. Focused top and section crops were normalized by width before comparison.

## Full-view comparison evidence

The combined comparison shows the same central visual grammar as the source:

- warm-gray browser canvas around a rounded white website frame;
- compact navigation with a typographic wordmark and dark pill CTA;
- split hero with editorial copy on the left and a dominant bedroom photograph on the right;
- small white fact cards directly under the hero copy;
- alternating white, pale-gray and black rounded sections;
- product technology presented with the exploded-layer image and dark supporting modules;
- three product cards grouped in a soft catalog panel;
- outline icons, thin borders, restrained shadows and large white-space intervals.

The longer implementation preserves the source rhythm instead of repeating one card pattern through every section.

## Focused comparison evidence

### Hero

- The source and implementation both use a near-even text/image split, large black display type, a primary dark pill, secondary action and three supporting fact cards.
- The hero product crop remains sharp at desktop and mobile. The mattress is the focal point and the room does not overpower the headline.
- Mobile changes to a linear reading order without horizontal overflow.

### Technology and construction

- The supplied exploded-layer image is used as a real raster asset, not recreated with CSS or SVG.
- The benefit modules match the source's high-contrast dark-card treatment.
- Construction copy remains adjacent to the layer visual, preserving the relationship between explanation and product evidence.

### Models, assisted choice and FAQ

- Three models fit in one desktop row and become a snap-scrolling horizontal catalog on mobile.
- Technical facts remain readable and model-specific.
- Assisted choice, delivery and FAQ use lighter panels and dividers, matching the source's quieter lower-page rhythm.
- FAQ open/close behavior and model carousel controls were tested.

## Required fidelity surfaces

- Fonts and typography: Poppins is self-hosted and used consistently. Display headings use compact tracking and high contrast similar to the reference; body copy uses lighter weights and comfortable line height.
- Spacing and layout rhythm: section padding, 24–38 px radii, compact card gaps and large editorial breaks follow the source. No horizontal overflow was detected at 1440 px or 390 px.
- Colors and visual tokens: warm white, soft gray, charcoal and a restrained acid-lime massage accent maintain the reference's premium monochrome base while giving BionLife one recognizable technology color.
- Image quality and asset fidelity: all six supplied mattress images are used. Responsive WebP variants preserve crop and sharpness while reducing delivered weight. No placeholder, CSS art or handcrafted SVG replaces product imagery.
- Copy and content: the attached BionLife copy is preserved and organized around benefits, construction, massage, models, assisted choice, delivery, FAQ and closing CTA. Medical claims were not added.
- Icons: Lucide outline icons match the source's thin monochrome icon treatment and the existing project dependency.
- Accessibility: semantic headings, labelled menu controls, `aria-expanded` FAQ states, visible focus rings, descriptive alt text, keyboard-reachable actions and reduced-motion support are present.

## Interaction and runtime checks

- Desktop FAQ expansion: passed.
- Mobile menu open/close: passed.
- Hostname dispatch at `bionlife.localhost`: passed.
- Desktop console/page errors: none.
- Mobile console/page errors: none.
- Static title and description for the BionLife build: passed.
- TypeScript: passed.
- Production build: passed.

## Findings

No actionable P0, P1 or P2 fidelity findings remain.

Accepted constraints / P3 follow-up:

- The official BionLife logo asset was not provided, so the header uses a restrained typographic wordmark.
- The supplied mattress photography visibly carries the source product mark. It was retained because the user explicitly requested the `colchao` images; replace it when final BionLife-branded photography is available.
- BionLife-specific favicon artwork is still pending because no brand icon was supplied.

## Comparison history

1. The initial automated full-page capture showed blank lower regions because below-fold reveal animations and lazy images had not been activated. This was invalid capture evidence, not a page defect.
2. The QA capture was rerun after scrolling through the full document, waiting for fonts and images, and returning to the top.
3. The valid full-view and focused comparisons found no actionable P0/P1/P2 mismatch.

final result: passed
