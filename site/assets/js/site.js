(() => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = motionQuery.matches;
  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((element) => observer.observe(element));
  }

  const rail = document.querySelector('[data-scroll-rail]');
  if (rail && !reduceMotion) {
    const updateRail = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      rail.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };
    updateRail();
    window.addEventListener('scroll', updateRail, { passive: true });
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const limitVideoAutoplay = reduceMotion || connection?.saveData || window.matchMedia('(prefers-reduced-data: reduce)').matches;
  document.querySelectorAll('.vibe-card__video').forEach((video) => {
    video.preload = 'metadata';
    if (limitVideoAutoplay) {
      video.autoplay = false;
      video.pause();
      return;
    }

    if (!('IntersectionObserver' in window)) return;
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.15 });
    videoObserver.observe(video);
  });

  document.querySelectorAll('.project__facts').forEach((facts) => {
    const items = Array.from(facts.children);
    if (items.length < 2) return;

    const details = document.createElement('details');
    details.className = 'project-details';
    const summary = document.createElement('summary');
    summary.textContent = '查看项目详情';
    const detailList = document.createElement('ul');
    detailList.className = 'project-details__list';

    items.slice(1).forEach((item) => detailList.append(item));
    details.append(summary, detailList);
    facts.after(details);
  });
})();
