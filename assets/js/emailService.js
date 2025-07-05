/**
 * Email Service for Contact Form
 * Handles sending emails using Formspree service
 */

class EmailService {
    constructor() {
        // Formspree endpoint - replace YOUR_FORM_ID with your actual Formspree form ID
        this.formspreeEndpoint = 'https://formspree.io/f/manjzypa';
        // Backup endpoint for immediate use (you'll get your own after setup)
        this.backupEndpoint = 'https://formspree.io/f/xdkngrpd'; // Temporary demo endpoint
        this.isInitialized = true; // Formspree doesn't need initialization
    }    /**
     * Send email using Formspree
     */
    async sendEmail(formData) {
        try {
            console.log('📧 Sending email via Formspree...');

            const response = await fetch(this.formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || 'Not provided',
                    service: formData.service,
                    message: formData.details,
                    _subject: `New Contact Request - ${formData.service} | ${formData.name}`,
                    _replyto: formData.email,
                    _format: 'plain'
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    message: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.'
                };
            } else {
                throw new Error(data.error || 'Failed to send message');
            }

        } catch (error) {
            console.error('Formspree sending failed:', error);

            // Fallback to mailto
            console.warn('Using mailto fallback due to service error');
            return this.sendViaMailto(formData);
        }
    }

    /**
     * Fallback method using mailto
     */
    sendViaMailto(formData) {
        const subject = `New Contact Form Submission - ${formData.service}`;
        const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Service Type: ${formData.service}

Project Details:
${formData.details}

---
This message was sent via InovareSoft website contact form.
        `.trim();

        const mailtoLink = `mailto:inovaresoft@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open mailto link
        window.location.href = mailtoLink;

        return {
            success: true,
            message: 'Your email client has been opened with the message. Please send the email to complete your request.'
        };
    }

    /**
     * Validate form data with enhanced validation
     */
    validateFormData(formData) {
        const errors = [];
        const fieldErrors = {};

        // Name validation
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
            fieldErrors.name = 'Please enter your full name (minimum 2 characters)';
        } else if (formData.name.trim().length > 50) {
            errors.push('Name is too long');
            fieldErrors.name = 'Name must be less than 50 characters';
        }

        // Email validation
        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('Please enter a valid email address');
            fieldErrors.email = 'Please enter a valid email address (e.g., john@example.com)';
        }

        // Phone validation (optional but if provided, should be valid)
        if (formData.phone && formData.phone.trim()) {
            if (!this.isValidPhone(formData.phone)) {
                errors.push('Please enter a valid phone number');
                fieldErrors.phone = 'Please enter a valid phone number';
            }
        }

        // Service validation
        if (!formData.service) {
            errors.push('Please select a service type');
            fieldErrors.service = 'Please select the service you need';
        }

        // Project details validation
        if (!formData.details || formData.details.trim().length < 10) {
            errors.push('Project details must be at least 10 characters long');
            fieldErrors.details = 'Please provide more details about your project (minimum 10 characters)';
        } else if (formData.details.trim().length > 1000) {
            errors.push('Project details are too long');
            fieldErrors.details = 'Project details must be less than 1000 characters';
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            fieldErrors: fieldErrors
        };
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number format
     */
    isValidPhone(phone) {
        // Remove all non-numeric characters for validation
        const cleanPhone = phone.replace(/\D/g, '');
        // Check if it's between 10-15 digits (international format)
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }
}

// Export for use in other files
window.EmailService = EmailService;
