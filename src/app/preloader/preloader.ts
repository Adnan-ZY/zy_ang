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

  // Critical assets to preload
  private criticalAssets = [
    'assets/media/3d-casual-life-analytics-on-computer-screen.webm',
    'assets/images/logo.png'
  ];

  private loadedCount = 0;
  private assetsReady = false;
  private minTimeReached = false;
  private exitAnimationPending = false;

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

  // Preload a single asset and return a promise
  private preloadAsset(src: string): Promise<void> {
    return new Promise((resolve) => {
      if (src.endsWith('.webm') || src.endsWith('.mp4')) {
        // Video preload
        const video = document.createElement('video');
        video.preload = 'auto';
        video.oncanplaythrough = () => resolve();
        video.onerror = () => resolve(); // Don't block on error
        video.src = src;
      } else {
        // Image preload
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't block on error
        img.src = src;
      }
    });
  }

  // Load all critical assets
  private async loadCriticalAssets(onProgress: (percent: number) => void): Promise<void> {
    const total = this.criticalAssets.length;
    
    const promises = this.criticalAssets.map(async (src) => {
      await this.preloadAsset(src);
      this.loadedCount++;
      onProgress((this.loadedCount / total) * 100);
    });

    await Promise.all(promises);
  }

  private checkAndRunExitAnimation() {
    if (this.assetsReady && this.minTimeReached && !this.exitAnimationPending) {
      this.exitAnimationPending = true;
      this.runExitAnimation();
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

    // Store references for exit animation
    (this as any)._elements = { preloader, preloaderContent, loadingBar, loadingHighlight, counter, brandWrapper, brandText, bigX };

    // Start loading assets
    let currentProgress = 0;
    this.loadCriticalAssets((percent) => {
      // Smoothly update to real progress
      if (percent > currentProgress) {
        currentProgress = percent;
      }
    }).then(() => {
      this.assetsReady = true;
      this.checkAndRunExitAnimation();
    });

    // Minimum time: 2 seconds for branding
    const MIN_TIME = 2000;
    // Maximum time: 6 seconds cap
    const MAX_TIME = 6000;

    // Create loading animation timeline
    const loadingTl = gsap.timeline();
    
    // Phase A: Loading bar animation - tied to real progress with smooth interpolation
    const counterObj = { value: 0 };
    
    // Animate to 90% over minimum time (real progress fills the rest)
    loadingTl.to(counterObj, {
      value: 90,
      duration: MIN_TIME / 1000,
      ease: 'power2.inOut',
      onUpdate: () => {
        // Use the higher of animated value or real progress
        const displayValue = Math.max(counterObj.value, currentProgress);
        if (counter) counter.textContent = Math.round(displayValue) + '%';
        if (loadingBar) loadingBar.style.width = displayValue + '%';
      }
    });

    // Highlight now moves with loading bar (it's a child element), no separate animation needed

    // After minimum time, check if assets are ready
    loadingTl.call(() => {
      this.minTimeReached = true;
      
      // Complete the progress bar to 100%
      gsap.to(counterObj, {
        value: 100,
        duration: 0.3,
        ease: 'power2.out',
        onUpdate: () => {
          if (counter) counter.textContent = Math.round(counterObj.value) + '%';
          if (loadingBar) loadingBar.style.width = counterObj.value + '%';
        },
        onComplete: () => {
          this.checkAndRunExitAnimation();
        }
      });
    });

    // Max time fallback - force exit after 6 seconds
    setTimeout(() => {
      if (!this.exitAnimationPending) {
        this.assetsReady = true;
        this.minTimeReached = true;
        this.checkAndRunExitAnimation();
      }
    }, MAX_TIME);
  }

  private runExitAnimation() {
    const { preloader, preloaderContent, brandWrapper, brandText, bigX } = (this as any)._elements;

    const exitTl = gsap.timeline();

    // Phase B: Hide loading elements and show brand text
    exitTl.to(preloaderContent, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'power2.in'
    });

    // Show brand text wrapper
    exitTl.set(brandWrapper, {
      opacity: 1,
      visibility: 'visible'
    });

    // Left-to-right reveal using clip-path
    exitTl.fromTo(brandText, {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
    }, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 0.8,
      ease: 'power3.inOut'
    });

    // Pause on brand text
    exitTl.to({}, { duration: 0.3 });

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
    exitTl.to(brandWrapper, {
      opacity: 0,
      duration: 0.3,
      ease: 'linear'
    });
    
    exitTl.fromTo(bigX, {
      opacity: 0,
      scale: 0.3
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'linear'
    }, '<');

    // Brief pause
    exitTl.to({}, { duration: 0.2 });

    // Phase C: Exit - X fades out, then preloader fades out
    exitTl.to(bigX, {
      opacity: 0,
      scale: 1.3,
      duration: 0.4,
      ease: 'power2.out'
    });
    
    exitTl.to(preloader, {
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
