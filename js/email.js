// js/email.js - Email service integration
class EmailService {
    constructor() {
        this.apiEndpoint = 'https://api.emailservice.com/send';
        this.initialized = false;
    }

    init(config) {
        this.config = {
            ...config,
            // Default values
            fromEmail: 'noreply@mediasyncbot.com',
            fromName: 'Media Sync Bot'
        };
        this.initialized = true;
        console.log('Email service initialized');
    }

    async sendContactForm(data) {
        if (!this.initialized) {
            throw new Error('Email service not initialized');
        }

        const emailData = {
            to: this.config.contactEmail || 'support@mediasyncbot.com',
            subject: `Новое сообщение от ${data.name} - ${data.subject}`,
            template: 'contact-form',
            data: {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                attachments: data.attachments || [],
                timestamp: new Date().toLocaleString('ru-RU'),
                userAgent: navigator.userAgent,
                ip: await this.getClientIP()
            }
        };

        return this.sendEmail(emailData);
    }

    async sendSupportTicket(data) {
        const emailData = {
            to: this.config.supportEmail || 'support@mediasyncbot.com',
            subject: `Тикет поддержки #${this.generateTicketId()} - ${data.subject}`,
            template: 'support-ticket',
            data: {
                ...data,
                ticketId: this.generateTicketId(),
                priority: data.priority || 'normal',
                status: 'new',
                assignedTo: 'support_team'
            }
        };

        return this.sendEmail(emailData);
    }

    async sendNotification(to, subject, message, type = 'info') {
        const emailData = {
            to: to,
            subject: subject,
            template: 'notification',
            data: {
                message: message,
                type: type,
                timestamp: new Date().toISOString()
            }
        };

        return this.sendEmail(emailData);
    }

    async sendWelcomeEmail(email, name) {
        const emailData = {
            to: email,
            subject: 'Добро пожаловать в Media Sync Bot!',
            template: 'welcome',
            data: {
                name: name,
                discordBotLink: this.config.links?.discordBot || '#',
                telegramBotLink: this.config.links?.telegramBot || '#',
                documentationLink: this.config.links?.documentation || '#',
                supportLink: this.config.links?.support || '#'
            }
        };

        return this.sendEmail(emailData);
    }

    async sendNewsletter(emails, subject, content) {
        const results = [];

        for (const email of emails) {
            try {
                const emailData = {
                    to: email,
                    subject: subject,
                    template: 'newsletter',
                    data: {
                        content: content,
                        unsubscribeLink: `${this.config.baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`
                    }
                };

                const result = await this.sendEmail(emailData);
                results.push({ email, success: true, result });
            } catch (error) {
                results.push({ email, success: false, error: error.message });
            }
        }

        return results;
    }

    async sendEmail(emailData) {
        try {
            // In a real application, this would be an actual API call
            // For demo purposes, we'll simulate the API call

            console.log('Sending email:', emailData);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate API response
            const response = {
                success: true,
                messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString()
            };

            // Simulate 10% failure rate for demo
            if (Math.random() < 0.1) {
                throw new Error('SMTP server unavailable');
            }

            return response;

        } catch (error) {
            console.error('Email sending error:', error);
            throw error;
        }
    }

    async getClientIP() {
        try {
            // Try to get IP from free service
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.warn('Could not get client IP:', error);
            return 'unknown';
        }
    }

