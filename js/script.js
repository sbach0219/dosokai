(() => {
  const eventDate = new Date('2027-01-11T18:00:00+09:00');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateCountdown() {
    const seconds = Math.max(0, Math.floor((eventDate - Date.now()) / 1000));
    const values = {days:Math.floor(seconds / 86400),hours:Math.floor(seconds / 3600) % 24,mins:Math.floor(seconds / 60) % 60,secs:seconds % 60};
    for (const [name,value] of Object.entries(values)) {
      const element = document.getElementById(`cd-${name}`);
      if(element) element.textContent = name === 'days' ? value : String(value).padStart(2,'0');
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  function closeMenu() {
    menu.setAttribute('aria-expanded','false');
    menu.querySelector('.sr-only').textContent='メニューを開く';
    nav.classList.remove('is-open');
    header.classList.remove('menu-open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(open));
    menu.querySelector('.sr-only').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
    nav.classList.toggle('is-open',open);
    header.classList.toggle('menu-open',open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event => {
    if(event.key==='Escape' && menu.getAttribute('aria-expanded')==='true') {closeMenu();menu.focus();}
  });
  window.matchMedia('(max-width:760px)').addEventListener('change', closeMenu);
  const progress = document.querySelector('.reading-progress');
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  const desktopMotion = window.matchMedia('(min-width:761px) and (prefers-reduced-motion: no-preference)');
  let scrollPending = false;
  function updateScroll() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    header.classList.toggle('is-scrolled', window.scrollY > 110);
    const photoOffset = desktopMotion.matches ? Math.min(window.scrollY, hero.offsetHeight) * 0.13 : 0;
    heroImage.style.transform = `translate3d(0, ${photoOffset}px, 0)`;
    scrollPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, {passive:true});
  window.addEventListener('resize',updateScroll);
  desktopMotion.addEventListener('change',updateScroll);
  updateScroll();

  // Accessible schedule tabs. Without JavaScript every panel remains readable.
  const tabs = [...document.querySelectorAll('.schedule-tab')];
  const panels = [...document.querySelectorAll('.schedule-panel')];
  const tabList = document.querySelector('.schedule-tabs');
  tabList.setAttribute('role','tablist');
  const smallScreen = window.matchMedia('(max-width:760px)');
  function orientTabs() {tabList.setAttribute('aria-orientation',smallScreen.matches?'horizontal':'vertical');}
  orientTabs();
  smallScreen.addEventListener('change',orientTabs);
  tabs.forEach((tab,index) => {
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-controls',panels[index].id);
    panels[index].setAttribute('role','tabpanel');
    panels[index].tabIndex=0;
  });
  function selectStep(index,focus=false,animate=true) {
    tabs.forEach((tab,i) => {
      const active=i===index;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
      panels[i].hidden=!active;
    });
    if(focus) tabs[index].focus({preventScroll:true});
    if(smallScreen.matches && (focus || animate)) {
      const active = tabs[index];
      tabList.scrollTo({left:active.offsetLeft-tabList.offsetLeft-12,behavior:reducedMotion.matches?'instant':'smooth'});
    }
    if(animate && window.gsap && !reducedMotion.matches) {
      gsap.killTweensOf(panels);
      gsap.fromTo(panels[index],{y:18,opacity:0},{y:0,opacity:1,duration:.45,ease:'power2.out',clearProps:'transform,opacity'});
    }
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',()=>selectStep(index));
    tab.addEventListener('keydown',event => {
      let target=index;
      if(event.key==='ArrowRight'||event.key==='ArrowDown') target=(index+1)%tabs.length;
      else if(event.key==='ArrowLeft'||event.key==='ArrowUp') target=(index+tabs.length-1)%tabs.length;
      else if(event.key==='Home') target=0;
      else if(event.key==='End') target=tabs.length-1;
      else return;
      event.preventDefault();selectStep(target,true);
    });
  });
  selectStep(0,false,false);

  // Calendar export contains only confirmed event details; no venue is invented.
  let toastTimer;
  document.querySelectorAll('[data-calendar]').forEach(button => button.addEventListener('click',() => {
    const timestamp = new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    const lines = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Takao Reunion//2027//JA','CALSCALE:GREGORIAN',
      'BEGIN:VEVENT','UID:takao-reunion-20270111@sbach0219.github.io',`DTSTAMP:${timestamp}`,
      'DTSTART:20270111T090000Z','DTEND:20270111T120000Z',
      'SUMMARY:高雄中学校 同窓会',
      'DESCRIPTION:17:30受付開始。会場は決まり次第ご案内します。',
      'URL:https://sbach0219.github.io/dosokai/','END:VEVENT','END:VCALENDAR'
    ];
    // RFC 5545 folding: physical lines are limited to 75 UTF-8 octets.
    const encoder = new TextEncoder();
    const folded = lines.map(line => {
      let output='',part='',bytes=0;
      for(const character of line) {
        const length=encoder.encode(character).length;
        if(bytes+length>75) {output+=part+'\r\n';part=' ';bytes=1;}
        part+=character;bytes+=length;
      }
      return output+part;
    }).join('\r\n')+'\r\n';
    const url=URL.createObjectURL(new Blob([folded],{type:'text/calendar;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='takao-reunion-2027.ics';
    document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    const toast=document.querySelector('.toast');
    toast.textContent='ダウンロードした予定ファイルを開いて、カレンダーに追加してください。';
    toast.classList.add('is-visible');clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),6000);
  }));

  if(window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',() => {
      gsap.from('.hero-image img',{scale:1.13,duration:1.8,ease:'power2.out'});
      gsap.from('.hero-topline, .hero-label, .hero-jp, .hero-year, .hero-footer',{
        y:40,opacity:0,duration:1,stagger:.12,ease:'power3.out',clearProps:'transform,opacity'
      });
      gsap.utils.toArray('.reveal').forEach(element => {
        gsap.from(element,{y:32,opacity:0,duration:.8,ease:'power2.out',clearProps:'transform,opacity',
          scrollTrigger:{trigger:element,start:'top 94%',once:true}});
      });
      gsap.from('.entry-date',{yPercent:35,opacity:.3,duration:1,ease:'power3.out',
        scrollTrigger:{trigger:'.entry-date',start:'top 98%',once:true},clearProps:'transform,opacity'});
    });
    document.fonts?.ready.then(()=>ScrollTrigger.refresh());
    window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
  }
})();
