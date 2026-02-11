const speed = 100; // px / s

const init = carousel => {
  // TEMPLATE (globali)
  const win = document.querySelector('.window').cloneNode(true);
  const slides = document.querySelector('.slides').cloneNode(true);

  carousel.appendChild(win);
  win.appendChild(slides);

  const firstSlideDupe = slides.firstElementChild.cloneNode(true);
  slides.appendChild(firstSlideDupe);

  const resetAmount = firstSlideDupe.offsetLeft - slides.offsetLeft;

  let position = 0;
  let lastUpdated = Date.now();

  const loop = () => {
    const now = Date.now();
    const delta = (now - lastUpdated) / 1000;
    lastUpdated = now;

    position += delta * speed;

    if (position >= resetAmount) {
      position -= resetAmount;
    }

    slides.style.left = `-${position}px`;
    requestAnimationFrame(loop);
  };

  loop();
};

document.querySelectorAll('.carousel').forEach(init);
