'use client';

import { useState, FormEvent } from 'react';
import { sanitizeEmail, sanitizeHtml, sanitizeSearchQuery, apiRateLimiter } from '../../lib/security';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  general?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Rate limiting for form submissions
  const canSubmit = apiRateLimiter.isAllowed('contact-form');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Sanitize and validate name
    const sanitizedName = sanitizeHtml(formData.name);
    if (!sanitizedName || sanitizedName.length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    } else if (sanitizedName.length > 100) {
      newErrors.name = 'Nama maksimal 100 karakter';
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(formData.email);
    if (!sanitizedEmail) {
      newErrors.email = 'Email tidak valid';
    }

    // Sanitize and validate company (optional)
    const sanitizedCompany = sanitizeHtml(formData.company);
    if (sanitizedCompany && sanitizedCompany.length > 100) {
      newErrors.company = 'Nama perusahaan maksimal 100 karakter';
    }

    // Sanitize and validate message
    const sanitizedMessage = sanitizeHtml(formData.message);
    if (!sanitizedMessage || sanitizedMessage.length < 10) {
      newErrors.message = 'Pesan minimal 10 karakter';
    } else if (sanitizedMessage.length > 1000) {
      newErrors.message = 'Pesan maksimal 1000 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    // Real-time sanitization
    let sanitizedValue = value;
    if (field === 'email') {
      sanitizedValue = value.replace(/[<>'"&]/g, ''); // Basic sanitization for email
    } else {
      sanitizedValue = sanitizeHtml(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setErrors({ general: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizeHtml(formData.name),
          email: sanitizeEmail(formData.email),
          company: sanitizeHtml(formData.company),
          message: sanitizeHtml(formData.message),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });

    } catch (error) {
      console.error('Contact form submission error:', error);
      setErrors({
        general: 'Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-400 mb-2">Pesan Terkirim!</h3>
          <p className="text-slate-400 text-sm mb-4">
            Terima kasih atas pesan Anda. Tim kami akan menghubungi Anda dalam 1-2 hari kerja.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors"
          >
            Kirim Pesan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
              errors.name ? 'border-red-500' : 'border-slate-700'
            }`}
            placeholder="Masukkan nama lengkap Anda"
            maxLength={100}
            required
          />
          {errors.name && (
            <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-slate-700'
            }`}
            placeholder="email@contoh.com"
            required
          />
          {errors.email && (
            <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
            Perusahaan/Institusi
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={handleInputChange('company')}
            className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
              errors.company ? 'border-red-500' : 'border-slate-700'
            }`}
            placeholder="Opsional"
            maxLength={100}
          />
          {errors.company && (
            <p className="mt-1 text-red-400 text-sm">{errors.company}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
            Pesan *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleInputChange('message')}
            rows={4}
            className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors resize-none ${
              errors.message ? 'border-red-500' : 'border-slate-700'
            }`}
            placeholder="Jelaskan kebutuhan training atau konsultasi Anda..."
            maxLength={1000}
            required
          />
          <div className="flex justify-between mt-1">
            {errors.message && (
              <p className="text-red-400 text-sm">{errors.message}</p>
            )}
            <p className="text-slate-500 text-xs ml-auto">
              {formData.message.length}/1000
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </>
          ) : (
            'Kirim Pesan'
          )}
        </button>

        <p className="text-xs text-slate-500 text-center">
          Data Anda aman dan hanya digunakan untuk keperluan komunikasi.
        </p>
      </form>
    </div>
  );
}