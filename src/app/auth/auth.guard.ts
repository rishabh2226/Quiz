import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GeneralService } from '../services/general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  //isLoggedIn=false;
  constructor(private router: Router,private toastr: ToastrService,private generalService :GeneralService)
  {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean 
  {
    let token=localStorage.getItem('access_token');
    if(token!=null)
    {
      this.generalService.isLoggedIn=true;
      //this.router.navigateByUrl('/dashboard');
      
      return true;
    }
    else
    {
      this.toastr.error("Please login again","Session Expiered");
      this.router.navigateByUrl('/signin');
      return false;
    }
    

  }
  
}
