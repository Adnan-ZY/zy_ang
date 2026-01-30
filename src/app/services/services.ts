import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesComponent {
  services: Service[] = [
    {
      id: 1,
      icon: 'code',
      title: 'Web Development',
      description: 'Custom web applications built with modern frameworks and cutting-edge technologies for optimal performance and scalability.',
      features: ['.NET Core', 'SQL Server', 'Angular', 'API Integration'],
      color: 'indigo'
    },
    {
      id: 2,
      icon: 'mobile',
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.',
      features: ['iOS & Android', 'React Native', 'Flutter', 'App Store Optimization'],
      color: 'purple'
    },
    {
      id: 3,
      icon: 'design',
      title: 'UI/UX Design',
      description: 'Human-centered design solutions that create intuitive, engaging, and visually stunning digital experiences.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      color: 'pink'
    },
    {
      id: 4,
      icon: 'desktop',
      title: 'Desktop POS Solutions',
      description: 'Powerful point-of-sale desktop applications built with modern technologies for retail, restaurants, and service businesses.',
      features: ['Electron JS', 'Offline Support', 'Inventory Management', 'Reports & Analytics'],
      color: 'emerald'
    },
    {
      id: 5,
      icon: 'seo',
      title: 'Digital Marketing',
      description: 'Data-driven marketing strategies to boost your online presence and drive measurable business growth.',
      features: ['SEO Optimization', 'Content Strategy', 'Analytics', 'Social Media'],
      color: 'amber'
    },
    {
      id: 6,
      icon: 'consulting',
      title: 'Tech Consulting',
      description: 'Strategic technology consulting to help you make informed decisions and achieve your digital transformation goals.',
      features: ['Tech Audits', 'Architecture Design', 'Team Training', 'Strategy Planning'],
      color: 'cyan'
    }
  ];
}
