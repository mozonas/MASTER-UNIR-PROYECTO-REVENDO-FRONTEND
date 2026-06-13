import { Routes } from '@angular/router';

import { WelcomeComponent } from './pages/authentication/welcome-component/welcome-component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';

import { UserPageInfoComponent } from './pages/user/user-page-info/user-page-info';
import { UserPageEditComponent } from './pages/user/user-page-edit/user-page-edit';
import { UserPageSell } from './pages/user/user-page-sell/user-page-sell';
import { ArticleDetailComponent } from './pages/article-detail-component/article-detail-component';

import { HeaderMenuComponent } from './shared/headers/header-menu/header-menu.component';
import { AdminHeaderComponent } from './shared/headers/admin-header/admin-header.component';

import { ModerationComponent } from './pages/moderation/moderation.component';

import { AboutComponent } from './pages/about/about';
import { HelpComponent } from './pages/help/help';
import { TermsComponent } from './pages/terms/terms';
import { PrivacyComponent } from './pages/privacy/privacy';

import { authGuard } from './guards/auth.guard';
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

  { path: 'header-menu', component: HeaderMenuComponent },
  { path: 'admin-header', component: AdminHeaderComponent, canActivate: [roleGuard(['admin'])] },

  { path: 'moderation', component: ModerationComponent },

  // --- Páginas Legales del Footer ---
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent }
];
