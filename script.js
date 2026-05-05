document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // 1. Mode sombre / clair
    // ===================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></svg>`;
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>`;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = moonIcon;
                themeToggle.setAttribute('aria-label', 'Passer au mode sombre');
            }
        } else {
            body.classList.remove('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = sunIcon;
                themeToggle.setAttribute('aria-label', 'Passer au mode clair');
            }
        }
    };

    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // ===================================================================
    // 2. Lien actif dans la nav
    // ===================================================================
    const navLinks = document.querySelectorAll('header nav ul li > a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPage = href.split('/').pop().split('#')[0];
        if (linkPage === currentPage || (linkPage === 'index.html' && currentPage === '')) {
            link.classList.add('active');
        }
    });

    // ===================================================================
    // 3. Menu burger mobile
    // ===================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('header nav ul');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navList.classList.toggle('open');
            const expanded = menuToggle.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', expanded);
        });

        // Sur mobile, gérer l'ouverture des dropdowns au clic
        document.querySelectorAll('.dropdown .dropbtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    btn.parentElement.classList.toggle('open-mobile');
                }
            });
        });

        // Fermer le menu en cliquant sur un lien
        navList.querySelectorAll('a').forEach(link => {
            if (!link.classList.contains('dropbtn')) {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 900) {
                        menuToggle.classList.remove('open');
                        navList.classList.remove('open');
                    }
                });
            }
        });
    }

    // ===================================================================
    // 4. Scroll progress bar
    // ===================================================================
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = percent + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // ===================================================================
    // 5. Reveal au scroll
    // ===================================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ===================================================================
    // 6. Typing effect sur le hero (si présent)
    // ===================================================================
    const typingEl = document.querySelector('[data-typing]');
    if (typingEl) {
        const phrases = JSON.parse(typingEl.getAttribute('data-typing'));
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const cursor = typingEl.querySelector('.cursor');
        const textNode = typingEl.querySelector('.typed-text');

        const type = () => {
            const current = phrases[phraseIdx];
            if (!isDeleting) {
                charIdx++;
                if (textNode) textNode.textContent = current.substring(0, charIdx);
                if (charIdx === current.length) {
                    isDeleting = true;
                    setTimeout(type, 2200);
                    return;
                }
                setTimeout(type, 70);
            } else {
                charIdx--;
                if (textNode) textNode.textContent = current.substring(0, charIdx);
                if (charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, 35);
            }
        };
        if (textNode) setTimeout(type, 600);
    }

    // ===================================================================
    // 7. Smooth scroll avec offset header (ancres internes)
    // ===================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: elementPosition - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
});