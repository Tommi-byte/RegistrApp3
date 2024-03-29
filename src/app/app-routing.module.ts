import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { NologinGuard } from './guards/no-login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    canActivate: [NologinGuard],
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home/profesor',
    loadChildren: () => import('./pages/profesor/profesor.module').then( m => m.ProfesorPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound404/notfound404.module').then( m => m.Notfound404PageModule)
  },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
