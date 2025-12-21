import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { PreloaderComponent } from './preloader/preloader'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, PreloaderComponent],
  // FIX: Change these two lines to match your file names
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'idea-zy-angular';
}