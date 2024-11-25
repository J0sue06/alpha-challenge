import { HttpInterceptorFn } from '@angular/common/http';
import { IsLoadingService } from '../services/is-loading/is-loading.service';
import { inject } from '@angular/core';
import { catchError, finalize, timeout } from 'rxjs/operators';

export const isLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const isLoading = inject(IsLoadingService);
  isLoading.isLoadingHandler();
  return next(req).pipe(
    timeout(60000),
    catchError((error) => {
      isLoading.isLoadingResetHandler();
      throw error;
    }),
    finalize(() => {
      isLoading.isLoadingResetHandler();
    })
  );
};
