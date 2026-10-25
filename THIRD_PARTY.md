# Third-party libraries

The website vendors the following browser libraries locally. Their original copyright/license headers are retained.

| Library | Version | Use | Upstream / License |
| --- | --- | --- | --- |
| GSAP | 3.12.5 | Entrance and scroll animations | https://gsap.com/ — https://gsap.com/standard-license/ |
| GSAP ScrollTrigger | 3.12.5 | Scroll-triggered reveals and desktop photo parallax | Included with GSAP |
| PhotoSwipe | 5.4.4 | Accessible photo lightbox with zoom, gestures and keyboard controls | https://photoswipe.com/ — MIT; see vendor/photoswipe/LICENSE |

StatiCrypt's existing embedded encryption/password gate is retained in `index.html`.
Google Fonts supplies Noto Sans JP and Inter (font families, not JavaScript libraries).

Browser libraries are copied from their versioned npm packages. No library is loaded from a third-party JavaScript CDN. If GSAP is unavailable, page content stays visible; if PhotoSwipe is unavailable, the gallery link opens the original image. Reduced-motion preferences disable GSAP animations and PhotoSwipe's transition animations.
