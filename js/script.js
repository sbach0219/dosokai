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
  const dialog = document.querySelector('.photo-dialog');
  document.querySelector('[data-open-photo]').addEventListener('click',()=>dialog.showModal());
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
})();
