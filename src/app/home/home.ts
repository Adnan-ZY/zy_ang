import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swiper from 'swiper';
import { EffectCoverflow, Autoplay, A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  // THIS LINE FIXES THE "swiper-container is not a known element" ERROR
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
// THIS "export" KEYWORD FIXES THE "has no exported member" ERROR
export class HomeComponent implements OnInit, AfterViewInit {
  slides: Slide[] = [];
  renderSlides: Slide[] = [];
  private swiper?: Swiper;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initMarquee();
    this.loadSlides();
  }

  ngAfterViewInit() {
    // Initialize Swiper after view is ready
    setTimeout(() => {
      this.initSwiper();
    }, 100);
  }

  initSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = undefined;
    }

    this.swiper = new Swiper(".projectSwiper", {
      modules: [EffectCoverflow, Autoplay, A11y, Keyboard],
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      rewind: true,
      observer: true,
      observeParents: true,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
      coverflowEffect: {
        rotate: 8,
        stretch: -30,
        depth: 260,
        modifier: 1.1,
        slideShadows: true,
      },
      loop: true,
      loopAdditionalSlides: 2,
      resistanceRatio: 0.65,
      longSwipesMs: 250,
      longSwipesRatio: 0.1,
      autoplay: {
        delay: 2700,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        stopOnLastSlide: false,
        waitForTransition: true,
      },
      speed: 800,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      a11y: {
        enabled: true,
      },
      on: {
        init: (swiper: Swiper) => {
          // Ensure autoplay starts even after dynamic init
          if (swiper.autoplay && typeof swiper.autoplay.start === 'function') {
            swiper.autoplay.start();
          }
        },
        reachEnd: (swiper: Swiper) => {
          // If loop got disabled internally, fake the loop behavior
          if (!swiper.params.loop) {
            swiper.slideTo(0, 0);
            if (swiper.autoplay && typeof swiper.autoplay.start === 'function') {
              swiper.autoplay.start();
            }
          }
        }
      }
    });
  }

  loadSlides() {
    this.http.get<Slide[]>("assets/data/slides.json").subscribe({
      next: (data) => {
        this.slides = data;
        // Build render set with duplicates to guarantee smooth loop
        this.renderSlides = this.duplicateForLoop(this.slides);
        // Stabilize change detection and then (re)initialize Swiper
        this.cdr.detectChanges();
        requestAnimationFrame(() => this.initSwiper());
      },
      error: () => {
        this.slides = [];
        this.renderSlides = [];
      }
    });
  }

  private duplicateForLoop(src: Slide[]): Slide[] {
    if (!src || src.length === 0) return [];
    // Ensure enough slides for loop+coverflow; duplicate until threshold is met
    const out: Slide[] = [...src];
    while (out.length < 5) {
      out.push(...src);
    }
    return out;
  }

  initMarquee() {
    const track = document.getElementById("scrollTrack");
    if (!track) return;

    const titleText = "ZYPHERX";
    
    const createSpan = () => {
        const s = document.createElement("span");
        s.textContent = titleText;
        s.className = "text-6xl md:text-8xl lg:text-[10vw] font-black text-gray-900 dark:text-gray-100 uppercase tracking-tighter mx-10 py-4 whitespace-nowrap";
        return s;
    };

    for (let i = 0; i < 10; i++) {
        track.appendChild(createSpan());
    }
    track.appendChild(track.cloneNode(true));

    let x = 0;
    const speed = 0.5;
    
    const animate = () => {
        x -= speed;
        const halfWidth = track.scrollWidth / 2;
        if (Math.abs(x) >= halfWidth) {
            x += halfWidth;
        }
        track.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(animate);
    };
    
    animate();
  }
}

interface SlideMetric {
  value: string;
  label: string;
}

interface Slide {
  image: string;
  description: string;
  metrics: SlideMetric[];
  link: string;
  linkText?: string;
}