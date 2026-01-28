// js/form.js - Form handling
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.init();
    }

    init() {
        this.bindEvents();
        this.initCharCounter();
        this.initFileUpload();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    initCharCounter() {
        const textarea = this.form.querySelector('#message');
        const counter = this.form.querySelector('#char-count');

        if (textarea && counter) {
            textarea.addEventListener('input', () => {
                const length = textarea.value.length;
                counter.textContent = length;

                // Update color based on length
                if (length > 1900) {
                    counter.style.color = 'var(--error)';
                } else if (length > 1500) {
                    counter.style.color = 'var(--secondary)';
                } else {
                    counter.style.color = 'var(--text-dim)';
                }

                // Validate length
                if (length > 2000) {
                    textarea.value = textarea.value.substring(0, 2000);
                    counter.textContent = 2000;
                }
            });

            // Initial count
            counter.textContent = textarea.value.length;
        }
    }

    initFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('attachments');
        const preview = document.getElementById('upload-preview');

        if (!uploadArea || !fileInput || !preview) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
            uploadArea.style.background = 'rgba(0, 217, 255, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';

            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                this.handleFiles(fileInput.files);
            }
        });

        // File input change
        fileInput.addEventListener('change', () => {
            this.handleFiles(fileInput.files);
        });
    }

    handleFiles(files) {
        const preview = document.getElementById('upload-preview');
        if (!preview) return;

        preview.innerHTML = '';

        Array.from(files).slice(0, 5).forEach((file, index) => {
            if (file.size > 10 * 1024 * 1024) {
                this.showMessage(`Файл "${file.name}" превышает максимальный размер 10MB`, 'error');
                return;
            }

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

            preview.appendChild(filePreview);

            // Remove file button
            filePreview.querySelector('.remove-file').addEventListener('click', () => {
                this.removeFile(index);
            });
        });
    }

    removeFile(index) {
        const fileInput = document.getElementById('attachments');
        const preview = document.getElementById('upload-preview');

        if (!fileInput || !preview) return;

        // Create new FileList without the removed file
        const dt = new DataTransfer();
        Array.from(fileInput.files).forEach((file, i) => {
            if (i !== index) {
                dt.items.add(file);
            }
        });

        fileInput.files = dt.files;

        // Remove preview
        const previews = preview.querySelectorAll('.file-preview');
        if (previews[index]) {
            previews[index].remove();
        }
    }

    validateField(field) {
        // Clear previous errors
        this.clearFieldError(field);

        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            }
        }

        // Max length validation
        if (field.hasAttribute('maxlength')) {
            const maxLength = parseInt(field.getAttribute('maxlength'));
            if (field.value.length > maxLength) {
                isValid = false;
                errorMessage = `Максимальная длина: ${maxLength} символов`;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        // Add error class
        field.classList.add('error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.3rem';

        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');

        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm() {
        let isValid = true;

        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Пожалуйста, заполните все обязательные поля корректно', 'error');
            return;
        }

        // Show loading state
        this.setLoading(true);

        try {
            // Prepare form data
            const formData = new FormData(this.form);

            // Add bot-specific data
            formData.append('bot_name', 'Media Sync Bot');
            formData.append('timestamp', new Date().toISOString());
            formData.append('user_agent', navigator.userAgent);

            // In a real application, you would send this to your backend
            // For now, we'll simulate a successful submission

            // Simulate API call
            await this.simulateApiCall(formData);

            // Show success message
            this.showMessage('Сообщение успешно отправлено! Мы ответим вам в течение 24 часов.', 'success');

            // Reset form
            this.form.reset();

            // Reset custom select if it exists
            if (window.CustomSelect) {
                window.CustomSelect.clear();
            }

            // Clear file preview
            const preview = document.getElementById('upload-preview');
            if (preview) {
                preview.innerHTML = '';
            }

            // Reset char counter
            const counter = document.getElementById('char-count');
            if (counter) {
                counter.textContent = '0';
                counter.style.color = 'var(--text-dim)';
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.', 'error');
        } finally {
            // Hide loading state
            this.setLoading(false);
        }
    }

    simulateApiCall(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                const isSuccess = Math.random() > 0.1; // 90% success rate

                if (isSuccess) {
                    resolve({
                        success: true,
                        message: 'Сообщение отправлено'
                    });
                } else {
                    reject(new Error('Ошибка сервера'));
                }
            }, 1500);
        });
    }

    setLoading(isLoading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('#btn-text');
        const btnLoader = submitBtn.querySelector('#btn-loader');
        const btnIcon = submitBtn.querySelector('#btn-icon');

        if (isLoading) {
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-block';
            if (btnIcon) btnIcon.style.display = 'none';
        } else {
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
            if (btnIcon) btnIcon.style.display = 'inline-block';
        }
    }

    showMessage(message, type = 'info') {
        const messageElement = document.getElementById('form-message');
        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
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

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = new ContactForm('contact-form');

    // Format buttons for text editor
    const formatBtns = document.querySelectorAll('.format-btn');
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

            // Focus and place cursor after formatted text
            textarea.focus();
            textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);

            // Trigger input event for char counter
            textarea.dispatchEvent(new Event('input'));
        });
    });
});
