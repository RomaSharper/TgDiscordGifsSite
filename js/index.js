class MediaSyncBot {
    constructor() {
        this.isDemoPlaying = false;
        this.demoTime = 0;
        this.totalDemoTime = 90;
        this.demoFrame = null;
        this.init();
    }

    init() {
        this.initLoadingScreen();
        this.initNavigation();
        this.initSmoothScroll();
        this.initScrollTop();
        this.initFAQ();
        this.initFormatters();

        window.addEventListener('DOMContentLoaded', () => {
            this.initAnimations();
            this.initVideoDemo();
            this.initFileUpload();
            this.initCounters();
            this.initParallax();
            this.initParticleEffects();
        });
    }

    initLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressFill = document.querySelector('.progress-fill');

        if (!loadingScreen || !progressFill) return;

        // Анимация иконки
        const logoIcon = loadingScreen.querySelector('.logo-icon');
        logoIcon.style.animation = 'float 3s ease-in-out infinite';

        let progress = 0;
        const targetProgress = 100;

        const animateProgress = () => {
            progress += Math.random() * 8 + 7;
            if (progress > targetProgress) progress = targetProgress;

            progressFill.style.width = `${progress}%`;

            // Плавное изменение цвета
            const hue = 180 + (progress / 100) * 60;
            progressFill.style.background = `hsl(${hue}, 100%, 60%)`;

            if (progress < targetProgress) {
                setTimeout(animateProgress, 80);
            } else {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 300);
            }
        };

        setTimeout(animateProgress, 800);
    }

    initNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        navToggle?.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Анимация иконки бургера
            const icon = navToggle.querySelector('i');
            if (navToggle.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
            });
        });

        // Active link highlighting
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
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

    initScrollTop() {
        const scrollTopBtn = document.getElementById('scroll-top');

        window.addEventListener('scroll', () => {
            if (scrollTopBtn) {
                if (window.scrollY > 300) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            }
        });

        scrollTopBtn?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Добавляем эффект нажатия
            scrollTopBtn.classList.add('pulse');
            setTimeout(() => scrollTopBtn.classList.remove('pulse'), 300);
        });
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => {
                // Закрываем другие открытые аккордеоны
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Открываем/закрываем текущий с анимацией
                const wasActive = item.classList.contains('active');
                item.classList.toggle('active');

                // Анимация иконки
                const icon = question.querySelector('i');
                if (!wasActive) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    initFormatters() {
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        const formatBtns = document.querySelectorAll('.format-btn');

        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', () => {
                const length = messageTextarea.value.length;
                charCount.textContent = length;

                // Плавное изменение цвета
                if (length > 1900) {
                    charCount.style.color = '#ff4757';
                } else if (length > 1500) {
                    charCount.style.color = '#ffa502';
                } else {
                    charCount.style.color = '#a0a0c0';
                }
            });

            messageTextarea.addEventListener('focus', () => {
                messageTextarea.style.transform = 'translateY(-2px)';
                messageTextarea.style.boxShadow = '0 10px 30px rgba(0, 217, 255, 0.2)';
            });

            messageTextarea.addEventListener('blur', () => {
                messageTextarea.style.transform = 'translateY(0)';
                messageTextarea.style.boxShadow = 'none';
            });
        }

        formatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.getAttribute('data-format');
                const textarea = document.getElementById('message');
                if (!textarea) return;

                // Эффект нажатия
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 300);

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = textarea.value.substring(start, end);

                let formattedText = '';
                switch (format) {
                    case 'bold':
                        formattedText = `**${selectedText}**`;
                        break;
                    case 'italic':
                        formattedText = `*${selectedText}*`;
                        break;
                    case 'code':
                        formattedText = `\`${selectedText}\``;
                        break;
                }

                textarea.value = textarea.value.substring(0, start) +
                    formattedText +
                    textarea.value.substring(end);
                textarea.focus();
                textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);

                // Trigger input event for char count
                textarea.dispatchEvent(new Event('input'));
            });
        });
    }

    initAnimations() {
        // Используем Intersection Observer с настройками как на android.tv
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Используем CSS класс для плавной анимации
                    entry.target.classList.add('show');

                    // Для статистики - отдельная логика
                    if (entry.target.classList.contains('stat-card')) {
                        const number = entry.target.querySelector('.stat-value');
                        if (number) {
                            const target = parseInt(number.textContent);
                            this.animateNumber(number, target, 2000);
                        }
                    }

                    // После показа, отключаем наблюдение
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдаем за всеми элементами, которые должны появляться
        const elementsToAnimate = document.querySelectorAll(
            '.feature-card, .step, .stat-card, .contact-card, .faq-item'
        );

        elementsToAnimate.forEach(element => {
            // Вместо inline стилей, добавляем CSS класс
            element.classList.add('scroll-animate');

            // Добавляем индексы для задержек
            if (element.classList.contains('feature-card')) {
                const index = Array.from(elementsToAnimate).indexOf(element);
                element.style.setProperty('--animation-delay', `${index * 0.1}s`);
            }

            if (element.classList.contains('step')) {
                const index = Array.from(elementsToAnimate).indexOf(element);
                element.style.setProperty('--animation-delay', `${index * 0.15}s`);
            }

            observer.observe(element);
        });

        // Сохраняем hover эффекты для feature-card
        document.querySelectorAll('.feature-card').forEach(card => {
            // Hover эффект
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('scroll-animate')) return;
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('scroll-animate')) return;
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Инициализируем элементы, которые уже в поле зрения
        this.initVisibleElements();
    }

    // Новый метод для инициализации видимых элементов
    initVisibleElements() {
        const elements = document.querySelectorAll('.scroll-animate');

        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = (
                rect.top <= (window.innerHeight * 0.85) &&
                rect.bottom >= 0
            );

            if (isVisible) {
                element.classList.add('show');

                // Анимация чисел для статистики
                if (element.classList.contains('stat-card')) {
                    const number = element.querySelector('.stat-value');
                    if (number) {
                        const target = parseInt(number.textContent);
                        this.animateNumber(number, target, 2000);
                    }
                }
            }
        });
    }

    // Обновляем метод animateNumber для предотвращения сбоев
    animateNumber(element, target, duration) {
        // Проверяем, что элемент существует и не анимируется
        if (!element || element.dataset.animating === 'true') return;

        element.dataset.animating = 'true';

        let start = 0;
        const increment = target / (duration / 16);

        const update = () => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                element.dataset.animating = 'false';
            } else {
                element.textContent = Math.floor(start);
                requestAnimationFrame(update);
            }
        };

        // Задержка для плавного старта
        setTimeout(() => requestAnimationFrame(update), 500);
    }

    initCounters() {
        // Animate footer stats
        const stats = [
            { element: document.querySelector('.footer-stats .stat:first-child .stat-value'), target: 99.9 },
            { element: document.querySelector('.footer-stats .stat:last-child .stat-value'), target: 0.2 }
        ];

        stats.forEach(stat => {
            if (stat.element) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        this.animateNumber(stat.element, stat.target, 1500);
                        observer.disconnect();
                    }
                }, { threshold: 0.5 });

                observer.observe(stat.element.parentElement);
            }
        });
    }

    initVideoDemo() {
        const playBtn = document.getElementById('play-btn');
        const progress = document.getElementById('progress');
        const timeDisplay = document.getElementById('time-display');
        const scenes = ['scene1', 'scene2', 'scene3'];
        const sceneElements = scenes.map(id => document.getElementById(id));

        if (!playBtn || !progress) return;

        // Инициализация сцен
        sceneElements.forEach((scene, index) => {
            if (scene) {
                scene.style.opacity = index === 0 ? '1' : '0';
                scene.style.transform = index === 0 ? 'translateY(0)' : 'translateY(20px)';
            }
        });

        const updateDisplay = () => {
            const progressPercent = (this.demoTime / this.totalDemoTime) * 100;
            progress.style.width = `${progressPercent}%`;

            // Плавное изменение цвета прогресса
            const hue = 180 + (progressPercent / 100) * 120;
            progress.style.background = `linear-gradient(90deg, hsl(${hue}, 100%, 60%), #8338ec)`;

            const minutes = Math.floor(this.demoTime / 60);
            const seconds = Math.floor(this.demoTime % 60);
            const totalMinutes = Math.floor(this.totalDemoTime / 60);
            const totalSeconds = Math.floor(this.totalDemoTime % 60);

            timeDisplay.textContent =
                `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

            // Анимация переключения сцен
            sceneElements.forEach((scene, index) => {
                if (scene) {
                    const sceneStart = index * 30;
                    const sceneEnd = (index + 1) * 30;

                    if (this.demoTime >= sceneStart && this.demoTime < sceneEnd) {
                        scene.style.opacity = '1';
                        scene.style.transform = 'translateY(0)';
                    } else {
                        scene.style.opacity = '0';
                        scene.style.transform = 'translateY(20px)';
                    }
                }
            });
        };

        const playAnimation = () => {
            if (!this.isDemoPlaying) return;

            this.demoTime += 0.5;

            if (this.demoTime >= this.totalDemoTime) {
                this.demoTime = this.totalDemoTime;
                this.isDemoPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.classList.remove('playing');
                cancelAnimationFrame(this.demoFrame);
            }

            updateDisplay();

            if (this.isDemoPlaying) {
                this.demoFrame = requestAnimationFrame(playAnimation);
            }
        };

        playBtn.addEventListener('click', () => {
            this.isDemoPlaying = !this.isDemoPlaying;

            // Анимация кнопки
            if (this.isDemoPlaying) {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.classList.add('playing');
                if (this.demoTime >= this.totalDemoTime) {
                    this.demoTime = 0;
                }
                this.demoFrame = requestAnimationFrame(playAnimation);
            } else {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.classList.remove('playing');
                cancelAnimationFrame(this.demoFrame);
            }
        });

        // Клик по таймлайну
        const timeline = document.getElementById('timeline');
        if (timeline) {
            timeline.addEventListener('click', (e) => {
                const rect = timeline.getBoundingClientRect();
                const clickPosition = e.clientX - rect.left;
                const width = rect.width;
                const percentage = Math.max(0, Math.min(1, clickPosition / width));

                this.demoTime = percentage * this.totalDemoTime;
                updateDisplay();

                // Эффект клика
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = clickPosition + 'px';
                timeline.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);

                // Если было воспроизведение, продолжаем
                if (this.isDemoPlaying) {
                    cancelAnimationFrame(this.demoFrame);
                    this.demoFrame = requestAnimationFrame(playAnimation);
                }
            });
        }

        // Автозапуск при скролле
        const howItWorksSection = document.getElementById('how-it-works');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isDemoPlaying && this.demoTime === 0) {
                    // Автоматически запускаем демо при попадании в зону видимости
                    setTimeout(() => {
                        this.isDemoPlaying = true;
                        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        playBtn.classList.add('playing');
                        this.demoFrame = requestAnimationFrame(playAnimation);
                    }, 1000);
                }
            });
        }, { threshold: 0.5 });

        if (howItWorksSection) {
            sectionObserver.observe(howItWorksSection);
        }
    }

    initFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const attachmentsInput = document.getElementById('attachments');
        const uploadPreview = document.getElementById('upload-preview');

        if (!uploadArea || !attachmentsInput || !uploadPreview) return;

        // Hover эффекты
        uploadArea.addEventListener('mouseenter', () => {
            uploadArea.style.transform = 'translateY(-2px)';
        });

        uploadArea.addEventListener('mouseleave', () => {
            uploadArea.style.transform = 'translateY(0)';
        });

        uploadArea.addEventListener('click', () => {
            attachmentsInput.click();
            // Эффект нажатия
            uploadArea.classList.add('pulse');
            setTimeout(() => uploadArea.classList.remove('pulse'), 300);
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            uploadArea.classList.add('success');
            setTimeout(() => uploadArea.classList.remove('success'), 1000);

            if (e.dataTransfer.files.length) {
                attachmentsInput.files = e.dataTransfer.files;
                this.handleFiles(attachmentsInput.files);
            }
        });

        attachmentsInput.addEventListener('change', () => {
            uploadArea.classList.add('success');
            setTimeout(() => uploadArea.classList.remove('success'), 1000);
            this.handleFiles(attachmentsInput.files);
        });
    }

    handleFiles(files) {
        const uploadPreview = document.getElementById('upload-preview');
        if (!uploadPreview) return;

        uploadPreview.innerHTML = '';

        Array.from(files).slice(0, 5).forEach((file, index) => {
            if (file.size > 10 * 1024 * 1024) {
                this.showToast(`Файл "${file.name}" превышает максимальный размер 10MB`, 'error');
                return;
            }

            const filePreview = document.createElement('div');
            filePreview.className = 'file-preview';
            filePreview.style.animation = `slideIn 0.3s ease ${index * 0.1}s both`;

            let icon = 'fa-file';
            if (file.type.startsWith('image/')) {
                icon = 'fa-image';
            } else if (file.type === 'application/pdf') {
                icon = 'fa-file-pdf';
            } else if (file.type === 'text/plain') {
                icon = 'fa-file-alt';
            }

            filePreview.innerHTML = `
                <i class="fas ${icon}"></i>
                <span class="file-name">${this.escapeHtml(file.name)}</span>
                <span class="file-size">(${this.formatFileSize(file.size)})</span>
                <button type="button" class="remove-file" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            uploadPreview.appendChild(filePreview);

            // Remove file button with animation
            filePreview.querySelector('.remove-file').addEventListener('click', () => {
                filePreview.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    filePreview.remove();
                    const dt = new DataTransfer();
                    Array.from(attachmentsInput.files).forEach((f, i) => {
                        if (i !== index) {
                            dt.items.add(f);
                        }
                    });
                    attachmentsInput.files = dt.files;
                }, 300);
            });
        });
    }

    initParallax() {
        const orbs = document.querySelectorAll('.orb');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            orbs.forEach((orb, index) => {
                const speed = 0.2 + (index * 0.1);
                const yPos = -(scrolled * speed);
                orb.style.transform = `translateY(${yPos}px) scale(${1 + (scrolled * 0.0001)})`;
            });
        });
    }

    initParticleEffects() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Создаем частицы только для hero секции
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Случайные параметры
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(0, 217, 255, ${Math.random() * 0.3});
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                animation: floatParticle ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
                z-index: -1;
            `;

            heroSection.appendChild(particle);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Показываем
        setTimeout(() => toast.classList.add('show'), 10);

        // Убираем через 3 секунды
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Создаем mailto ссылку
    createMailtoLink(data) {
        const subject = `Сообщение с Media Sync Bot: ${data.subject || 'Без темы'}`;
        const body = `
