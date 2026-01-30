import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { delay } from 'rxjs/operators';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class PortfolioComponent implements OnInit {
  portfolioItems: PortfolioItem[] = [];
  filteredItems: PortfolioItem[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';
  selectedItem: PortfolioItem | null = null;
  isModalOpen: boolean = false;
  isLoading: boolean = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.isLoading = true;
    this.http.get<PortfolioItem[]>('assets/data/projects.json').pipe(
      delay(1000)
    ).subscribe({
      next: (data) => {
        this.portfolioItems = data;
        this.filteredItems = [...data];
        this.extractCategories();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.portfolioItems = [];
        this.filteredItems = [];
        this.isLoading = false;
      }
    });
  }

  extractCategories() {
    const cats = new Set(this.portfolioItems.map(p => p.category));
    this.categories = ['All', ...Array.from(cats)];
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredItems = this.portfolioItems;
    } else {
      this.filteredItems = this.portfolioItems.filter(p => p.category === category);
    }
  }

  openModal(item: PortfolioItem) {
    this.selectedItem = item;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedItem = null;
    document.body.style.overflow = '';
  }
}
