import { Routes } from '@angular/router';
// Ensure this path matches your folder structure: src/app/home/home.ts
import { HomeComponent } from './home/home'; 
import { ProjectsComponent } from './projects/projects';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
];