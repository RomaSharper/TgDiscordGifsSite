class CookieManager {
    constructor() {
        this.cookieName = 'cookie_consent';
        this.cookieSettings = {
            necessary: true,
            analytics: true,
            functional: true
        };

        this.init();
    }

    init() {
        this.loadSettings();
        this.setupConsentBanner();
        this.bindEvents();
    }

    loadSettings() {
        const savedConsent = this.getCookie(this.cookieName);

        if (savedConsent) {
            try {
                this.cookieSettings = JSON.parse(savedConsent);
            } catch (e) {
                console.warn('Could not parse cookie settings:', e);
            }
        }
    }

    saveSettings() {
        const settingsJSON = JSON.stringify(this.cookieSettings);
        this.setCookie(this.cookieName, settingsJSON, 365);

        // Update cookie usage based on settings
        this.updateCookieUsage();
    }

    setupConsentBanner() {
        // Only show banner if no consent is saved
        if (!this.getCookie(this.cookieName)) {
            setTimeout(() => {
                this.showConsentBanner();
            }, 1000);
        }
    }

    showConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    bindEvents() {
        // Accept all cookies
        const acceptAllBtn = document.getElementById('accept-all-cookies');
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => {
                this.cookieSettings = {
                    necessary: true,
                    analytics: true,
                    functional: true
                };
                this.saveSettings();
                this.hideConsentBanner();
                this.showConfirmation('Все cookies приняты');
            });
        }

        // Reject non-essential cookies
        const rejectBtn = document.getElementById('reject-cookies');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                this.cookieSettings = {
                    necessary: true,
                    analytics: false,
                    functional: false
                };
                this.saveSettings();
                this.hideConsentBanner();
                this.showConfirmation('Только необходимые cookies приняты');
            });
        }

        // Open settings
        const settingsBtn = document.getElementById('settings-cookies');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.openSettingsModal();
            });
        }

        // Modal events
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeSettingsModal();
            });
        }

        const saveSettingsBtn = document.getElementById('save-cookie-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettingsFromModal();
            });
        }

        const acceptAllModal = document.getElementById('accept-all-modal');
        if (acceptAllModal) {
            acceptAllModal.addEventListener('click', () => {
                this.cookieSettings = {
                    necessary: true,
                    analytics: true,
                    functional: true
                };
                this.saveSettingsFromModal();
            });
        }
    }

    openSettingsModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.style.display = 'flex';

            // Set current values
            const analyticsCheckbox = document.getElementById('analytics-cookies');
            const functionalCheckbox = document.getElementById('functional-cookies');

            if (analyticsCheckbox) {
                analyticsCheckbox.checked = this.cookieSettings.analytics;
            }

            if (functionalCheckbox) {
                functionalCheckbox.checked = this.cookieSettings.functional;
            }
        }
    }

    closeSettingsModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    saveSettingsFromModal() {
        const analyticsCheckbox = document.getElementById('analytics-cookies');
        const functionalCheckbox = document.getElementById('functional-cookies');

        this.cookieSettings.analytics = analyticsCheckbox ? analyticsCheckbox.checked : false;
        this.cookieSettings.functional = functionalCheckbox ? functionalCheckbox.checked : false;

        this.saveSettings();
        this.closeSettingsModal();
        this.hideConsentBanner();
        this.showConfirmation('Настройки cookies сохранены');
    }

    updateCookieUsage() {
        // Update Google Analytics based on analytics setting
        if (window.gtag && typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'analytics_storage': this.cookieSettings.analytics ? 'granted' : 'denied'
            });
        }

        // You can add more cookie-related updates here
    }

    setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Strict';
    }

    getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    }

    showConfirmation(message) {
        // Create and show a confirmation toast
        const toast = document.createElement('div');
        toast.className = 'cookie-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-card);
            color: var(--text);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--primary);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);

        // Add CSS for animations if not already present
        if (!document.querySelector('#cookie-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'cookie-toast-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Public API
    static getSettings() {
        const manager = new CookieManager();
        return manager.cookieSettings;
    }

    static setSettings(settings) {
        const manager = new CookieManager();
        Object.assign(manager.cookieSettings, settings);
        manager.saveSettings();
    }

    static resetConsent() {
        const manager = new CookieManager();
        manager.eraseCookie(manager.cookieName);
        manager.showConsentBanner();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    new CookieManager();
});

window.CookieManager = CookieManager;
