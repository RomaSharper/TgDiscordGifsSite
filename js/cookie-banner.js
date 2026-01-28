// js/cookie-banner.js - Cookie consent banner
class CookieBanner {
    constructor() {
        this.bannerId = 'cookie-consent-banner';
        this.storageKey = 'cookie_consent_given';
        this.init();
    }

    init() {
        // Проверяем, дал ли пользователь согласие
        const consentGiven = localStorage.getItem(this.storageKey);

        if (!consentGiven) {
            this.showBanner();
        }

        // Слушаем события от CookieManager
        document.addEventListener('cookieConsentGiven', () => {
            this.hideBanner();
            localStorage.setItem(this.storageKey, 'true');
        });
    }

    showBanner() {
        // Проверяем, нет ли уже баннера
        if (document.getElementById(this.bannerId)) return;

        const banner = document.createElement('div');
        banner.id = this.bannerId;
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <i class="fas fa-cookie-bite"></i>
                    <div>
                        <p><strong>Мы используем файлы cookie</strong></p>
                        <p>Этот сайт использует файлы cookie для улучшения работы. Некоторые cookie необходимы для работы сайта, другие помогают нам анализировать трафик.</p>
                    </div>
                </div>
                <div class="cookie-banner-actions">
                    <a href="cookies.html" class="cookie-link" target="_blank">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </a>
                    <button class="btn btn-primary cookie-accept">
                        <i class="fas fa-check"></i> Понятно
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Показываем с анимацией
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);

        // Обработчики событий
        const acceptBtn = banner.querySelector('.cookie-accept');
        const infoLink = banner.querySelector('.cookie-link');

        acceptBtn.addEventListener('click', () => this.handleAccept());

        infoLink.addEventListener('click', (e) => {
            e.preventDefault();
            const url = infoLink.getAttribute('href');
            if (window.AjaxNavigation) {
                window.AjaxNavigation.navigate(url);
            } else {
                window.open(url, '_blank');
            }
        });

        // Добавляем стили
        this.addStyles();
    }

    addStyles() {
        const styleId = 'cookie-banner-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                max-width: 500px;
                background: var(--bg-card);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 1.5rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .cookie-banner.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .cookie-banner-content {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .cookie-banner-text {
                display: flex;
                gap: 1rem;
                align-items: flex-start;
            }
            
            .cookie-banner-text i {
                font-size: 1.5rem;
                color: var(--primary);
                margin-top: 0.2rem;
            }
            
            .cookie-banner-text p {
                margin: 0;
                color: var(--text-dim);
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            .cookie-banner-text p strong {
                color: var(--text);
                font-weight: 600;
                display: block;
                margin-bottom: 0.3rem;
            }
            
            .cookie-banner-actions {
                display: flex;
                gap: 1rem;
                align-items: center;
                justify-content: flex-end;
            }
            
            .cookie-link {
                color: var(--text-dim);
                text-decoration: none;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s;
            }
            
            .cookie-link:hover {
                color: var(--primary);
            }
            
            .cookie-accept {
                padding: 0.6rem 1.5rem;
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                .cookie-banner {
                    left: 10px;
                    right: 10px;
                    bottom: 10px;
                    padding: 1.2rem;
                }
                
                .cookie-banner-text {
                    flex-direction: column;
                    text-align: center;
                }
                
                .cookie-banner-actions {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .cookie-link, .cookie-accept {
                    text-align: center;
                    justify-content: center;
                }
            }
        `;

        document.head.appendChild(style);
    }

    handleAccept() {
        // Сохраняем согласие
        localStorage.setItem(this.storageKey, 'true');

        // Скрываем баннер
        this.hideBanner();

        // Триггерим событие
        const event = new CustomEvent('cookieConsentGiven', {
            detail: { timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(event);

        // Сохраняем настройки в CookieManager если он существует
        if (window.CookieManager) {
            window.CookieManager.setSettings({
                necessary: true,
                analytics: true,
                functional: true
            });
        }
    }

    hideBanner() {
        const banner = document.getElementById(this.bannerId);
        if (banner) {
            banner.classList.remove('show');

            // Удаляем через время анимации
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 500);
        }
    }

    // Публичные методы
    static show() {
        const instance = new CookieBanner();
        instance.showBanner();
    }

    static hide() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.remove();
        }
    }

    static reset() {
        localStorage.removeItem('cookie_consent_given');
        const instance = new CookieBanner();
        instance.showBanner();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CookieBanner();
});

window.CookieBanner = CookieBanner;
