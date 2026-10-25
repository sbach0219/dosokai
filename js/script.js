/* 開宴時刻は日本時間で固定。海外から見ても同じ瞬間をカウントします。 */
(() => {
  const eventDate = new Date('2027-01-11T18:00:00+09:00');
  function updateCountdown() {
    const seconds = Math.max(0, Math.floor((eventDate - Date.now()) / 1000));
    const values = {days:Math.floor(seconds/86400),hours:Math.floor(seconds/3600)%24,mins:Math.floor(seconds/60)%60,secs:seconds%60};
    for (const [name,value] of Object.entries(values)) {
      const element = document.getElementById(`cd-${name}`);
      if(element) element.textContent = name === 'days' ? value : String(value).padStart(2,'0');
    }
  }
  updateCountdown();
  setInterval(updateCountdown,1000);
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  function closeMenu() {
    menu.setAttribute('aria-expanded','false');
    menu.querySelector('.sr-only').textContent='メニューを開く';
    nav.classList.remove('is-open');
  }
  menu.addEventListener('click',()=>{
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(open));
    menu.querySelector('.sr-only').textContent = open?'メニューを閉じる':'メニューを開く';
    nav.classList.toggle('is-open',open);
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && menu.getAttribute('aria-expanded')==='true') {closeMenu();menu.focus();}
  });
  window.matchMedia('(max-width:760px)').addEventListener('change',closeMenu);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (window.PhotoSwipeLightbox && window.PhotoSwipe) {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#school-gallery',
      children: 'a',
      pswpModule: PhotoSwipe,
      bgOpacity: 0.94,
      showHideAnimationType: reduceMotion.matches ? 'none' : 'zoom',
      zoomAnimationDuration: reduceMotion.matches ? 0 : 250,
      closeTitle: '閉じる',
      zoomTitle: '拡大・縮小',
      arrowPrevTitle: '前の写真',
      arrowNextTitle: '次の写真',
      errorMsg: '写真を読み込めませんでした。',
      counter: false
    });
    lightbox.init();
    reduceMotion.addEventListener('change', () => {
      lightbox.options.showHideAnimationType = reduceMotion.matches ? 'none' : 'zoom';
      lightbox.options.zoomAnimationDuration = reduceMotion.matches ? 0 : 250;
    });
  }

  // Content remains visible when animation libraries are unavailable.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-heading > *, .hero-bottom', {
        y: 24, opacity: 0, duration: 0.85, stagger: 0.1,
        ease: 'power3.out', clearProps: 'transform,opacity'
      });
      gsap.from('.hero-photo', {
        clipPath: 'inset(0 0 0 100%)', duration: 1.15,
        ease: 'power3.inOut', clearProps: 'clipPath'
      });
      gsap.utils.toArray('.reveal').forEach(element => {
        gsap.from(element, {
          y: 28, opacity: 0, duration: 0.75, ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {trigger: element, start: 'top 93%', once: true}
        });
      });
      gsap.from('.timeline li', {
        y: 22, opacity: 0, duration: 0.7, stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: {trigger: '.timeline', start: 'top 90%', once: true}
      });
    });
    media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.hero-photo img', {scale: 1.08, yPercent: -2}, {
        scale: 1.08, yPercent: 2, ease: 'none',
        scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}
      });
    });
    // Recalculate scroll positions after web fonts and images have settled.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), {once: true});
  }
})();
