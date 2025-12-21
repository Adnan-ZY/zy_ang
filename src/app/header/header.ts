import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  
  // Controls the Mobile Menu (Open/Close)
  isMenuOpen = signal(false);

  // Controls the "Entrance" animation (fading in from top)
  isVisible = signal(false);

  constructor(public themeService: ThemeService) {}

  // Data for your links
  navItems = [
    { label: 'Projects', link: '/projects' },
    { label: 'Services', link: '#services' },
    { label: 'Portfolio', link: '#portfolio' },
    { label: 'Contact', link: '#contact' }
  ];

  ngOnInit() {
    // Replicates your 'animateHeader' function
    // Waits 100ms then fades in
    setTimeout(() => {
      this.isVisible.set(true);
    }, 100);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
    
    // Lock body scroll when menu is open
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen.set(false);
    document.body.style.overflow = '';
  }
}