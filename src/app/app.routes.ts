import { Routes } from '@angular/router';
// Ensure this path matches your folder structure: src/app/home/home.ts
import { HomeComponent } from './home/home'; 
import { ProjectsComponent } from './projects/projects';
import { ServicesComponent } from './services/services';
import { PortfolioComponent } from './portfolio/portfolio';
import { ContactComponent } from './contact/contact';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'contact', component: ContactComponent },
];