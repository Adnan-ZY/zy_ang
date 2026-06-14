import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderService } from './preloader.service';

declare const gsap: any;

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.html',
  styleUrl: './preloader.css'
})
export class PreloaderComponent implements OnInit, AfterViewInit {
  isVisible = false;

  constructor(private preloaderService: PreloaderService) {}

  ngOnInit() {
    // Only show if this is the first load
    this.isVisible = this.preloaderService.shouldShow();
    
    if (this.isVisible) {
      // Prevent scrolling during preload
      document.body.style.overflow = 'hidden';
    }
  }

  ngAfterViewInit() {
    if (this.isVisible) {
      this.startAnimation();
    }
  }

  startAnimation() {
    const preloader = document.getElementById('preloader');
    const brandText = document.getElementById('brand-text');
    const slogan = document.getElementById('slogan');
    const lineFill = document.getElementById('loading-line-fill');

    const tl = gsap.timeline();

    // Fade the brand in
    tl.from(brandText, {
      y: 16,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out'
    });

    // Fade the slogan in just after
    tl.from(slogan, {
      y: 10,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.25');

    // Fill the thin line (main "loading" stretch)
    tl.fromTo(lineFill, {
      width: '0%'
    }, {
      width: '100%',
      duration: 0.85,
      ease: 'power1.inOut'
    }, '-=0.25');

    // Hold briefly
    tl.to({}, { duration: 0.15 });

    // Fade the whole thing out
    tl.to(preloader, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        if (preloader) preloader.style.display = 'none';
        this.isVisible = false;
        document.body.style.overflow = 'auto';
      }
    });
  }
}
