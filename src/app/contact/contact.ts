import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  constructor(private titleService: Title, private metaService: Meta) {
    this.titleService.setTitle('Contact ZYPHERX - Digital Agency | Get Your Free Consultation');
    this.metaService.updateTag({ name: 'description', content: 'Contact ZYPHERX for a free consultation on your digital project. Expert web design, SEO, and digital marketing services. Reach out today!' });
  }

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = signal(false);
  isSubmitted = signal(false);
  hasError = signal(false);

  contactInfo = [
    {
      icon: 'email',
      title: 'Email Us',
      value: 'zypherhe@gmail.com',
      link: 'mailto:zypherhe@gmail.com'
    },
    {
      icon: 'whatsapp',
      title: 'Drop a text',
      value: '+92 326 1707830',
      link: 'https://wa.me/923261707830'
    }
  ];

  // Free email delivery via FormSubmit.co — no API key/signup required.
  // Messages are delivered to this inbox. The very first submission triggers a
  // one-time activation email to this address; click the link in it to enable delivery.
  private readonly formEndpoint = 'https://formsubmit.co/ajax/zypherhe@gmail.com';

  async onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      return;
    }

    this.isSubmitting.set(true);
    this.hasError.set(false);

    try {
      const response = await fetch(this.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: this.formData.name,
          email: this.formData.email,
          subject: this.formData.subject || 'No subject',
          message: this.formData.message,
          // FormSubmit control fields
          _subject: `New ZYPHERX inquiry from ${this.formData.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json().catch(() => ({}));
      const success = response.ok && (result.success === true || result.success === 'true');

      if (!success) {
        throw new Error('Submission failed');
      }

      this.isSubmitted.set(true);

      // Reset form
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };

      // Reset success message after 5 seconds
      setTimeout(() => {
        this.isSubmitted.set(false);
      }, 5000);
    } catch {
      this.hasError.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
