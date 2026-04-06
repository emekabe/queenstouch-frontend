import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  let modifiedReq = req;
  const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh') || req.url.includes('/public');

  if (token && !isAuthRoute) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized globally
      if (error.status === 401 && !isAuthRoute) {
        if (!isRefreshing) {
          isRefreshing = true;
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            return authService.refresh({ refreshToken: refreshToken }).pipe(
              switchMap((res) => {
                isRefreshing = false;
                const newToken = res.data?.accessToken;
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                return next(retryReq);
              }),
              catchError((refreshErr) => {
                isRefreshing = false;
                authService.logout();
                window.location.href = '/login';
                return throwError(() => refreshErr);
              })
            );
          } else {
            isRefreshing = false;
            authService.logout();
            window.location.href = '/login';
          }
        }
      }
      return throwError(() => error);
    })
  );
};
