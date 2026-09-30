import { Routes } from '@angular/router';
import { userResolver } from './user-resolver';

export const userRoutes: Routes = [
    {
        path: "dashboard",
        loadComponent: () => import("./dashboard/dashboard").then(m => m.Dashboard),
        resolve: { data: userResolver }
    },
    {
        path: "settings",
        loadComponent: () => import("./settings/settings").then(m => m.Settings)
    }
];
