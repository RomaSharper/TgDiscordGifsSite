// js/index.js - Упрощенная версия без JSON
class MediaSyncBot {
    constructor() {
        this.init();
    }

    init() {
        this.initLoadingScreen();
        this.initNavigation();
        this.initSmoothScroll();
        this.initScrollTop();
        this.initChatWidget();
        this.initFAQ();
        this.initFormatters();

        window.addEventListener('DOMContentLoaded', () => {
            this.initAnimations();
            this.initVideoDemo();
            this.initFileUpload();
        });
    }

    initLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressFill = document.querySelector('.progress-fill');

        if (!loadingScreen || !progressFill) return;

        let progress = 0;
        const targetProgress = 100;

        const animateProgress = () => {
            progress += Math.random() * 10 + 5;
            if (progress > targetProgress) progress = targetProgress;

            progressFill.style.width = `${progress}%`;

            if (progress < targetProgress) {
                setTimeout(animateProgress, 100);
            } else {
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
        };

        setTimeout(animateProgress, 500);
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
            navLinks.classList.toggle('active');
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
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
        });
    }

    initChatWidget() {
        const chatTrigger = document.getElementById('chat-trigger');
        const chatWidget = document.getElementById('chat-widget');
        const chatClose = document.getElementById('chat-close');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        if (!chatTrigger || !chatWidget) return;

        chatTrigger.addEventListener('click', () => {
            chatWidget.classList.toggle('active');
        });

        chatClose?.addEventListener('click', () => {
            chatWidget.classList.remove('active');
        });

        const botResponses = [
            "Отличный вопрос! Бот работает 24/7 и обрабатывает медиа в реальном времени.",
            "Для привязки Telegram используйте команду /connect_telegram в Discord.",
            "Бот поддерживает GIF, видео, изображения и даже Pinterest ссылки!",
            "Максимальный размер файла - 50MB. Большие файлы автоматически сжимаются.",
            "Да, бот полностью бесплатный! Никаких скрытых платежей.",
            "Обычно обработка занимает 1-5 секунд в зависимости от размера файла.",
            "Нет, ваши файлы не хранятся на серверах после обработки.",
            "Для начала добавьте бота в Discord и Telegram, затем привяжите аккаунты."
        ];

        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.innerHTML = `
                <div class="message-avatar">👤</div>
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(message)}</div>
                    <div class="message-time">Только что</div>
                </div>
            `;
            chatMessages.appendChild(userMessage);

            chatInput.value = '';

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Bot response
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.className = 'message bot';
                botMessage.innerHTML = `
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <div class="message-text">${botResponses[Math.floor(Math.random() * botResponses.length)]}</div>
                        <div class="message-time">Только что</div>
                    </div>
                `;
                chatMessages.appendChild(botMessage);

                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        };

        chatSend?.addEventListener('click', sendMessage);

        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => {
                item.classList.toggle('active');
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

                if (length > 1900) {
                    charCount.style.color = 'var(--error)';
                } else if (length > 1500) {
                    charCount.style.color = 'var(--secondary)';
                } else {
                    charCount.style.color = 'var(--text-dim)';
                }
            });

            messageTextarea.addEventListener('focus', () => {
                messageTextarea.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            });

            messageTextarea.addEventListener('blur', () => {
                messageTextarea.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            });
        }

        formatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.getAttribute('data-format');
                const textarea = document.getElementById('message');
                if (!textarea) return;

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
        // Animate stats on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-card, .feature-card, .step').forEach(el => {
            observer.observe(el);
        });
    }

    initVideoDemo() {
        const playBtn = document.querySelector('.play-btn');
        const progress = document.querySelector('.progress');
        const timeDisplay = document.querySelector('.time');

        if (!playBtn) return;

        let isPlaying = false;
        let currentTime = 0;
        const totalTime = 90; // 1:30 in seconds

        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.innerHTML = isPlaying ?
                '<i class="fas fa-pause"></i>' :
                '<i class="fas fa-play"></i>';

            if (isPlaying) {
                simulatePlayback();
            }
        });

        const simulatePlayback = () => {
            if (!isPlaying) return;

            if (currentTime < totalTime) {
                currentTime++;
                const progressPercent = (currentTime / totalTime) * 100;
                progress.style.width = `${progressPercent}%`;

                // Format time display
                const minutes = Math.floor(currentTime / 60);
                const seconds = currentTime % 60;
                const totalMinutes = Math.floor(totalTime / 60);
                const totalSeconds = totalTime % 60;

                timeDisplay.textContent =
                    `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

                // Switch scenes
                const scenes = document.querySelectorAll('.scene');
                scenes.forEach(scene => scene.classList.remove('active'));

                if (currentTime < 30) {
                    scenes[0]?.classList.add('active');
                } else if (currentTime < 60) {
                    scenes[1]?.classList.add('active');
                } else {
                    scenes[2]?.classList.add('active');
                }

                setTimeout(simulatePlayback, 1000 / 30); // 30fps
            } else {
                // Reset
                isPlaying = false;
                currentTime = 0;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                progress.style.width = '0%';
                timeDisplay.textContent = '0:00 / 1:30';

                const scenes = document.querySelectorAll('.scene');
                scenes.forEach(scene => scene.classList.remove('active'));
                scenes[0]?.classList.add('active');
            }
        };

        // Timeline click
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            timeline.addEventListener('click', (e) => {
                const rect = timeline.getBoundingClientRect();
                const clickPosition = e.clientX - rect.left;
                const width = rect.width;
                const percentage = clickPosition / width;

                currentTime = Math.floor(percentage * totalTime);
                const progressPercent = percentage * 100;
                progress.style.width = `${progressPercent}%`;

                // Update time display
                const minutes = Math.floor(currentTime / 60);
                const seconds = currentTime % 60;
                const totalMinutes = Math.floor(totalTime / 60);
                const totalSeconds = totalTime % 60;

                timeDisplay.textContent =
                    `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
            });
        }
    }

    initFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const attachmentsInput = document.getElementById('attachments');
        const uploadPreview = document.getElementById('upload-preview');

        if (!uploadArea || !attachmentsInput || !uploadPreview) return;

        uploadArea.addEventListener('click', () => {
            attachmentsInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
            uploadArea.style.background = 'rgba(0, 217, 255, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            uploadArea.style.background = 'rgba(255, 255, 255, 0.02)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            uploadArea.style.background = 'rgba(255, 255, 255, 0.02)';

            if (e.dataTransfer.files.length) {
                attachmentsInput.files = e.dataTransfer.files;
                handleFiles(attachmentsInput.files);
            }
        });

        attachmentsInput.addEventListener('change', () => {
            handleFiles(attachmentsInput.files);
        });

        const handleFiles = (files) => {
            uploadPreview.innerHTML = '';

            Array.from(files).slice(0, 5).forEach((file, index) => {
                if (file.size > 10 * 1024 * 1024) {
                    alert(`Файл "${file.name}" превышает максимальный размер 10MB`);
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const filePreview = document.createElement('div');
                    filePreview.className = 'file-preview';

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

                    // Remove file button
                    filePreview.querySelector('.remove-file').addEventListener('click', () => {
                        filePreview.remove();
                        // Create new FileList without the removed file
                        const dt = new DataTransfer();
                        Array.from(attachmentsInput.files).forEach((f, i) => {
                            if (i !== index) {
                                dt.items.add(f);
                            }
                        });
                        attachmentsInput.files = dt.files;
                    });
                };

                reader.readAsDataURL(file);
            });
        };
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
}

const app = new MediaSyncBot();
window.MediaSyncBot = app;
