import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private generalService:GeneralService,
        private router : Router,
        private toastr :ToastrService
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let token =localStorage.getItem('access_token');
            //console.warn("Error Page : "+token);
            if ([401].includes(err.status)) 
            {
                this.toastr.error("Session Expiered! ","",{timeOut: 3000 });  
                this.generalService.logout();
            }
            else if([403].includes(err.status))
            {               
                this.toastr.error("Access Denied !");
            }
            else if([400].includes(err.status))
            {               
                this.toastr.error("Server can't respond !","Bad request");
            }
            else if([404].includes(err.status))
            {               
                this.toastr.error("No content found !");
            }
            else if([500].includes(err.status))
            {               
                this.toastr.error("Internal error occured!");
            }
            else if([0].includes(err.status))
            {               
                this.toastr.error("Couldn't connect to the server!");
                //this.generalService.logout();
            }
            else
            {
                this.toastr.error("Something went wrong!");
            }

            const error = (err && err.error && err.error.message) || err.statusText;
            console.error(err);
            return throwError(error);
        }))
    }
}