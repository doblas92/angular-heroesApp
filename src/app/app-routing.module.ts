import { NgModule, inject } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { map, tap } from 'rxjs';
import { AuthService } from './auth/services/auth.service';

export function authGuard( isLoginPage: boolean, path: string): CanActivateFn {
  return () => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    if( isLoginPage ) {
      return authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => { if( isAuthenticated ) router.navigate([path])} ),
        map( isAuthenticated => !isAuthenticated )
      )
    } else {
      return authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => { if( !isAuthenticated ) router.navigate([path]);} )
      )
    }

  };
}

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    canActivate: [ authGuard( true, './heroes/list' ) ]
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule ),
    canActivate: [ authGuard( false, './auth/login' ) ]
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
