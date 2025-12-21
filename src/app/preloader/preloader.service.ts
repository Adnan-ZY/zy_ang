import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {
  private hasShown = false;

  shouldShow(): boolean {
    if (!this.hasShown) {
      this.hasShown = true;
      return true;
    }
    return false;
  }
}
