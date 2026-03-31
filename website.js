/* ============================================================
   ALAPA FINANCE — iOS 26 Premium Interactive Logic
   Smooth animations, spring physics, 3D effects, i18n
   ============================================================ */

(function() {
  'use strict';

  // ===== PRELOADER =====
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
      // Trigger hero entrance animations
      document.querySelector('.hero').classList.add('hero-loaded');
      // Trigger map draw after a short delay
      setTimeout(initMapAnimation, 800);
    }, 600);
  });

  // ===== GEOMETRIC BACKGROUND =====
  function initGeoBackground() {
    const container = document.getElementById('heroGeo');
    if (!container) return;
    const shapes = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const isCircle = Math.random() > 0.5;
      const size = 20 + Math.random() * 50;
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.classList.add('geo-shape');
      el.setAttribute('width', size);
      el.setAttribute('height', size);
      el.setAttribute('viewBox', `0 0 ${size} ${size}`);
      el.style.left = Math.random() * 100 + '%';
      el.style.top = (100 + Math.random() * 20) + '%';
      el.style.animationDuration = (25 + Math.random() * 40) + 's';
      el.style.animationDelay = -(Math.random() * 40) + 's';
      if (isCircle) {
        const r = size / 2 - 1;
        el.innerHTML = `<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#C8956C" stroke-width="0.8"/>`;
      } else {
        const h = size * 0.866;
        el.innerHTML = `<polygon points="${size/2},1 ${size-1},${h} 1,${h}" fill="none" stroke="#C8956C" stroke-width="0.8"/>`;
      }
      container.appendChild(el);
    }
  }
  initGeoBackground();

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navbarToggle');
  const navMenu = document.getElementById('navbarMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 600);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== BACK TO TOP =====
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== COUNTER ANIMATION — with easeOutExpo =====
  function animateCounters() {
    function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      if (isNaN(target) || el.dataset.animated) return;
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !el.dataset.animated) {
            el.dataset.animated = 'true';
            const duration = 1500;
            const start = performance.now();
            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOutExpo(progress);
              const current = Math.round(target * easedProgress);
              el.textContent = current.toLocaleString();
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    });
  }
  animateCounters();

  // ===== AOS (Animate On Scroll) — enhanced with spring feel =====
  function initAOS() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.aosDelay || 0;
          setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
  }
  initAOS();

  // ===== STAGGER REVEAL =====
  function initStaggerReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-reveal').forEach(el => observer.observe(el));
  }
  initStaggerReveal();

  // ===== 3D CARD TILT =====
  function init3DTilt() {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 8;
        const rotateY = (x - 0.5) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.setProperty('--mouse-x', `${x * 100}%`);
        card.style.setProperty('--mouse-y', `${y * 100}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  init3DTilt();

  // ===== KAZAKHSTAN MAP ANIMATION =====
  function initMapAnimation() {
    const mapSvg = document.getElementById('kzMap');
    if (!mapSvg) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Draw the country outline
          const outline = mapSvg.querySelector('.map-outline');
          if (outline) outline.classList.add('drawn');

          // Stagger city appearances
          const cities = mapSvg.querySelectorAll('.map-city');
          cities.forEach(city => {
            const delay = parseInt(city.dataset.delay || 0);
            setTimeout(() => city.classList.add('visible'), 1000 + delay);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(mapSvg);
  }

  // ===== CALCULATOR =====
  const calcAmount = document.getElementById('calcAmount');
  const calcAdvance = document.getElementById('calcAdvance');
  const calcTerm = document.getElementById('calcTerm');

  function formatCurrency(num) {
    return Math.round(num).toLocaleString('ru-RU') + ' ₸';
  }

  function updateCalculator() {
    const amount = parseInt(calcAmount.value);
    const advancePercent = parseInt(calcAdvance.value);
    const term = parseInt(calcTerm.value);
    const type = document.querySelector('input[name="leaseType"]:checked').value;

    const advanceAmount = amount * advancePercent / 100;
    const financedAmount = amount - advanceAmount;
    const rate = type === 'financial' ? 0.018 : 0.022; // monthly rate
    const monthly = financedAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayments = monthly * term + advanceAmount;
    const overpay = ((totalPayments / amount - 1) * 100).toFixed(1);

    document.getElementById('calcAmountValue').textContent = formatCurrency(amount);
    document.getElementById('calcAdvanceValue').textContent = advancePercent + '%';
    document.getElementById('calcTermValue').textContent = term;
    document.getElementById('calcMonthly').textContent = formatCurrency(monthly);
    document.getElementById('calcAdvanceAmount').textContent = formatCurrency(advanceAmount);
    document.getElementById('calcTotal').textContent = formatCurrency(totalPayments);
    document.getElementById('calcOverpay').textContent = overpay + '%';

    // Update range track fill
    updateRangeTrack(calcAmount);
    updateRangeTrack(calcAdvance);
    updateRangeTrack(calcTerm);
  }

  function updateRangeTrack(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    const percent = ((val - min) / (max - min)) * 100;
    input.style.background = `linear-gradient(to right, var(--gold-500) ${percent}%, var(--navy-600) ${percent}%)`;
  }

  [calcAmount, calcAdvance, calcTerm].forEach(el => {
    if (el) el.addEventListener('input', updateCalculator);
  });
  document.querySelectorAll('input[name="leaseType"]').forEach(el => {
    el.addEventListener('change', updateCalculator);
  });
  updateCalculator();

  // ===== FAQ =====
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ===== FORM =====
  const form = document.getElementById('applicationForm');
  if (form) {
    // Phone mask
    const phoneInput = document.getElementById('appPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('8')) val = '7' + val.slice(1);
        if (val.length > 0) {
          let formatted = '+7';
          if (val.length > 1) formatted += ' (' + val.slice(1, 4);
          if (val.length > 4) formatted += ') ' + val.slice(4, 7);
          if (val.length > 7) formatted += ' ' + val.slice(7, 9);
          if (val.length > 9) formatted += ' ' + val.slice(9, 11);
          e.target.value = formatted;
        }
      });
    }

    // BIN validation
    const binInput = document.getElementById('appBin');
    if (binInput) {
      binInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12);
      });
    }

    // Amount formatting
    const amountInput = document.getElementById('appAmount');
    if (amountInput) {
      amountInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val ? parseInt(val).toLocaleString('ru-RU') : '';
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
      window.scrollTo({ top: document.getElementById('application').offsetTop - 100, behavior: 'smooth' });
    });
  }

  // ===== i18n =====
  const translations = {
    ru: {
      'nav.services': 'Услуги',
      'nav.calculator': 'Калькулятор',
      'nav.process': 'Как это работает',
      'nav.programs': 'Программы',
      'nav.about': 'О компании',
      'nav.contact': 'Контакты',
      'nav.apply': 'Оставить заявку',
      'hero.badge': 'Лизинговая компания Казахстана',
      'hero.title': 'Финансовые решения<br>для роста вашего<br><span class="text-gradient">бизнеса</span>',
      'hero.desc': 'Полный спектр лизинговых услуг для предприятий любого масштаба — от модульных зданий и спецтехники до IT-инфраструктуры. Работаем по всему Казахстану с 2020 года.',
      'hero.cta1': 'Получить расчёт',
      'hero.cta2': 'Наши услуги',
      'hero.stat1': 'лет на рынке',
      'hero.stat2': 'регионов Казахстана',
      'hero.stat3': 'направлений лизинга',
      'hero.stat4': 'поддержка клиентов',
      'hero.chartLabel': 'Рост портфеля',
      'trusted.label': 'Работаем с предприятиями всех форм собственности',
      'trusted.t1': 'Крупный бизнес',
      'trusted.t2': 'МСБ',
      'trusted.t3': 'Агрохолдинги',
      'trusted.t4': 'Квазигоссектор',
      'trusted.t5': 'Госорганы',
      'services.tag': 'Услуги',
      'services.title': 'Полный спектр лизинговых решений',
      'services.desc': 'Мы предоставляем все виды лизинга в соответствии с законодательством Республики Казахстан, включая финансовый, операционный и возвратный лизинг.',
      'services.s1.title': 'Модульные здания',
      'services.s1.text': 'Быстровозводимые и модульные конструкции: вахтовые городки, административные здания, блок-контейнеры, мобильные офисы и жилые комплексы.',
      'services.s1.l1': 'Вахтовые городки',
      'services.s1.l2': 'Модульные офисы',
      'services.s1.l3': 'Блок-контейнеры',
      'services.s1.l4': 'Быстровозводимые конструкции',
      'services.s2.title': 'Спецтехника',
      'services.s2.text': 'Строительная, дорожная и промышленная техника: экскаваторы, бульдозеры, автокраны, погрузчики, буровые установки.',
      'services.s2.l1': 'Строительная техника',
      'services.s2.l2': 'Дорожная техника',
      'services.s2.l3': 'Погрузчики и краны',
      'services.s2.l4': 'Буровые установки',
      'services.s3.title': 'Сельхозтехника',
      'services.s3.text': 'Комбайны, тракторы, сеялки, опрыскиватели, зерноочистительные комплексы и другое оборудование для АПК.',
      'services.s3.l1': 'Тракторы и комбайны',
      'services.s3.l2': 'Посевные комплексы',
      'services.s3.l3': 'Зернохранилища',
      'services.s3.l4': 'Ирригационные системы',
      'services.s4.title': 'IT и телеком',
      'services.s4.text': 'Серверное оборудование, компьютерная техника, телекоммуникационное оборудование, сетевая инфраструктура и ЦОД.',
      'services.s4.l1': 'Серверы и СХД',
      'services.s4.l2': 'Рабочие станции',
      'services.s4.l3': 'Телеком-оборудование',
      'services.s4.l4': 'Сетевая инфраструктура',
      'services.s5.title': 'Промышленное оборудование',
      'services.s5.text': 'Производственные линии, станки, энергетическое оборудование, оборудование для пищевой и горнодобывающей промышленности.',
      'services.s5.l1': 'Производственные линии',
      'services.s5.l2': 'Станки с ЧПУ',
      'services.s5.l3': 'Энергооборудование',
      'services.s5.l4': 'Горнодобывающее оборудование',
      'services.s6.title': 'Возвратный лизинг',
      'services.s6.text': 'Высвобождение оборотных средств путём продажи имущества лизинговой компании с последующей арендой. Оптимизация баланса предприятия.',
      'services.s6.l1': 'Высвобождение капитала',
      'services.s6.l2': 'Оптимизация баланса',
      'services.s6.l3': 'Налоговые преимущества',
      'services.s6.l4': 'Гибкие условия',
      'services.learnMore': 'Подробнее →',
      'services.typesTitle': 'Виды лизинга',
      'services.type1.title': 'Финансовый лизинг',
      'services.type1.text': 'Приобретение имущества с переходом права собственности по окончании договора. Срок лизинга приближен к сроку полезного использования.',
      'services.type2.title': 'Операционный лизинг',
      'services.type2.text': 'Аренда имущества без обязательного выкупа. Идеально для оборудования с быстрым моральным устареванием — IT-техника, транспорт.',
      'services.type3.title': 'Возвратный лизинг',
      'services.type3.text': 'Продажа собственного имущества лизингодателю с заключением договора лизинга. Эффективный инструмент рефинансирования.',
      'calc.tag': 'Калькулятор',
      'calc.title': 'Рассчитайте стоимость лизинга',
      'calc.desc': 'Предварительный расчёт лизинговых платежей. Точные условия определяются индивидуально после рассмотрения заявки.',
      'calc.amount': 'Стоимость имущества (₸)',
      'calc.advance': 'Авансовый платёж (%)',
      'calc.term': 'Срок лизинга (месяцы)',
      'calc.type': 'Тип лизинга',
      'calc.financial': 'Финансовый',
      'calc.operational': 'Операционный',
      'calc.monthly': 'Ежемесячный платёж',
      'calc.advanceAmount': 'Авансовый платёж',
      'calc.totalPayments': 'Общая сумма выплат',
      'calc.overpayment': 'Удорожание',
      'calc.apply': 'Оставить заявку с этими параметрами',
      'calc.disclaimer': '* Расчёт является предварительным и не является публичной офертой. Окончательные условия определяются после рассмотрения заявки.',
      'process.tag': 'Процесс',
      'process.title': 'Как получить лизинг',
      'process.desc': 'Прозрачный и быстрый процесс от заявки до получения имущества',
      'process.s1.title': 'Заявка',
      'process.s1.text': 'Заполните онлайн-заявку или свяжитесь с нами. Укажите тип имущества, желаемые сроки и условия.',
      'process.s2.title': 'Анализ',
      'process.s2.text': 'Наши эксперты оценивают заявку, проводят финансовый анализ и подбирают оптимальные условия лизинга.',
      'process.s3.title': 'Одобрение',
      'process.s3.text': 'Принятие решения и согласование условий договора. Оформление всех необходимых документов.',
      'process.s4.title': 'Поставка',
      'process.s4.text': 'Приобретение и поставка имущества лизингополучателю. Начало использования оборудования.',
      'adv.tag': 'Преимущества',
      'adv.title': 'Почему Alapa Finance',
      'adv.a1.title': 'Индивидуальный подход',
      'adv.a1.text': 'Гибкие графики платежей, адаптированные под сезонность бизнеса и денежные потоки.',
      'adv.a2.title': 'Быстрые решения',
      'adv.a2.text': 'Рассмотрение заявки от 1 рабочего дня. Минимальный пакет документов.',
      'adv.a3.title': 'Полное покрытие РК',
      'adv.a3.text': 'Работаем во всех 17 регионах Казахстана — от Атырау до Усть-Каменогорска.',
      'adv.a4.title': 'Налоговые выгоды',
      'adv.a4.text': 'Лизинговые платежи полностью относятся на себестоимость, снижая налогооблагаемую базу.',
      'adv.a5.title': 'Без залога',
      'adv.a5.text': 'Предмет лизинга сам является обеспечением сделки. Не нужно предоставлять дополнительный залог.',
      'adv.a6.title': 'Экспертиза с 2020',
      'adv.a6.text': '5+ лет опыта в лизинге на рынке Казахстана. Понимаем специфику каждой отрасли.',
      'prog.tag': 'Программы',
      'prog.title': 'Государственные программы поддержки',
      'prog.desc': 'Мы активно развиваем сотрудничество с государственными институтами развития для предоставления льготных условий лизинга.',
      'prog.p1.title': '«Бизнестің жол картасы — 2025»',
      'prog.p1.text': 'Государственная программа поддержки предпринимательства: субсидирование ставки вознаграждения и гарантирование по договорам лизинга.',
      'prog.p2.title': 'НУХ «Байтерек»',
      'prog.p2.text': 'Фондирование через институты развития холдинга «Байтерек» для финансирования приоритетных отраслей экономики.',
      'prog.p3.title': 'КазАгроФинанс',
      'prog.p3.text': 'Партнёрство для субсидирования лизинга сельхозтехники и оборудования для предприятий агропромышленного комплекса.',
      'prog.p4.title': 'Фонд «Даму»',
      'prog.p4.text': 'Сотрудничество в рамках программ гарантирования и субсидирования для субъектов малого и среднего бизнеса.',
      'prog.coming': 'Перспективное направление',
      'about.tag': 'О компании',
      'about.title': 'Alapa Finance LLP',
      'about.lead': 'Компания основана в 2020 году с миссией сделать лизинг доступным инструментом развития для бизнеса любого масштаба в Казахстане.',
      'about.p1': 'Мы специализируемся на лизинге модульных зданий, специализированной техники, сельскохозяйственного оборудования и IT-инфраструктуры. Наши клиенты — предприятия крупного, среднего и малого бизнеса, агрохолдинги, квазигосударственные компании и местные исполнительные органы.',
      'about.p2': 'Alapa Finance работает в строгом соответствии с законодательством Республики Казахстан о финансовом лизинге, предоставляя полный спектр лизинговых услуг — финансовый, операционный и возвратный лизинг.',
      'about.n1': 'Год основания',
      'about.n2': 'Регионов РК',
      'about.n3': 'Направлений',
      'about.mapLabel': 'Покрытие по всему Казахстану',
      'law.tag': 'Правовая база',
      'law.title': 'Нормативное регулирование',
      'law.l1.title': 'Закон РК «О финансовом лизинге»',
      'law.l1.text': 'Основной закон, регулирующий лизинговую деятельность в Казахстане. Определяет права и обязанности сторон договора лизинга.',
      'law.l2.title': 'Гражданский кодекс РК',
      'law.l2.text': 'Глава о лизинге (финансовой аренде). Устанавливает общие правила и нормы для договорных отношений.',
      'law.l3.title': 'Налоговый кодекс РК',
      'law.l3.text': 'Налоговые преференции по лизинговым операциям. Отнесение платежей на вычеты, особенности НДС и КПН.',
      'faq.tag': 'FAQ',
      'faq.title': 'Часто задаваемые вопросы',
      'faq.q1': 'Какие документы нужны для получения лизинга?',
      'faq.a1': 'Стандартный пакет включает: учредительные документы компании, финансовую отчётность за последние 2-3 года, справку об отсутствии налоговой задолженности, бизнес-план (для крупных проектов). Для субъектов МСБ — упрощённый пакет документов.',
      'faq.q2': 'Каков минимальный авансовый платёж?',
      'faq.a2': 'Минимальный авансовый платёж составляет от 10% в зависимости от типа имущества, финансового состояния лизингополучателя и срока договора. Стандартный аванс — 20-30%.',
      'faq.q3': 'На какой срок можно оформить лизинг?',
      'faq.a3': 'Срок финансового лизинга — от 12 до 84 месяцев, в зависимости от вида имущества и его срока полезного использования. Операционный лизинг — от 12 до 60 месяцев.',
      'faq.q4': 'Кто является собственником имущества во время лизинга?',
      'faq.a4': 'В течение срока действия договора имущество находится на балансе лизингодателя (Alapa Finance). По окончании договора финансового лизинга и выплате всех платежей, право собственности переходит к лизингополучателю.',
      'faq.q5': 'Можно ли досрочно выкупить предмет лизинга?',
      'faq.a5': 'Да, досрочный выкуп возможен в соответствии с условиями договора. Как правило, досрочный выкуп доступен после определённого периода (обычно не менее 12 месяцев) при условии выплаты остаточной стоимости.',
      'faq.q6': 'Какие налоговые преимущества даёт лизинг?',
      'faq.a6': 'Лизинговые платежи полностью включаются в себестоимость и относятся на расходы. НДС по лизинговым платежам подлежит зачёту. Имущество учитывается на балансе лизингодателя, что не увеличивает стоимость основных средств лизингополучателя.',
      'app.tag': 'Заявка',
      'app.title': 'Оставить заявку на лизинг',
      'app.desc': 'Заполните форму и наш специалист свяжется с вами в течение 1 рабочего дня',
      'app.name': 'Наименование компании *',
      'app.bin': 'БИН *',
      'app.contact': 'Контактное лицо *',
      'app.phone': 'Телефон *',
      'app.email': 'Email *',
      'app.region': 'Регион',
      'app.selectRegion': 'Выберите регион',
      'app.leaseType': 'Тип лизинга',
      'app.typeFinancial': 'Финансовый лизинг',
      'app.typeOperational': 'Операционный лизинг',
      'app.typeLeaseback': 'Возвратный лизинг',
      'app.category': 'Категория имущества',
      'app.selectCategory': 'Выберите категорию',
      'app.catModular': 'Модульные здания',
      'app.catSpecial': 'Спецтехника',
      'app.catAgro': 'Сельхозтехника',
      'app.catIT': 'IT и телеком',
      'app.catIndustrial': 'Промышленное оборудование',
      'app.catOther': 'Другое',
      'app.estimatedAmount': 'Ориентировочная стоимость имущества (₸)',
      'app.description': 'Описание имущества',
      'app.consent': 'Я согласен на обработку персональных данных в соответствии с Законом РК «О персональных данных и их защите»',
      'app.submit': 'Отправить заявку',
      'app.successTitle': 'Заявка отправлена!',
      'app.successText': 'Наш специалист свяжется с вами в течение 1 рабочего дня.',
      'contact.tag': 'Контакты',
      'contact.title': 'Свяжитесь с нами',
      'contact.phone': 'Телефон',
      'contact.address': 'Адрес',
      'contact.addressText': 'Республика Казахстан<br>г. Алматы',
      'contact.hours': 'Режим работы',
      'contact.hoursText': 'Пн—Пт: 9:00 — 18:00',
      'contact.ctaTitle': 'Нужна консультация?',
      'contact.ctaText': 'Наши эксперты по лизингу готовы ответить на ваши вопросы и помочь подобрать оптимальное решение.',
      'contact.ctaBtn': 'Позвонить',
      'footer.services': 'Услуги',
      'footer.company': 'Компания',
      'footer.legal': 'Правовая информация',
      'footer.privacy': 'Политика конфиденциальности',
      'footer.terms': 'Пользовательское соглашение',
      'footer.disclosure': 'Раскрытие информации',
      'footer.desc': 'Лизинговые решения для бизнеса в Казахстане. Модульные здания, спецтехника, сельхозтехника, IT-оборудование.',
      'footer.rights': 'Все права защищены.',
      'footer.legalNote': 'ТОО «Alapa Finance» осуществляет деятельность в соответствии с законодательством Республики Казахстан.',
    },

    kz: {
      'nav.services': 'Қызметтер',
      'nav.calculator': 'Калькулятор',
      'nav.process': 'Қалай жұмыс істейді',
      'nav.programs': 'Бағдарламалар',
      'nav.about': 'Компания туралы',
      'nav.contact': 'Байланыс',
      'nav.apply': 'Өтінім қалдыру',
      'hero.badge': 'Қазақстанның лизингтік компаниясы',
      'hero.title': 'Бизнесіңіздің<br>өсуіне арналған<br><span class="text-gradient">қаржылық шешімдер</span>',
      'hero.desc': 'Кез келген масштабтағы кәсіпорындар үшін лизингтік қызметтердің толық спектрі — модульдік ғимараттардан бастап арнайы техника мен IT-инфрақұрылымға дейін. 2020 жылдан бері бүкіл Қазақстан бойынша жұмыс істейміз.',
      'hero.cta1': 'Есептеу алу',
      'hero.cta2': 'Біздің қызметтер',
      'hero.stat1': 'жыл нарықта',
      'hero.stat2': 'Қазақстан аймағы',
      'hero.stat3': 'лизинг бағыты',
      'hero.stat4': 'тұтынушыларға қолдау',
      'hero.chartLabel': 'Портфельдің өсуі',
      'trusted.label': 'Меншіктің барлық нысандарындағы кәсіпорындармен жұмыс істейміз',
      'trusted.t1': 'Ірі бизнес',
      'trusted.t2': 'ШОБ',
      'trusted.t3': 'Агрохолдингтер',
      'trusted.t4': 'Квазимемлекеттік сектор',
      'trusted.t5': 'Мемлекеттік органдар',
      'services.tag': 'Қызметтер',
      'services.title': 'Лизингтік шешімдердің толық спектрі',
      'services.desc': 'Біз Қазақстан Республикасының заңнамасына сәйкес лизингтің барлық түрлерін ұсынамыз — қаржылық, операциялық және кері лизинг.',
      'services.s1.title': 'Модульдік ғимараттар',
      'services.s1.text': 'Тез тұрғызылатын және модульдік құрылымдар: вахталық кенттер, әкімшілік ғимараттар, блок-контейнерлер, мобильді кеңселер.',
      'services.s1.l1': 'Вахталық кенттер',
      'services.s1.l2': 'Модульдік кеңселер',
      'services.s1.l3': 'Блок-контейнерлер',
      'services.s1.l4': 'Тез тұрғызылатын құрылымдар',
      'services.s2.title': 'Арнайы техника',
      'services.s2.text': 'Құрылыс, жол және өнеркәсіптік техника: экскаваторлар, бульдозерлер, автокрандар, тиегіштер, бұрғылау қондырғылары.',
      'services.s2.l1': 'Құрылыс техникасы',
      'services.s2.l2': 'Жол техникасы',
      'services.s2.l3': 'Тиегіштер мен крандар',
      'services.s2.l4': 'Бұрғылау қондырғылары',
      'services.s3.title': 'Ауылшаруашылық техникасы',
      'services.s3.text': 'Комбайндар, тракторлар, сепкіштер, бүріккіштер, дән тазалау кешендері және АӨК-ге арналған басқа жабдықтар.',
      'services.s3.l1': 'Тракторлар мен комбайндар',
      'services.s3.l2': 'Егу кешендері',
      'services.s3.l3': 'Астық қоймалары',
      'services.s3.l4': 'Суландыру жүйелері',
      'services.s4.title': 'IT және телеком',
      'services.s4.text': 'Серверлік жабдық, компьютерлік техника, телекоммуникациялық жабдық, желілік инфрақұрылым және ДОО.',
      'services.s4.l1': 'Серверлер мен МДЖ',
      'services.s4.l2': 'Жұмыс станциялары',
      'services.s4.l3': 'Телеком-жабдық',
      'services.s4.l4': 'Желілік инфрақұрылым',
      'services.s5.title': 'Өнеркәсіптік жабдық',
      'services.s5.text': 'Өндірістік желілер, станоктар, энергетикалық жабдық, тамақ және тау-кен өнеркәсібіне арналған жабдық.',
      'services.s5.l1': 'Өндірістік желілер',
      'services.s5.l2': 'СББ станоктары',
      'services.s5.l3': 'Энергожабдық',
      'services.s5.l4': 'Тау-кен жабдығы',
      'services.s6.title': 'Кері лизинг',
      'services.s6.text': 'Мүлікті лизингтік компанияға сатып, кейіннен жалға алу арқылы айналым қаражатын босату. Кәсіпорын балансын оңтайландыру.',
      'services.s6.l1': 'Капиталды босату',
      'services.s6.l2': 'Балансты оңтайландыру',
      'services.s6.l3': 'Салықтық артықшылықтар',
      'services.s6.l4': 'Икемді шарттар',
      'services.learnMore': 'Толығырақ →',
      'services.typesTitle': 'Лизинг түрлері',
      'services.type1.title': 'Қаржылық лизинг',
      'services.type1.text': 'Шарттың аяқталуы бойынша меншік құқығының ауысуымен мүлікті сатып алу. Лизинг мерзімі пайдалы қолдану мерзіміне жақындатылған.',
      'services.type2.title': 'Операциялық лизинг',
      'services.type2.text': 'Міндетті сатып алусыз мүлікті жалға алу. Тез ескіретін жабдыққа — IT-техника, көлік үшін тамаша.',
      'services.type3.title': 'Кері лизинг',
      'services.type3.text': 'Лизинг шартын жасай отырып, өз мүлкін лизинг берушіге сату. Қайта қаржыландырудың тиімді құралы.',
      'calc.tag': 'Калькулятор',
      'calc.title': 'Лизинг құнын есептеңіз',
      'calc.desc': 'Лизингтік төлемдерді алдын ала есептеу. Нақты шарттар өтінімді қарағаннан кейін жеке анықталады.',
      'calc.amount': 'Мүлік құны (₸)',
      'calc.advance': 'Аванстық төлем (%)',
      'calc.term': 'Лизинг мерзімі (айлар)',
      'calc.type': 'Лизинг түрі',
      'calc.financial': 'Қаржылық',
      'calc.operational': 'Операциялық',
      'calc.monthly': 'Ай сайынғы төлем',
      'calc.advanceAmount': 'Аванстық төлем',
      'calc.totalPayments': 'Төлемдердің жалпы сомасы',
      'calc.overpayment': 'Қымбаттау',
      'calc.apply': 'Осы параметрлермен өтінім қалдыру',
      'calc.disclaimer': '* Есептеу алдын ала болып табылады және жария оферта емес. Түпкілікті шарттар өтінімді қарағаннан кейін анықталады.',
      'process.tag': 'Процесс',
      'process.title': 'Лизингті қалай алуға болады',
      'process.desc': 'Өтінімнен мүлікті алуға дейінгі ашық және жылдам процесс',
      'process.s1.title': 'Өтінім',
      'process.s1.text': 'Онлайн-өтінімді толтырыңыз немесе бізге хабарласыңыз. Мүлік түрін, қалаған мерзімдер мен шарттарды көрсетіңіз.',
      'process.s2.title': 'Талдау',
      'process.s2.text': 'Біздің сарапшылар өтінімді бағалайды, қаржылық талдау жүргізеді және лизингтің оңтайлы шарттарын таңдайды.',
      'process.s3.title': 'Мақұлдау',
      'process.s3.text': 'Шешім қабылдау және шарт талаптарын келісу. Барлық қажетті құжаттарды рәсімдеу.',
      'process.s4.title': 'Жеткізу',
      'process.s4.text': 'Мүлікті сатып алу және лизинг алушыға жеткізу. Жабдықты пайдалануды бастау.',
      'adv.tag': 'Артықшылықтар',
      'adv.title': 'Неге Alapa Finance',
      'adv.a1.title': 'Жеке көзқарас',
      'adv.a1.text': 'Бизнестің маусымдылығы мен ақша ағындарына бейімделген икемді төлем кестелері.',
      'adv.a2.title': 'Жылдам шешімдер',
      'adv.a2.text': 'Өтінімді 1 жұмыс күнінен бастап қарау. Құжаттардың минималды пакеті.',
      'adv.a3.title': 'ҚР толық қамту',
      'adv.a3.text': 'Қазақстанның барлық 17 аймағында жұмыс істейміз — Атыраудан Өскеменге дейін.',
      'adv.a4.title': 'Салықтық артықшылықтар',
      'adv.a4.text': 'Лизингтік төлемдер толығымен өзіндік құнға жатқызылады, салық салынатын базаны азайтады.',
      'adv.a5.title': 'Кепілсіз',
      'adv.a5.text': 'Лизинг мәні мәміленің қамтамасыз етуі болып табылады. Қосымша кепіл беру қажет емес.',
      'adv.a6.title': '2020 жылдан тәжірибе',
      'adv.a6.text': 'Қазақстан нарығында лизинг бойынша 5+ жыл тәжірибе. Әр саланың ерекшелігін түсінеміз.',
      'prog.tag': 'Бағдарламалар',
      'prog.title': 'Мемлекеттік қолдау бағдарламалары',
      'prog.desc': 'Біз лизингтің жеңілдікті шарттарын ұсыну үшін мемлекеттік даму институттарымен ынтымақтастықты белсенді дамытамыз.',
      'prog.p1.title': '«Бизнестің жол картасы — 2025»',
      'prog.p1.text': 'Кәсіпкерлікті қолдаудың мемлекеттік бағдарламасы: лизинг шарттары бойынша сыйақы мөлшерлемесін субсидиялау және кепілдік беру.',
      'prog.p2.title': 'ҰБХ «Бәйтерек»',
      'prog.p2.text': 'Экономиканың басым салаларын қаржыландыру үшін «Бәйтерек» холдингінің даму институттары арқылы қаржыландыру.',
      'prog.p3.title': 'ҚазАгроҚаржы',
      'prog.p3.text': 'Агроөнеркәсіптік кешен кәсіпорындарына арналған ауылшаруашылық техникасы мен жабдығын лизингке субсидиялау серіктестігі.',
      'prog.p4.title': '«Даму» қоры',
      'prog.p4.text': 'Шағын және орта бизнес субъектілеріне кепілдік беру мен субсидиялау бағдарламалары шеңберіндегі ынтымақтастық.',
      'prog.coming': 'Перспективалық бағыт',
      'about.tag': 'Компания туралы',
      'about.title': 'Alapa Finance LLP',
      'about.lead': 'Компания 2020 жылы Қазақстанда кез келген масштабтағы бизнес үшін лизингті қолжетімді даму құралына айналдыру миссиясымен құрылған.',
      'about.p1': 'Біз модульдік ғимараттарды, мамандандырылған техниканы, ауылшаруашылық жабдығы мен IT-инфрақұрылымды лизингке маманданамыз. Біздің клиенттер — ірі, орта және шағын бизнес кәсіпорындары, агрохолдингтер, квазимемлекеттік компаниялар мен жергілікті атқарушы органдар.',
      'about.p2': 'Alapa Finance қаржылық лизинг туралы Қазақстан Республикасының заңнамасына қатаң сәйкестікте жұмыс істейді, лизингтік қызметтердің толық спектрін — қаржылық, операциялық және кері лизингті ұсынады.',
      'about.n1': 'Құрылған жылы',
      'about.n2': 'ҚР аймақтары',
      'about.n3': 'Бағыттар',
      'about.mapLabel': 'Бүкіл Қазақстан бойынша қамту',
      'law.tag': 'Құқықтық база',
      'law.title': 'Нормативтік реттеу',
      'law.l1.title': 'ҚР «Қаржылық лизинг туралы» Заңы',
      'law.l1.text': 'Қазақстандағы лизингтік қызметті реттейтін негізгі заң. Лизинг шартының тараптарының құқықтары мен міндеттерін анықтайды.',
      'law.l2.title': 'ҚР Азаматтық кодексі',
      'law.l2.text': 'Лизинг (қаржылық жалдау) туралы тарау. Шарттық қатынастар үшін жалпы ережелер мен нормаларды белгілейді.',
      'law.l3.title': 'ҚР Салық кодексі',
      'law.l3.text': 'Лизингтік операциялар бойынша салықтық преференциялар. Төлемдерді шегерімдерге жатқызу, ҚҚС және КТС ерекшеліктері.',
      'faq.tag': 'Жиі қойылатын сұрақтар',
      'faq.title': 'Жиі қойылатын сұрақтар',
      'faq.q1': 'Лизинг алу үшін қандай құжаттар қажет?',
      'faq.a1': 'Стандартты пакетке кіреді: компанияның құрылтай құжаттары, соңғы 2-3 жылдағы қаржылық есептілік, салық берешегінің жоқтығы туралы анықтама, бизнес-жоспар (ірі жобалар үшін). ШОБ субъектілеріне — жеңілдетілген құжат пакеті.',
      'faq.q2': 'Ең аз аванстық төлем қандай?',
      'faq.a2': 'Ең аз аванстық төлем мүлік түріне, лизинг алушының қаржылық жағдайына және шарт мерзіміне байланысты 10%-дан басталады. Стандартты аванс — 20-30%.',
      'faq.q3': 'Лизингті қандай мерзімге рәсімдеуге болады?',
      'faq.a3': 'Қаржылық лизинг мерзімі — мүлік түрі мен оның пайдалы қолдану мерзіміне байланысты 12-ден 84 айға дейін. Операциялық лизинг — 12-ден 60 айға дейін.',
      'faq.q4': 'Лизинг кезінде мүліктің меншік иесі кім болады?',
      'faq.a4': 'Шарт қолданылу мерзімі ішінде мүлік лизинг берушінің (Alapa Finance) балансында тұрады. Қаржылық лизинг шартының аяқталуы және барлық төлемдердің төленуі бойынша меншік құқығы лизинг алушыға ауысады.',
      'faq.q5': 'Лизинг мәнін мерзімінен бұрын сатып алуға бола ма?',
      'faq.a5': 'Иә, шарт талаптарына сәйкес мерзімінен бұрын сатып алу мүмкін. Әдетте, мерзімінен бұрын сатып алу белгілі бір кезеңнен кейін (әдетте 12 айдан кем емес) қалдық құнды төлеу шартымен қолжетімді.',
      'faq.q6': 'Лизинг қандай салықтық артықшылықтар береді?',
      'faq.a6': 'Лизингтік төлемдер толығымен өзіндік құнға кіреді және шығыстарға жатқызылады. Лизингтік төлемдер бойынша ҚҚС есепке алынуға жатады. Мүлік лизинг берушінің балансында есепке алынады, бұл лизинг алушының негізгі құралдарының құнын ұлғайтпайды.',
      'app.tag': 'Өтінім',
      'app.title': 'Лизингке өтінім қалдыру',
      'app.desc': 'Нысанды толтырыңыз, біздің маман 1 жұмыс күні ішінде сізбен байланысады',
      'app.name': 'Компания атауы *',
      'app.bin': 'БСН *',
      'app.contact': 'Байланыс тұлғасы *',
      'app.phone': 'Телефон *',
      'app.email': 'Email *',
      'app.region': 'Аймақ',
      'app.selectRegion': 'Аймақты таңдаңыз',
      'app.leaseType': 'Лизинг түрі',
      'app.typeFinancial': 'Қаржылық лизинг',
      'app.typeOperational': 'Операциялық лизинг',
      'app.typeLeaseback': 'Кері лизинг',
      'app.category': 'Мүлік категориясы',
      'app.selectCategory': 'Категорияны таңдаңыз',
      'app.catModular': 'Модульдік ғимараттар',
      'app.catSpecial': 'Арнайы техника',
      'app.catAgro': 'Ауылшаруашылық техникасы',
      'app.catIT': 'IT және телеком',
      'app.catIndustrial': 'Өнеркәсіптік жабдық',
      'app.catOther': 'Басқа',
      'app.estimatedAmount': 'Мүліктің болжамды құны (₸)',
      'app.description': 'Мүлік сипаттамасы',
      'app.consent': 'Мен ҚР «Дербес деректер және оларды қорғау туралы» Заңына сәйкес дербес деректерді өңдеуге келісемін',
      'app.submit': 'Өтінім жіберу',
      'app.successTitle': 'Өтінім жіберілді!',
      'app.successText': 'Біздің маман 1 жұмыс күні ішінде сізбен байланысады.',
      'contact.tag': 'Байланыс',
      'contact.title': 'Бізбен байланысыңыз',
      'contact.phone': 'Телефон',
      'contact.address': 'Мекенжай',
      'contact.addressText': 'Қазақстан Республикасы<br>Алматы қ.',
      'contact.hours': 'Жұмыс режимі',
      'contact.hoursText': 'Дс—Жм: 9:00 — 18:00',
      'contact.ctaTitle': 'Кеңес қажет пе?',
      'contact.ctaText': 'Біздің лизинг бойынша сарапшылар сұрақтарыңызға жауап беруге және оңтайлы шешім таңдауға дайын.',
      'contact.ctaBtn': 'Қоңырау шалу',
      'footer.services': 'Қызметтер',
      'footer.company': 'Компания',
      'footer.legal': 'Құқықтық ақпарат',
      'footer.privacy': 'Құпиялылық саясаты',
      'footer.terms': 'Пайдаланушы келісімі',
      'footer.disclosure': 'Ақпаратты ашу',
      'footer.desc': 'Қазақстандағы бизнес үшін лизингтік шешімдер. Модульдік ғимараттар, арнайы техника, ауылшаруашылық техникасы, IT-жабдық.',
      'footer.rights': 'Барлық құқықтар қорғалған.',
      'footer.legalNote': '«Alapa Finance» ЖШС Қазақстан Республикасының заңнамасына сәйкес қызметін жүзеге асырады.',
    },

    en: {
      'nav.services': 'Services',
      'nav.calculator': 'Calculator',
      'nav.process': 'How It Works',
      'nav.programs': 'Programs',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.apply': 'Apply Now',
      'hero.badge': 'Leasing Company of Kazakhstan',
      'hero.title': 'Financial Solutions<br>for Your Business<br><span class="text-gradient">Growth</span>',
      'hero.desc': 'Full range of leasing services for enterprises of any scale — from modular buildings and special equipment to IT infrastructure. Operating across Kazakhstan since 2020.',
      'hero.cta1': 'Get a Quote',
      'hero.cta2': 'Our Services',
      'hero.stat1': 'years in market',
      'hero.stat2': 'regions of Kazakhstan',
      'hero.stat3': 'leasing directions',
      'hero.stat4': 'client support',
      'hero.chartLabel': 'Portfolio Growth',
      'trusted.label': 'Working with enterprises of all ownership forms',
      'trusted.t1': 'Large Business',
      'trusted.t2': 'SMEs',
      'trusted.t3': 'Agricultural Holdings',
      'trusted.t4': 'Quasi-state Sector',
      'trusted.t5': 'Government Bodies',
      'services.tag': 'Services',
      'services.title': 'Full Range of Leasing Solutions',
      'services.desc': 'We provide all types of leasing in accordance with the legislation of the Republic of Kazakhstan, including financial, operating, and sale-leaseback.',
      'services.s1.title': 'Modular Buildings',
      'services.s1.text': 'Prefabricated and modular structures: rotational camps, administrative buildings, block containers, mobile offices and residential complexes.',
      'services.s1.l1': 'Rotational Camps',
      'services.s1.l2': 'Modular Offices',
      'services.s1.l3': 'Block Containers',
      'services.s1.l4': 'Prefab Structures',
      'services.s2.title': 'Special Equipment',
      'services.s2.text': 'Construction, road and industrial machinery: excavators, bulldozers, truck cranes, loaders, drilling rigs.',
      'services.s2.l1': 'Construction Equipment',
      'services.s2.l2': 'Road Machinery',
      'services.s2.l3': 'Loaders & Cranes',
      'services.s2.l4': 'Drilling Rigs',
      'services.s3.title': 'Agricultural Machinery',
      'services.s3.text': 'Combines, tractors, seeders, sprayers, grain cleaning complexes and other agricultural equipment.',
      'services.s3.l1': 'Tractors & Combines',
      'services.s3.l2': 'Seeding Complexes',
      'services.s3.l3': 'Grain Storage',
      'services.s3.l4': 'Irrigation Systems',
      'services.s4.title': 'IT & Telecom',
      'services.s4.text': 'Server equipment, computer hardware, telecommunications equipment, network infrastructure and data centers.',
      'services.s4.l1': 'Servers & Storage',
      'services.s4.l2': 'Workstations',
      'services.s4.l3': 'Telecom Equipment',
      'services.s4.l4': 'Network Infrastructure',
      'services.s5.title': 'Industrial Equipment',
      'services.s5.text': 'Production lines, CNC machines, energy equipment, food processing and mining industry equipment.',
      'services.s5.l1': 'Production Lines',
      'services.s5.l2': 'CNC Machines',
      'services.s5.l3': 'Energy Equipment',
      'services.s5.l4': 'Mining Equipment',
      'services.s6.title': 'Sale-Leaseback',
      'services.s6.text': 'Freeing up working capital by selling assets to the leasing company with subsequent lease. Balance sheet optimization.',
      'services.s6.l1': 'Capital Release',
      'services.s6.l2': 'Balance Optimization',
      'services.s6.l3': 'Tax Advantages',
      'services.s6.l4': 'Flexible Terms',
      'services.learnMore': 'Learn More →',
      'services.typesTitle': 'Types of Leasing',
      'services.type1.title': 'Financial Leasing',
      'services.type1.text': 'Acquisition of property with transfer of ownership at the end of the agreement. Lease term approaches the useful life of the asset.',
      'services.type2.title': 'Operating Leasing',
      'services.type2.text': 'Rental of property without mandatory purchase. Ideal for equipment with rapid obsolescence — IT hardware, transport.',
      'services.type3.title': 'Sale-Leaseback',
      'services.type3.text': 'Selling own property to the lessor with a lease agreement. An effective refinancing tool.',
      'calc.tag': 'Calculator',
      'calc.title': 'Calculate Your Leasing Cost',
      'calc.desc': 'Preliminary calculation of leasing payments. Exact terms are determined individually after application review.',
      'calc.amount': 'Asset Value (₸)',
      'calc.advance': 'Down Payment (%)',
      'calc.term': 'Lease Term (months)',
      'calc.type': 'Lease Type',
      'calc.financial': 'Financial',
      'calc.operational': 'Operating',
      'calc.monthly': 'Monthly Payment',
      'calc.advanceAmount': 'Down Payment',
      'calc.totalPayments': 'Total Payments',
      'calc.overpayment': 'Appreciation',
      'calc.apply': 'Apply with These Parameters',
      'calc.disclaimer': '* The calculation is preliminary and does not constitute a public offer. Final terms are determined after application review.',
      'process.tag': 'Process',
      'process.title': 'How to Get Leasing',
      'process.desc': 'Transparent and fast process from application to asset delivery',
      'process.s1.title': 'Application',
      'process.s1.text': 'Fill out the online application or contact us. Specify the type of property, desired terms and conditions.',
      'process.s2.title': 'Analysis',
      'process.s2.text': 'Our experts evaluate the application, conduct financial analysis and select optimal leasing conditions.',
      'process.s3.title': 'Approval',
      'process.s3.text': 'Decision making and agreement of contract terms. Processing all required documents.',
      'process.s4.title': 'Delivery',
      'process.s4.text': 'Acquisition and delivery of property to the lessee. Start using the equipment.',
      'adv.tag': 'Advantages',
      'adv.title': 'Why Alapa Finance',
      'adv.a1.title': 'Individual Approach',
      'adv.a1.text': 'Flexible payment schedules adapted to business seasonality and cash flows.',
      'adv.a2.title': 'Fast Decisions',
      'adv.a2.text': 'Application review from 1 business day. Minimum document package.',
      'adv.a3.title': 'Full Coverage of RK',
      'adv.a3.text': 'Operating in all 17 regions of Kazakhstan — from Atyrau to Ust-Kamenogorsk.',
      'adv.a4.title': 'Tax Benefits',
      'adv.a4.text': 'Leasing payments are fully attributed to costs, reducing the taxable base.',
      'adv.a5.title': 'No Collateral',
      'adv.a5.text': 'The leased asset itself serves as transaction security. No additional collateral required.',
      'adv.a6.title': 'Expertise Since 2020',
      'adv.a6.text': '5+ years of leasing experience in the Kazakhstan market. We understand the specifics of each industry.',
      'prog.tag': 'Programs',
      'prog.title': 'Government Support Programs',
      'prog.desc': 'We actively develop cooperation with state development institutions to provide preferential leasing terms.',
      'prog.p1.title': '"Business Roadmap — 2025"',
      'prog.p1.text': 'State entrepreneurship support program: subsidizing interest rates and guaranteeing leasing agreements.',
      'prog.p2.title': 'NMH "Baiterek"',
      'prog.p2.text': 'Funding through Baiterek holding development institutions to finance priority sectors of the economy.',
      'prog.p3.title': 'KazAgroFinance',
      'prog.p3.text': 'Partnership for subsidizing leasing of agricultural machinery and equipment for agro-industrial enterprises.',
      'prog.p4.title': '"Damu" Fund',
      'prog.p4.text': 'Cooperation in guarantee and subsidy programs for small and medium business entities.',
      'prog.coming': 'Prospective Direction',
      'about.tag': 'About',
      'about.title': 'Alapa Finance LLP',
      'about.lead': 'The company was founded in 2020 with a mission to make leasing an accessible development tool for businesses of any scale in Kazakhstan.',
      'about.p1': 'We specialize in leasing modular buildings, specialized equipment, agricultural machinery and IT infrastructure. Our clients include large, medium and small enterprises, agricultural holdings, quasi-state companies and local executive bodies.',
      'about.p2': 'Alapa Finance operates in strict compliance with the legislation of the Republic of Kazakhstan on financial leasing, providing a full range of leasing services — financial, operating and sale-leaseback.',
      'about.n1': 'Year Founded',
      'about.n2': 'Regions of RK',
      'about.n3': 'Directions',
      'about.mapLabel': 'Coverage Across Kazakhstan',
      'law.tag': 'Legal Framework',
      'law.title': 'Regulatory Framework',
      'law.l1.title': 'RK Law "On Financial Leasing"',
      'law.l1.text': 'The main law regulating leasing activities in Kazakhstan. Defines the rights and obligations of the parties to the lease agreement.',
      'law.l2.title': 'Civil Code of RK',
      'law.l2.text': 'Chapter on leasing (financial lease). Establishes general rules and norms for contractual relations.',
      'law.l3.title': 'Tax Code of RK',
      'law.l3.text': 'Tax preferences for leasing operations. Attribution of payments to deductions, specifics of VAT and CIT.',
      'faq.tag': 'FAQ',
      'faq.title': 'Frequently Asked Questions',
      'faq.q1': 'What documents are needed to obtain leasing?',
      'faq.a1': 'Standard package includes: company constituent documents, financial statements for the last 2-3 years, tax clearance certificate, business plan (for large projects). For SMEs — simplified document package.',
      'faq.q2': 'What is the minimum down payment?',
      'faq.a2': 'The minimum down payment starts from 10% depending on the type of property, the financial condition of the lessee and the contract term. Standard advance — 20-30%.',
      'faq.q3': 'For what term can leasing be arranged?',
      'faq.a3': 'Financial leasing term — from 12 to 84 months, depending on the type of property and its useful life. Operating leasing — from 12 to 60 months.',
      'faq.q4': 'Who owns the property during the lease?',
      'faq.a4': 'During the contract term, the property is on the balance sheet of the lessor (Alapa Finance). Upon completion of the financial lease agreement and payment of all payments, ownership transfers to the lessee.',
      'faq.q5': 'Is early buyout of the leased asset possible?',
      'faq.a5': 'Yes, early buyout is possible in accordance with the terms of the agreement. As a rule, early buyout is available after a certain period (usually at least 12 months) subject to payment of the residual value.',
      'faq.q6': 'What tax advantages does leasing provide?',
      'faq.a6': 'Leasing payments are fully included in costs. VAT on leasing payments is subject to offset. Property is recorded on the lessor\'s balance sheet, which does not increase the cost of the lessee\'s fixed assets.',
      'app.tag': 'Application',
      'app.title': 'Submit a Leasing Application',
      'app.desc': 'Fill in the form and our specialist will contact you within 1 business day',
      'app.name': 'Company Name *',
      'app.bin': 'BIN *',
      'app.contact': 'Contact Person *',
      'app.phone': 'Phone *',
      'app.email': 'Email *',
      'app.region': 'Region',
      'app.selectRegion': 'Select Region',
      'app.leaseType': 'Lease Type',
      'app.typeFinancial': 'Financial Leasing',
      'app.typeOperational': 'Operating Leasing',
      'app.typeLeaseback': 'Sale-Leaseback',
      'app.category': 'Asset Category',
      'app.selectCategory': 'Select Category',
      'app.catModular': 'Modular Buildings',
      'app.catSpecial': 'Special Equipment',
      'app.catAgro': 'Agricultural Machinery',
      'app.catIT': 'IT & Telecom',
      'app.catIndustrial': 'Industrial Equipment',
      'app.catOther': 'Other',
      'app.estimatedAmount': 'Estimated Asset Value (₸)',
      'app.description': 'Asset Description',
      'app.consent': 'I consent to the processing of personal data in accordance with the RK Law "On Personal Data and Their Protection"',
      'app.submit': 'Submit Application',
      'app.successTitle': 'Application Submitted!',
      'app.successText': 'Our specialist will contact you within 1 business day.',
      'contact.tag': 'Contact',
      'contact.title': 'Get in Touch',
      'contact.phone': 'Phone',
      'contact.address': 'Address',
      'contact.addressText': 'Republic of Kazakhstan<br>Almaty',
      'contact.hours': 'Working Hours',
      'contact.hoursText': 'Mon—Fri: 9:00 AM — 6:00 PM',
      'contact.ctaTitle': 'Need a Consultation?',
      'contact.ctaText': 'Our leasing experts are ready to answer your questions and help find the optimal solution.',
      'contact.ctaBtn': 'Call Us',
      'footer.services': 'Services',
      'footer.company': 'Company',
      'footer.legal': 'Legal Information',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.disclosure': 'Disclosure',
      'footer.desc': 'Leasing solutions for business in Kazakhstan. Modular buildings, special equipment, agricultural machinery, IT equipment.',
      'footer.rights': 'All rights reserved.',
      'footer.legalNote': 'Alapa Finance LLP operates in accordance with the legislation of the Republic of Kazakhstan.',
    }
  };

  let currentLang = 'ru';

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang === 'kz' ? 'kk' : lang;

    // Update page title
    const titles = {
      ru: 'Alapa Finance — Лизинговые решения в Казахстане',
      kz: 'Alapa Finance — Қазақстандағы лизингтік шешімдер',
      en: 'Alapa Finance — Leasing Solutions in Kazakhstan'
    };
    document.title = titles[lang];

    // Update all translated elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          // Don't change input values
        } else {
          el.innerHTML = translations[lang][key];
        }
      }
    });

    // Update lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Store preference
    try { localStorage.setItem('alapa_lang', lang); } catch(e) {}
  }

  // Language switcher
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Restore saved language
  try {
    const saved = localStorage.getItem('alapa_lang');
    if (saved && translations[saved]) setLanguage(saved);
  } catch(e) {}

  // ===== SMOOTH SCROLL for anchors =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
