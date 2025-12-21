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
    const preloaderContent = document.getElementById('preloader-content');
    const loadingBar = document.getElementById('loading-bar');
    const loadingHighlight = document.getElementById('loading-highlight');
    const counter = document.getElementById('loading-counter');
    const brandWrapper = document.getElementById('brand-text-wrapper');
    const brandText = document.getElementById('brand-text');
    const bigX = document.getElementById('big-x');

    // Create loading animation timeline
    const loadingTl = gsap.timeline();
    
    // Phase A: Loading bar and counter animation from 0 to 100
    const counterObj = { value: 0 };
    loadingTl.to([counterObj, loadingBar], {
      value: 100,
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counter) counter.textContent = Math.round(counterObj.value) + '%';
      }
    });

    // Animate the highlight to move from left to right
    loadingTl.to(loadingHighlight, {
      left: '100%',
      duration: 1.7,
      ease: 'power2.inOut'
    }, '<');

    // Phase B: Hide loading elements and show brand text
    loadingTl.to(preloaderContent, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'power2.in'
    }, '+=0.2');

    // Show brand text wrapper
    loadingTl.set(brandWrapper, {
      opacity: 1,
      visibility: 'visible'
    });

    // Left-to-right reveal using clip-path
    loadingTl.fromTo(brandText, {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
    }, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 0.8,
      ease: 'power3.inOut'
    });

    // Pause on brand text
    loadingTl.to({}, { duration: 0.3 });

    // Set big X at center of screen
    gsap.set(bigX, {
      x: '-50%',
      y: '-50%',
      xPercent: 0,
      yPercent: 0,
      transformOrigin: 'center center',
      opacity: 0
    });

    // Both animations synced
    loadingTl.to(brandWrapper, {
      opacity: 0,
      duration: 0.3,
      ease: 'linear'
    });
    
    loadingTl.fromTo(bigX, {
      opacity: 0,
      scale: 0.3
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'linear'
    }, '<');

    // Brief pause
    loadingTl.to({}, { duration: 0.2 });

    // Phase C: Exit - X fades out, then preloader fades out
    loadingTl.to(bigX, {
      opacity: 0,
      scale: 1.3,
      duration: 0.4,
      ease: 'power2.out'
    });
    
    loadingTl.to(preloader, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        if (preloader) preloader.style.display = 'none';
        if (bigX) bigX.style.display = 'none';
        this.isVisible = false;
        document.body.style.overflow = 'auto';
      }
    }, '-=0.3');
  }
}
