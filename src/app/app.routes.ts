import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'user-info',
        loadComponent: () => import('./pages/user/user-page-info/user-page-info').then(m => m.UserPageInfoComponent)
    }
];
