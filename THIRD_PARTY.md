# Third-party libraries

The website vendors the following browser libraries locally. Their original copyright/license headers are retained.

| Library | Version | Use | Upstream / License |
| --- | --- | --- | --- |
| GSAP | 3.12.5 | Entrance and scroll animations | https://gsap.com/ — https://gsap.com/standard-license/ |
| GSAP ScrollTrigger | 3.12.5 | Scroll-triggered section reveals | Included with GSAP |

StatiCrypt's existing embedded encryption/password gate is retained in `index.html`.
Google Fonts supplies Noto Sans JP, Inter and Barlow Condensed (font families, not JavaScript libraries).

Browser libraries are copied from their versioned npm packages. No library is loaded from a third-party JavaScript CDN. If GSAP is unavailable, page content stays visible. Reduced-motion preferences disable GSAP animations.

Calendar export (.ics), schedule tabs, reading progress, and photo parallax use native browser APIs.
