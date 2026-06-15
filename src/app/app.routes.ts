import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/authentication/welcome-component/welcome-component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { UserPageInfoComponent } from './pages/user/user-page-info/user-page-info';
import { UserPageEditComponent } from './pages/user/user-page-edit/user-page-edit';
import { authGuard } from './guards/auth.guard';
import { UserPageSell } from './pages/user/user-page-sell/user-page-sell';
import { ArticleDetailComponent } from './pages/article-detail-component/article-detail-component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';


//import { roleGuard } from './guards/role.guard';
import { HeaderMenuComponent } from './shared/headers/header-menu/header-menu.component';
import { ModerationComponent } from './pages/moderation/moderation.component';
//11062026 MOG IMPORTACION COMPOENTES ADMIN
//import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUserManagementComponent } from './pages/admin/admin-user-management/admin-user-management.component';
import { AdminCategoryManagementComponent } from './pages/admin/admin-category-management/admin-category-management.component';


import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-info', component: UserPageInfoComponent, canActivate: [authGuard] },
  { path: 'user-edit', component: UserPageEditComponent, canActivate: [authGuard] },
  { path: 'user-sell', component: UserPageSell },
  { path: 'article-detail', component: ArticleDetailComponent },
  { path: 'admin', 
    component: AdminLayoutComponent, 
    canActivate: [roleGuard(['ADMIN'])], 
    children: [
      { path: 'dashboard', component: AdminDashboardComponent},
      { path: 'users', component: AdminUserManagementComponent },
      { path: 'categories', component: AdminCategoryManagementComponent },

      // 👇 ESTA LÍNEA HACE QUE USERS SE CARGUE POR DEFECTO
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      // prueba para editar usuario desde admin
      { 
        path: 'users/editar/:id', 
        component: UserPageEditComponent 
      },

    ]
  },
  ]

 
  

  // A medida que se vayan creando los componentes de cada página, se irán añadiendo aquí con su correspondiente path y guard si es necesario
  //Habrá incluso rutas para cada rol, por ejemplo, /admin, /moderador, /usuario, etc. y se protegerán con el guard correspondiente para cada rol
  //Usaremos la línea comentada roleGuard

  /*
  Cómo usarlo:
  {
    path: 'admin',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () => import('./pages/admin/admin.component')
  }
  { path: 'header-menu', component: HeaderMenuComponent},
  { path: 'admin-header', component: AdminHeaderComponent, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'moderation', component: ModerationComponent },
  {
  path: 'admin',
  canActivate: [roleGuard(['ADMIN'])],
  component: AdminLayout,
  children: [
    { path: 'users', component: AdminUserManagementComponent },
    { path: 'articles', component: AdminArticleManagementComponent },
    { path: 'categories', component: AdminCategoryManagementComponent },
    { path: 'reports', component: AdminReportManagementComponent },

    // 👇 ESTA LÍNEA HACE QUE USERS SE CARGUE POR DEFECTO
    { path: '', redirectTo: 'users', pathMatch: 'full' }
  ]
}


*/
];



