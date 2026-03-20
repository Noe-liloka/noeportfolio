document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // 1. GESTION DU MODE SOMBRE / CLAIR (ICÔNES)
    // ===================================================================
    
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Icônes SVG
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></svg>`;
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>`;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            // En mode clair, on affiche la LUNE pour repasser en sombre
            themeToggle.innerHTML = moonIcon;
            themeToggle.setAttribute('aria-label', 'Passer au mode sombre');
        } else {
            body.classList.remove('light-mode');
            // En mode sombre, on affiche le SOLEIL pour passer en clair
            themeToggle.innerHTML = sunIcon;
            themeToggle.setAttribute('aria-label', 'Passer au mode clair');
        }
    };

    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const newTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // ===================================================================
    // 2. GESTION DU LIEN ACTIF DANS LA NAV
    // ===================================================================

    const navLinks = document.querySelectorAll('header nav ul li a');
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split("/").pop();
        // Ignore les ancres (#) pour la comparaison de base
        const cleanLinkPage = linkPage.split('#')[0]; 
        
        if ((currentPage === "" || currentPage === "index.html") && (cleanLinkPage === "" || cleanLinkPage === "index.html")) {
            link.classList.add('active');
        } 
        else if (currentPage === cleanLinkPage && currentPage !== "") {
            link.classList.add('active');
        }
    });

    // ===================================================================
    // 3. GESTION DE L'APPARITION AU SCROLL
    // ===================================================================

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 }); 
    
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
});