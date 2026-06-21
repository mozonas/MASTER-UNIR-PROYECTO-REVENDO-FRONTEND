import { Routes } from '@angular/router';

import { WelcomeComponent } from './pages/authentication/welcome-component/welcome-component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { UserPageInfoComponent } from './pages/user/user-page-info/user-page-info';
import { UserPageEditComponent } from './pages/user/user-page-edit/user-page-edit';
import { UserPageSell } from './pages/user/user-page-sell/user-page-sell';
import { ArticleDetailComponent } from './pages/article-detail-component/article-detail-component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';


//import { roleGuard } from './guards/role.guard';
import { HeaderMenuComponent } from './shared/headers/header-menu/header-menu.component';

// Importaciones del módulo Moderación
import { ModerationComponent } from './pages/moderation/moderation.component';
import { ArticlesListComponent } from './pages/moderation/components/articles-list/articles-list.component';
import { ModerationDashboardComponent } from './pages/moderation/components/moderation-dashboard/moderation-dashboard.component';
import { ChatsListComponent } from './pages/moderation/components/chats-list/chats-list.component';
import { ArticleReportDetailComponent } from './pages/moderation/components/article-report-detail/article-report-detail.component';


//11062026 MOG IMPORTACION COMPOENTES ADMIN
//import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUserManagementComponent } from './pages/admin/admin-user-management/admin-user-management.component';
import { AdminCategoryManagementComponent } from './pages/admin/admin-category-management/admin-category-management.component';

import { AboutComponent } from './pages/about/about';
import { HelpComponent } from './pages/help/help';
import { TermsComponent } from './pages/terms/terms';
import { PrivacyComponent } from './pages/privacy/privacy';
import { ArticleFormComponent } from './pages/articles/article-form/article-form.component';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';


//17062026 mog componente error404
import { Error404Component } from './pages/error-404/error-404';
import { AdminActivityComponent } from './pages/admin/admin-activity/admin-activity.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'user-info', component: UserPageInfoComponent, canActivate: [authGuard] },
  { path: 'user-edit', component: UserPageEditComponent, canActivate: [authGuard] },
  { path: 'user-sell/:id', component: UserPageSell, /* canActivate: [authGuard]  */},
  { path: 'article-form', component: ArticleFormComponent, canActivate: [authGuard] },
  { path: 'article-form/:id', component: ArticleFormComponent, canActivate: [authGuard] },
  { path: 'article-detail/:id', component: ArticleDetailComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [roleGuard(['ADMIN'])],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUserManagementComponent },
      { path: 'categories', component: AdminCategoryManagementComponent },
      { path: 'activity/:range', component: AdminActivityComponent },
      // 👇 ESTA LÍNEA HACE QUE USERS SE CARGUE POR DEFECTO
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      // prueba para editar usuario desde admin
      {
        path: 'users/info/:id',
        component: UserPageInfoComponent
      },
      {
        path: 'users/editar/:id',
        component: UserPageEditComponent
      },


    ]
  },

    // Directorios sección Moderación
  { path: 'moderation', 
    component: ModerationComponent,
    canActivate: [roleGuard(['MODERADOR'])], //VCB - añadir proteccion del rol
    children: [
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
      { path: 'panel', component: ModerationDashboardComponent },
      { path: 'articulos', component: ArticlesListComponent },
      { path: 'articulos/detalle/:id', component: ArticleReportDetailComponent },
      { path: 'chat', component: ChatsListComponent }
    ]
  },


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
  // --- Páginas Legales del Footer ---
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: '404', component: Error404Component },
  { path: '**', component: Error404Component } // Esta ruta debe ir al final, ya que es la ruta comodín para páginas no encontradas

];



