(function(){
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navlinks');
  if(btn && nav){
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
    });
  }
})();