Имя: ${data.name}
Email: ${data.email}
Тема: ${data.subject}
Дата: ${new Date().toLocaleString('ru-RU')}

Сообщение:
${data.message}

---
Отправлено с сайта Media Sync Bot
    `.trim();

        return `mailto:${data.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // Метод для валидации формы
    validateForm(form) {
        let isValid = true;

        // Проверка имени
        const name = form.querySelector('#name');
        if (!name.value.trim()) {
            this.markFieldError(name, 'Введите ваше имя');
            isValid = false;
        }

        // Проверка email
        const email = form.querySelector('#email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            this.markFieldError(email, 'Введите корректный email');
            isValid = false;
        }

        // Проверка темы
        if (!this.getSelectedSubject()) {
            this.showFormMessage('Пожалуйста, выберите тему сообщения!', 'error');
            isValid = false;
        }

        // Проверка сообщения
        const message = form.querySelector('#message');
        if (!message.value.trim() || message.value.length < 10) {
            this.markFieldError(message, 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        }

        return isValid;
    }

    // Метод для получения выбранной темы
    getSelectedSubject() {
        if (window.CustomSelect) {
            const values = window.CustomSelect.getSelectedValues();
            return values.length > 0 ? values[0] : null;
        }
        return null;
    }

    // Метод для показа сообщения формы
    showFormMessage(message, type = 'info') {
        const formMessage = document.getElementById('form-message');
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        // Автоскрытие через 5 секунд
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Метод для маркировки ошибок полей
    markFieldError(field, message) {
        field.style.borderColor = '#ff4757';
        field.style.boxShadow = '0 0 0 2px rgba(255, 71, 87, 0.1)';

        // Убираем ошибку при фокусе
        field.addEventListener('focus', () => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }, { once: true });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const app = new MediaSyncBot();
    window.MediaSyncBot = app;
});
