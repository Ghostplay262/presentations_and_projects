document.addEventListener('DOMContentLoaded', () => {

  // ── Dropdown accordion ──
  const categories = document.querySelectorAll('.category');

  categories.forEach(category => {
    const header = category.querySelector('.category-header');
    const items = category.querySelector('.category-items');

    header.addEventListener('click', () => {
      const isOpen = category.classList.contains('open');

      // Close all categories
      categories.forEach(c => {
        c.classList.remove('open');
        c.querySelector('.category-items').style.maxHeight = null;
      });

      // Toggle clicked category
      if (!isOpen) {
        category.classList.add('open');
        items.style.maxHeight = items.scrollHeight + 'px';
      }
    });
  });

  // ── Floating particles ──
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h;
  const particles = [];
  const PARTICLE_COUNT = 50;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.radius = Math.random() * 1.8 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      // Cool color palette: blues, cyans, light purples
      const colors = [
        '147, 197, 253',  // light blue
        '96, 165, 250',   // blue
        '103, 232, 249',  // cyan
        '165, 180, 252',  // lavender
        '56, 189, 248',   // sky
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) {
        this.reset();
        // Re-enter from a random edge
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) { this.x = -5; this.y = Math.random() * h; }
        else if (edge === 1) { this.x = w + 5; this.y = Math.random() * h; }
        else if (edge === 2) { this.y = -5; this.x = Math.random() * w; }
        else { this.y = h + 5; this.x = Math.random() * w; }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Draw faint lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const opacity = (1 - dist / 140) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
});
