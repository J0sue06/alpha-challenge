import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IsLoadingService {
  isLoading = signal(false);

  constructor() {}

  isLoadingHandler() {
    this.isLoading.set(true);
  }

  isLoadingResetHandler() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000); 
  }
}