    generateTicketId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 6);
        return `TICKET-${timestamp}-${random}`.toUpperCase();
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    formatEmailTemplate(template, data) {
        // Simple template formatting
        let html = '';

        switch (template) {
            case 'contact-form':
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #00d9ff;">Новое сообщение с сайта Media Sync Bot</h2>
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                            <p><strong>Имя:</strong> ${data.name}</p>
                            <p><strong>Email:</strong> ${data.email}</p>
                            <p><strong>Тема:</strong> ${data.subject}</p>
                            <p><strong>Дата:</strong> ${data.timestamp}</p>
                            <p><strong>Сообщение:</strong></p>
                            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #00d9ff;">
                                ${data.message.replace(/\n/g, '<br>')}
                            </div>
                            ${data.attachments.length > 0 ? `<p><strong>Вложения:</strong> ${data.attachments.length} файл(ов)</p>` : ''}
                            <p><strong>User Agent:</strong> ${data.userAgent}</p>
                            <p><strong>IP:</strong> ${data.ip}</p>
                        </div>
                    </div>
                `;
                break;

            case 'welcome':
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #00d9ff 0%, #8338ec 100%); color: white; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0;">🎬 Добро пожаловать!</h1>
                        </div>
                        <div style="padding: 30px; background: #f5f5f5; border-radius: 0 0 8px 8px;">
                            <p>Привет, ${data.name}!</p>
                            <p>Спасибо, что присоединились к Media Sync Bot! Мы рады помочь вам синхронизировать медиа между Discord и Telegram.</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="color: #00d9ff; margin-top: 0;">🚀 Начните прямо сейчас:</h3>
                                <p><a href="${data.discordBotLink}" style="color: #5865F2; text-decoration: none; font-weight: bold;">➕ Добавить бота в Discord</a></p>
                                <p><a href="${data.telegramBotLink}" style="color: #0088cc; text-decoration: none; font-weight: bold;">🤖 Запустить бота в Telegram</a></p>
                            </div>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="color: #00d9ff; margin-top: 0;">📚 Полезные ссылки:</h3>
                                <p><a href="${data.documentationLink}" style="color: #00d9ff; text-decoration: none;">📖 Документация</a></p>
                                <p><a href="${data.supportLink}" style="color: #00d9ff; text-decoration: none;">💬 Поддержка</a></p>
                            </div>
                            
                            <p>Если у вас есть вопросы, не стесняйтесь обращаться в нашу поддержку.</p>
                            <p>С наилучшими пожеланиями,<br>Команда Media Sync Bot</p>
                        </div>
                    </div>
                `;
                break;

            default:
                html = `<p>${data.message || 'Нет сообщения'}</p>`;
        }

        return html;
    }

    // Utility methods for form handling
    static setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                subscribe: formData.get('subscribe') === 'on'
            };

            // Get attachments
            const fileInput = document.getElementById('attachments');
            if (fileInput && fileInput.files.length > 0) {
                data.attachments = Array.from(fileInput.files).map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }));
            }

            // Create email service instance
            const emailService = new EmailService();
            await emailService.init({
                contactEmail: 'support@mediasyncbot.com',
                links: window.config?.links || {}
            });

            try {
                // Send email
                const result = await emailService.sendContactForm(data);

                // Show success message
                EmailService.showMessage('Сообщение успешно отправлено!', 'success');

                // Send welcome email if subscribed
                if (data.subscribe && emailService.validateEmail(data.email)) {
                    setTimeout(async () => {
                        try {
                            await emailService.sendWelcomeEmail(data.email, data.name);
                        } catch (error) {
                            console.warn('Could not send welcome email:', error);
                        }
                    }, 2000);
                }

                // Reset form
                form.reset();

            } catch (error) {
                console.error('Error sending email:', error);
                EmailService.showMessage('Ошибка при отправке сообщения. Попробуйте еще раз.', 'error');
            }
        });
    }

    static showMessage(message, type = 'info') {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize email service for contact form
    EmailService.setupContactForm();

    // Setup newsletter subscription
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!email) return;

            const emailService = new EmailService();

            try {
                // In a real app, this would add to newsletter list
                console.log('Subscribing email:', email);

                // Simulate subscription
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Show success
                alert('Вы успешно подписались на рассылку!');
                emailInput.value = '';

            } catch (error) {
                console.error('Subscription error:', error);
                alert('Ошибка при подписке. Попробуйте еще раз.');
            }
        });
    }
});

window.EmailService = EmailService;
