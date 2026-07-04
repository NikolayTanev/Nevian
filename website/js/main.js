/* Nevian marketing site: interactions */
(function () {
  'use strict';

  /* ── Mobile menu ──────────────────────────────────────────── */
  var navToggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Footer year ──────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Scroll reveal + stagger ──────────────────────────────── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .stagger'));
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Scroll progress bar ──────────────────────────────────── */
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  function updateProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = max > 0 ? (scrolled / max * 100) + '%' : '0%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ── Count-up animation for [data-count] numbers ──────────── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var duration = 1200;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var value = Math.round(easeOutCubic(p) * target);
      el.textContent = String(value);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { countUp(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(countUp);
  }

  /* ── Hero mockup parallax (subtle, mouse-driven) ──────────── */
  var hero = document.querySelector('.hero');
  var heroMock = document.querySelector('.hero-mock');
  if (hero && heroMock && window.matchMedia('(min-width: 64rem)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    var targetX = 0, targetY = 0, curX = 0, curY = 0;
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      targetX = nx * 14;
      targetY = ny * 10;
      if (!ticking) { ticking = true; requestAnimationFrame(loop); }
    });
    hero.addEventListener('mouseleave', function () { targetX = 0; targetY = 0; if (!ticking) { ticking = true; requestAnimationFrame(loop); } });
    function loop() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      heroMock.style.transform = 'translate3d(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px,0)';
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        requestAnimationFrame(loop);
      } else {
        ticking = false;
      }
    }
  }

  /* ── Smooth-scroll for in-page anchors with nav offset ────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 0;
      var y = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ── Liquid-glass segmented control (ported from dashboard) ─ */
  function wireSeg(seg) {
    if (seg.dataset.segWired) return;
    seg.dataset.segWired = '1';
    var slider = seg.querySelector('.seg-slider');
    if (!slider) {
      slider = document.createElement('span');
      slider.className = 'seg-slider';
      seg.insertBefore(slider, seg.firstChild);
    }
    function move(btn, animate) {
      if (!btn || btn.offsetWidth === 0) return;
      var cs = getComputedStyle(seg);
      var padL = parseFloat(cs.paddingLeft) || 0;
      if (!animate) slider.classList.add('no-anim');
      slider.style.width = btn.offsetWidth + 'px';
      slider.style.transform = 'translateX(' + (btn.offsetLeft - padL) + 'px)';
      if (!animate) requestAnimationFrame(function () { slider.classList.remove('no-anim'); });
    }
    function active() { return seg.querySelector('.seg-btn.active') || seg.querySelector('.seg-btn'); }
    seg.querySelectorAll('.seg-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        seg.querySelectorAll('.seg-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        move(btn, true);
      });
    });
    move(active(), false);
    window.addEventListener('resize', function () { move(active(), false); });
  }
  document.querySelectorAll('.seg').forEach(wireSeg);

  /* ── Journey card · click a pill to expand it & swap the scene ─ */
  document.querySelectorAll('.journey-card').forEach(function (card) {
    var items = card.querySelectorAll('.journey-item');
    var scenes = card.querySelectorAll('.journey-scene');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.classList.contains('is-open')) return;
        var step = item.getAttribute('data-step');
        items.forEach(function (i) {
          var open = i === item;
          i.classList.toggle('is-open', open);
          i.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        scenes.forEach(function (s) {
          s.classList.toggle('is-active', s.getAttribute('data-scene') === step);
        });
        card.setAttribute('data-active', step);
      });
    });
  });

  /* ── Contact form (works on static hosting) ───────────────── */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  }
  function mailtoFallback(data) {
    var subject = 'Nevian demo request: ' + (data.company || data.firstName || 'New lead');
    var lines = [
      'Name: ' + (data.firstName || '') + ' ' + (data.lastName || ''),
      'Email: ' + (data.email || ''),
      'Company: ' + (data.company || ''),
      'Company size: ' + (data.companySize || ''),
      'Devices: ' + (data.devices || ''),
      'Looking to improve: ' + (data.improve || ''),
      '',
      (data.message || '')
    ];
    var href = 'mailto:hello@nevian.info?subject=' + encodeURIComponent(subject) +
               '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) { data[k] = v; });

      if (!data.firstName || !data.lastName || !data.email) {
        setStatus('Please fill in your name and work email.', 'err');
        return;
      }

      var endpoint = form.getAttribute('data-endpoint') || '';
      var configured = endpoint && endpoint.indexOf('YOUR_AWS_API_ID') === -1;

      if (!configured) {
        // No AWS endpoint configured yet. Open the visitor's email client.
        setStatus('Opening your email app to send the request…', 'ok');
        mailtoFallback(data);
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setStatus('Sending your request…', '');

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (payload) {
            if (res.ok) {
              form.reset();
              setStatus('Thanks. We received your request and will get back to you shortly.', 'ok');
            } else {
              setStatus(payload.error || 'Something went wrong. Please try again or email hello@nevian.info.', 'err');
            }
          });
        })
        .catch(function () {
          setStatus('Something went wrong. Please try again or email hello@nevian.info.', 'err');
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Send Request'; }
        });
    });
  }
})();
