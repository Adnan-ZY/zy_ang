import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
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
      value: 'madnanhz42@gmail.com',
      link: 'mailto:madnanhz42@gmail.com'
    },
    {
      icon: 'phone',
      title: 'Call Us',
      value: '+92 326 1707830',
      link: 'tel:+923261707830'
    }
  ];

  socialLinks = [
    { name: 'Twitter', icon: 'twitter', url: '#' },
    { name: 'LinkedIn', icon: 'linkedin', url: '#' },
    { name: 'GitHub', icon: 'github', url: '#' },
    { name: 'Instagram', icon: 'instagram', url: '#' }
  ];

  async onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      return;
    }

    this.isSubmitting.set(true);
    this.hasError.set(false);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.isSubmitting.set(false);
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
  }
}
