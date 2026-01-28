class AjaxNavigation {
    constructor() {
        this.cache = new Map();
        this.currentPage = 'index.html';
        this.init();
    }

    init() {
        // Перехватываем клики по ссылкам
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');

            // Игнорируем внешние ссылки, якоря, почту и телефон
            if (!href ||
                href.startsWith('http') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                href.startsWith('#') ||
                href === 'javascript:void(0)') {
                return;
            }

            // Проверяем, ведет ли ссылка на HTML страницу
            if (href.endsWith('.html') || !href.includes('.')) {
                e.preventDefault();
                this.navigate(href);
            }
        });

        // Обрабатываем кнопку "Назад" браузера
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });

        // Загружаем текущую страницу
        this.loadPage(window.location.pathname.split('/').pop() || 'index.html', false);
    }

    async navigate(url) {
        // Если уже на этой странице
        if (url === this.currentPage) return;

        // Добавляем в историю
        window.history.pushState({ page: url }, '', url);

        // Загружаем страницу
        await this.loadPage(url, true);

        // Обновляем активную ссылку в навигации
        this.updateActiveLink(url);
    }

    async loadPage(url, animate = true) {
        // Нормализуем URL
        if (!url.endsWith('.html') && !url.includes('.')) {
            url = url + '.html';
        }

        // Сохраняем текущую позицию скролла
        const scrollPosition = window.scrollY;

        try {
            // Показываем индикатор загрузки
            this.showLoader();

            // Проверяем кэш
            let content;
            if (this.cache.has(url)) {
                content = this.cache.get(url);
            } else {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const html = await response.text();

                // Извлекаем только содержимое <main>
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const mainContent = doc.querySelector('main');

                if (!mainContent) throw new Error('No main content found');

                // Обрабатываем относительные пути в ссылках
                this.processRelativePaths(mainContent, url);

                content = mainContent.innerHTML;
                this.cache.set(url, content);
            }

            // Анимированная замена контента
            const mainElement = document.querySelector('main');
            if (!mainElement) throw new Error('No main element found');

            if (animate) {
                mainElement.style.opacity = '0';
                mainElement.style.transform = 'translateY(20px)';
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            mainElement.innerHTML = content;
            this.currentPage = url;

            if (animate) {
                mainElement.style.transition = 'all 0.5s ease';
                mainElement.style.opacity = '1';
                mainElement.style.transform = 'translateY(0)';

                setTimeout(() => {
                    mainElement.style.transition = '';
                }, 500);
            }

            // Инициализируем скрипты для новой страницы
            this.initPageScripts();

            // Обновляем мета-теги
            this.updateMetaTags(url);

            // Восстанавливаем скролл
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('Failed to load page:', error);
            this.showError(url);
        } finally {
            this.hideLoader();
        }
    }

    processRelativePaths(element, baseUrl) {
        // Обрабатываем ссылки
        element.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') &&
                !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                if (href.startsWith('/')) {
                    // Абсолютный путь - оставляем как есть
                    return;
                }

                // Относительный путь - делаем абсолютным относительно baseUrl
                const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
                link.setAttribute('href', basePath + href);
            }
        });

        // Обрабатываем изображения
        element.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                if (src.startsWith('/')) {
                    return;
                }

                const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
                img.setAttribute('src', basePath + src);
            }
        });

        // Обрабатываем скрипты и стили
        element.querySelectorAll('script, link[rel="stylesheet"]').forEach(el => {
            el.remove();
        });
    }

    initPageScripts() {
        // Инициализация для страницы cookies
        if (this.currentPage.includes('cookies')) {
            this.initCookiePage();
        }

        // Инициализация для страницы политики конфиденциальности
        if (this.currentPage.includes('privacy')) {
            this.initPrivacyPage();
        }

        // Инициализация для страницы условий
        if (this.currentPage.includes('terms')) {
            this.initTermsPage();
        }

        // Всегда инициализируем навигацию
        if (typeof NavigationManager !== 'undefined') {
            new NavigationManager();
        }

        // Всегда инициализируем формы
        if (typeof ContactForm !== 'undefined') {
            const contactForm = new ContactForm('contact-form');
        }

        // Всегда инициализируем кастомный селект
        if (typeof CustomSelect !== 'undefined') {
            const customSelect = new CustomSelect('custom-select-container');
        }

        // Показываем баннер cookies если нужно
        if (typeof CookieManager !== 'undefined') {
            const cookieManager = new CookieManager();
        }
    }

    initCookiePage() {
        const openCookieSettings = document.getElementById('open-cookie-settings');
        const cookieModal = document.getElementById('cookie-modal');
        const modalClose = document.getElementById('modal-close');

        if (openCookieSettings && cookieModal) {
            openCookieSettings.addEventListener('click', () => {
                cookieModal.style.display = 'flex';
            });

            modalClose.addEventListener('click', () => {
                cookieModal.style.display = 'none';
            });

            cookieModal.addEventListener('click', (e) => {
                if (e.target === cookieModal) {
                    cookieModal.style.display = 'none';
                }
            });

            // Инициализируем CookieManager если он еще не был инициализирован
            if (typeof CookieManager !== 'undefined') {
                new CookieManager();
            }
        }
    }

    initPrivacyPage() {
        // Инициализация для страницы политики конфиденциальности
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        // Smooth scroll для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initTermsPage() {
        // Инициализация для страницы условий (аналогично privacy)
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        // Smooth scroll для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    updateMetaTags(url) {
        // Обновляем title страницы
        const newTitle = document.querySelector('main h1')?.textContent || 'Media Sync Bot';
        document.title = newTitle + (newTitle.includes('Media Sync Bot') ? '' : ' - Media Sync Bot');

        // Обновляем canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = window.location.origin + '/' + url;

        // Обновляем Open Graph мета-теги
        this.updateOpenGraphTags(url);
    }

    updateOpenGraphTags(url) {
        const title = document.querySelector('main h1')?.textContent || 'Media Sync Bot';
        const description = document.querySelector('main .page-subtitle')?.textContent ||
            document.querySelector('main .section-header p')?.textContent ||
            'Синхронизация медиа между Discord и Telegram';

        // Open Graph теги
        const ogTags = {
            'og:title': title,
            'og:description': description,
            'og:url': window.location.href,
            'og:type': 'website',
            'og:site_name': 'Media Sync Bot'
        };

        // Twitter теги
        const twitterTags = {
            'twitter:card': 'summary',
            'twitter:title': title,
            'twitter:description': description
        };

        // Обновляем существующие теги или создаем новые
        Object.entries({ ...ogTags, ...twitterTags }).forEach(([property, content]) => {
            let tag = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                if (property.startsWith('og:')) {
                    tag.setAttribute('property', property);
                } else {
                    tag.setAttribute('name', property);
                }
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        });
    }

    updateActiveLink(url) {
        // Убираем .html если есть
        const pageName = url.replace('.html', '');

        // Обновляем активный класс у ссылок навигации
        document.querySelectorAll('nav a, .nav-links a').forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref) {
                const linkPage = linkHref.replace('.html', '').replace('#', '');

                link.classList.remove('active');
                if (linkPage === pageName ||
                    (pageName === 'index' && linkHref === '#home') ||
                    (linkHref === url)) {
                    link.classList.add('active');
                }
            }
        });
    }

    showLoader() {
        let loader = document.getElementById('ajax-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'ajax-loader';
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: var(--gradient-1);
                z-index: 9999;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(loader);
        }

        loader.style.transform = 'translateX(-70%)';

        // Через 100ms запускаем анимацию
        setTimeout(() => {
            loader.style.transition = 'transform 10s linear';
            loader.style.transform = 'translateX(0%)';
        }, 100);
    }

    hideLoader() {
        const loader = document.getElementById('ajax-loader');
        if (loader) {
            loader.style.transition = 'transform 0.3s ease';
            loader.style.transform = 'translateX(0%)';

            setTimeout(() => {
                loader.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                }, 300);
            }, 100);
        }
    }

    showError(url) {
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.innerHTML = `
                <div class="error-page">
                    <div class="container">
                        <div class="error-content">
                            <div class="error-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <h2>Ошибка загрузки страницы</h2>
                            <p>Не удалось загрузить страницу: ${url}</p>
                            <div class="error-actions">
                                <button class="btn btn-primary" id="retry-load">Попробовать снова</button>
                                <a href="index.html" class="btn btn-secondary">На главную</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('retry-load').addEventListener('click', () => {
                this.loadPage(url);
            });
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.AjaxNavigation = new AjaxNavigation();
});
