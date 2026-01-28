class AdvancedContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.selectInstance = null;
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupEventListeners();
        this.setupCustomSelect();
        this.setupCharacterCounter();
        this.setupFormSubmit();
    }

    setupEventListeners() {
        // Валидация при вводе
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Анимация фокуса
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('focused');
            });
            field.addEventListener('blur', () => {
                field.parentElement.classList.remove('focused');
            });
        });
    }

    setupCustomSelect() {
        // Ждем инициализации селекта
        setTimeout(() => {
            if (window.CustomSelect) {
                this.selectInstance = window.CustomSelect;
                this.setupSelectValidation();
            }
        }, 100);
    }

    setupSelectValidation() {
        const selectContainer = document.querySelector('.custom-select');
        if (!selectContainer) return;

        // Проверяем выбор при открытии/закрытии
        const observer = new MutationObserver(() => {
            this.validateSelect();
        });

        observer.observe(selectContainer, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    setupCharacterCounter() {
        const textarea = document.getElementById('message');
        const counter = document.getElementById('char-count');

        if (!textarea || !counter) return;

        textarea.addEventListener('input', (e) => {
            const length = e.target.value.length;
            counter.textContent = length;

            // Градиентное изменение цвета
            if (length > 1900) {
                counter.style.color = '#ff4757';
                counter.style.fontWeight = 'bold';
            } else if (length > 1500) {
                counter.style.color = '#ffa502';
                counter.style.fontWeight = '600';
            } else {
                counter.style.color = '#a0a0c0';
                counter.style.fontWeight = 'normal';
            }
        });
    }

    setupFormSubmit() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.validateForm()) {
                this.showFormMessage('❌ Пожалуйста, исправьте ошибки в форме', 'error');
                return;
            }

            await this.submitForm();
        });
    }

    validateForm() {
        let isValid = true;

        // Проверяем все поля
        const fields = this.form.querySelectorAll('[required]');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Проверяем селект
        if (!this.validateSelect()) {
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id || field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Пожалуйста, введите ваше имя';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Имя должно содержать минимум 2 символа';
                    isValid = false;
                } else if (value.length > 50) {
                    errorMessage = 'Имя не должно превышать 50 символов';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'Пожалуйста, введите email';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Введите корректный email адрес (пример: name@example.com)';
                    isValid = false;
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Пожалуйста, введите сообщение';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Сообщение должно содержать минимум 10 символов';
                    isValid = false;
                } else if (value.length > 2000) {
                    errorMessage = 'Сообщение не должно превышать 2000 символов';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    validateSelect() {
        const selectContainer = document.querySelector('.custom-select');
        const placeholder = selectContainer?.querySelector('.select-placeholder');
        const isSelected = this.selectInstance?.getSelectedValues().length > 0;

        let isValid = true;

        if (!isSelected) {
            selectContainer?.classList.add('error');
            isValid = false;

            // Добавляем сообщение об ошибке если его нет
            if (!selectContainer?.querySelector('.select-error')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'select-error';
                errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Пожалуйста, выберите тему';
                selectContainer?.appendChild(errorDiv);
            }
        } else {
            selectContainer?.classList.remove('error');
            const errorDiv = selectContainer?.querySelector('.select-error');
            if (errorDiv) errorDiv.remove();
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        field.classList.add('error-field');

        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;

        formGroup.appendChild(errorDiv);

        // Анимация появления
        setTimeout(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    clearFieldError(field) {
        field.classList.remove('error-field');
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        const errorMessage = formGroup.querySelector('.field-error-message');
        if (errorMessage) {
            errorMessage.style.opacity = '0';
            errorMessage.style.transform = 'translateY(-5px)';
            setTimeout(() => errorMessage.remove(), 300);
        }
    }

    async submitForm() {
        // Получаем данные формы
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: this.selectInstance?.getSelectedValues()[0] || '',
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString(),
            source: 'Media Sync Bot Website'
        };

        // Показываем загрузку
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('#btn-text');
        const originalText = btnText.textContent;
        const originalIcon = submitBtn.querySelector('i').className;

        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        btnText.textContent = 'Отправка...';
        submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';

        try {
            // Отправляем данные через Telegram Bot (рекомендуется)
            await this.sendViaTelegramBot(formData);

            // Показываем успех
            this.showFormMessage('✅ Сообщение успешно отправлено! Мы ответим вам в течение 24 часов.', 'success');

            // Анимация успеха
            this.animateSuccess();

            // Сбрасываем форму
            this.resetForm();

        } catch (error) {
            console.error('Submit error:', error);

            // Fallback: отправка через mailto
            const fallbackSuccess = this.sendViaMailto(formData);

            if (fallbackSuccess) {
                this.showFormMessage('✅ Откройте ваш почтовый клиент для отправки сообщения.', 'info');
            } else {
                this.showFormMessage('❌ Ошибка отправки. Пожалуйста, напишите нам напрямую на roma.sharper@yandex.ru', 'error');
            }

        } finally {
            // Восстанавливаем кнопку
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            btnText.textContent = originalText;
            submitBtn.querySelector('i').className = originalIcon;
        }
    }

    async sendViaTelegramBot(formData) {
        // Отправка через Telegram Bot API (самый надежный способ)
        const botToken = 'YOUR_BOT_TOKEN'; // Замените на токен вашего бота
        const chatId = 'YOUR_CHAT_ID'; // Ваш chat_id в Telegram

        if (!botToken || !chatId) {
            throw new Error('Bot not configured');
        }

        const message = `
📬 *Новое сообщение с сайта Media Sync Bot*

*👤 Имя:* ${formData.name}
*📧 Email:* ${formData.email}
*🏷️ Тема:* ${formData.subject}
*⏰ Время:* ${new Date().toLocaleString('ru-RU')}

*📝 Сообщение:*
${formData.message}

*🌐 Источник:* ${formData.source}
        `.trim();

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });

        if (!response.ok) {
            throw new Error('Telegram API error');
        }

        return true;
    }

    sendViaMailto(formData) {
        try {
            const subject = `Media Sync Bot: ${formData.subject}`;
            const body = `
Имя: ${formData.name}
Email: ${formData.email}
Тема: ${formData.subject}
Дата: ${new Date().toLocaleString('ru-RU')}

Сообщение:
${formData.message}

---
Отправлено с сайта Media Sync Bot
            `.trim();

            const mailtoLink = `mailto:roma.sharper@yandex.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Открываем в новом окне
            const newWindow = window.open(mailtoLink, '_blank');

            // Если не открылось (некоторые браузеры блокируют)
            if (!newWindow || newWindow.closed) {
                // Показываем кнопку для ручного копирования
                this.showMailtoFallback(subject, body);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Mailto error:', error);
            return false;
        }
    }

    showMailtoFallback(subject, body) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'mailto-fallback';
        fallbackDiv.innerHTML = `
            <div class="fallback-content">
                <h4><i class="fas fa-envelope"></i> Скопируйте данные для отправки:</h4>
                <div class="fallback-data">
                    <div class="data-field">
                        <label>Email получателя:</label>
                        <input type="text" readonly value="roma.sharper@yandex.ru" class="copy-field">
                        <button class="copy-btn" data-text="roma.sharper@yandex.ru">
                            <i class="far fa-copy"></i>
                        </button>
                    </div>
                    <div class="data-field">
                        <label>Тема письма:</label>
                        <input type="text" readonly value="${subject}" class="copy-field">
                        <button class="copy-btn" data-text="${subject}">
                            <i class="far fa-copy"></i>
                        </button>
                    </div>
                    <div class="data-field">
                        <label>Текст письма:</label>
                        <textarea readonly class="copy-field">${body}</textarea>
                        <button class="copy-btn" data-text="${body}">
                            <i class="far fa-copy"></i>
                        </button>
                    </div>
                </div>
                <div class="fallback-buttons">
                    <button class="btn btn-secondary" id="close-fallback">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(fallbackDiv);

        // Копирование текста
        fallbackDiv.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.getAttribute('data-text');
                navigator.clipboard.writeText(text).then(() => {
                    const icon = btn.querySelector('i');
                    icon.className = 'fas fa-check';
                    setTimeout(() => {
                        icon.className = 'far fa-copy';
                    }, 2000);
                });
            });
        });

        // Закрытие
        fallbackDiv.querySelector('#close-fallback').addEventListener('click', () => {
            fallbackDiv.remove();
        });
    }

    animateSuccess() {
        const form = this.form;
        form.classList.add('success-animation');

        // Анимация полей
        form.querySelectorAll('input, textarea, .custom-select').forEach((field, index) => {
            field.style.transform = 'translateY(-5px)';
            field.style.boxShadow = '0 10px 30px rgba(0, 217, 255, 0.2)';

            setTimeout(() => {
                field.style.transform = '';
                field.style.boxShadow = '';
            }, 300 + (index * 100));
        });

        // Иконка успеха
        const successIcon = document.createElement('div');
        successIcon.className = 'success-icon';
        successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        form.appendChild(successIcon);

        setTimeout(() => successIcon.remove(), 2000);

        setTimeout(() => {
            form.classList.remove('success-animation');
        }, 1000);
    }

    resetForm() {
        // Сбрасываем поля
        this.form.reset();

        // Сбрасываем селект
        if (this.selectInstance) {
            this.selectInstance.clear();
        }

        // Сбрасываем счетчик
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#a0a0c0';
            charCount.style.fontWeight = 'normal';
        }

        // Очищаем ошибки
        this.form.querySelectorAll('.field-error-message, .select-error').forEach(el => el.remove());
        this.form.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
        document.querySelector('.custom-select')?.classList.remove('error');
    }

    showFormMessage(message, type = 'info') {
        const messageElement = document.getElementById('form-message');
        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';

        // Анимация появления
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);

        // Автоскрытие через 7 секунд
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 300);
        }, 7000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new AdvancedContactForm();
    window.AdvancedContactForm = contactForm;
});
