import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user/dashboard'
    },
    {
        path: "auth",
        loadComponent: () => import("./auth/login/login").then(m => m.Login),
    },
    {
        path: "user",
        loadChildren: () => import("./user/user.routes").then(m => m.userRoutes),
        canActivateChild: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'user/dashboard'
    }
];
