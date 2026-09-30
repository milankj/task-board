import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

type StorageKey = 'token' | 'user';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private _currentAuthSubject: BehaviorSubject<any>;
    public currentAuth: Observable<any>;

    constructor(
        private _http: HttpClient
    ) {
        const token = this.getItem('token');
        const user = this.getItem('user');
        const initialAuth = (token && user) ? { token, user } : null;

        this._currentAuthSubject = new BehaviorSubject<any>(initialAuth);
        this.currentAuth = this._currentAuthSubject.asObservable();
    }

    public get currentAuthValue() {
        return this._currentAuthSubject.value;
    }

    isLoggedIn(): boolean {

        // For now just check if localstorage data present, later use api to check login validation

        const token = this.getItem('token');
        const user = this.getItem('user');
        return Boolean(token && user);
    }

    setItem(key: StorageKey, value: any) {
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }
    }

    getItem(key: StorageKey) {
        const item = localStorage.getItem(key);
        if (!item) return null;
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    }

    removeItem(key: StorageKey) {
        localStorage.removeItem(key);
    }

    clearAuthData() {
        this.removeItem('token');
        this.removeItem('user');
        this._currentAuthSubject.next(null);
    }

    loginUser(email: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const payload = {
                email,
                password
            };
            this._http.post("api/users/login", payload).subscribe({
                next: (res: any) => {
                    if (res.data) {
                        const authData = {
                            user: res.data.user || res.data,
                            token: res.data.token || res.token
                        };

                        if (authData.token) {
                            this.setItem('token', authData.token);
                        }
                        if (authData.user) {
                            this.setItem('user', authData.user);
                        }

                        this._currentAuthSubject.next(authData);
                    }
                    resolve(res);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    }

    logout(): Observable<any> {
        return this._http.post("api/users/logout", {});
    }
}
