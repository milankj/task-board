import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private _authService: AuthService
    ) { }

    changeUrl(request: HttpRequest<any>): HttpRequest<any> {
        const baseUrl = environment.apiUrl;
        let replacedUrl = "";

        if (request.url.includes('api/')) {
            replacedUrl = request.url.replace('api/', baseUrl);

            const dupReq = request.clone({
                url: replacedUrl
            });

            return dupReq;
        }

        return request;
    }

    tokenizeReq(request: HttpRequest<any>): HttpRequest<any> {
        const token = this._authService.getItem('token');

        if (token) {
            return request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`
                }
            })
        }
        return request;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log("req", req);
        const apiName = req.url.split('/')[2];

        req = this.changeUrl(req);

        console.log("apiName", apiName);

        if (!apiName || apiName !== "login") {
            console.log("tokenzied api")
            req = this.tokenizeReq(req);
        }

        // Removeing Frontend Token
        return next.handle(req).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    this._authService.clearAuthData();
                }

                return throwError(() => error);
            })
        );

    }
}