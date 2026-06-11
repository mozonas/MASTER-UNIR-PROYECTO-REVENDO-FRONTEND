import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/authentication/welcome-component/welcome-component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { UserPageInfoComponent } from './pages/user/user-page-info/user-page-info';
import { UserPageEditComponent } from './pages/user/user-page-edit/user-page-edit';
import { authGuard } from './guards/auth.guard';
import { UserPageSell } from './pages/user/user-page-sell/user-page-sell';
import { ArticleDetailComponent } from './pages/article-detail-component/article-detail-component';
import { AdminHeaderComponent } from './shared/headers/admin-header/admin-header.component';
import { HeaderMenuComponent } from './shared/headers/header-menu/header-menu.component';
import { ModerationComponent } from './pages/moderation/moderation.component';
//11062026 MOG IMPORTACION COMPOENTES ADMIN
//import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { AdminUserManagementComponent } from './pages/admin/admin-user-management/admin-user-management.component';
import { AdminArticleManagementComponent} from './pages/admin/admin-article-management/admin-article-management.component';
import { AdminCategoryManagementComponent } from './pages/admin/admin-category-management/admin-category-management.component';
import { AdminReportManagementComponent} from './pages/admin/admin-report-management/admin-report-management.component';


import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "home" },
  { path: "home", component: WelcomeComponent },
  { path: "login", component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-info', component: UserPageInfoComponent, canActivate: [authGuard] },
  { path: 'user-edit', component: UserPageEditComponent, canActivate: [authGuard] },
  { path: 'user-sell', component: UserPageSell },
  { path: 'article-detail', component: ArticleDetailComponent },
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


];



