import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../services/general.service';
import {Participant} from '../model/Participant.model'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { partition } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  participant : Participant;
  constructor(  private loginFormBuilder: FormBuilder,
    public generalService:GeneralService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    let participant:Participant=JSON.parse(localStorage.getItem('Participant'));
    if(participant!=null)
    {
      if(this.generalService.isLoggedIn)
      {
        
        if(participant.RoleName==='ADMIN')
        {
          this.router.navigateByUrl('/admin');
        }
        else if(participant.RoleName==='PARTICIPANT')
        {
          this.router.navigateByUrl('/dashboard');
        }  
      }
      else
        this.router.navigateByUrl('/signin');
    }
    else
        this.router.navigateByUrl('/signin');

    this.generalService.loginForm=this.loginFormBuilder.group({
      Email : ['',[Validators.required,Validators.email]],
      Password : ['',[Validators.required,Validators.minLength(8)]]
    });
  }
  //getter for login form
  get loginEmail(){   return this.generalService.loginForm.get('Email');  }
  get loginPassword(){   return this.generalService.loginForm.get('Password');  }

  onSignin()
  {
    this.participant=this.generalService.loginForm.value;
    
    this.generalService.authenticateParticipant(this.participant).subscribe((data :any)=>
    {
      //console.log(data);
      this.toastr.success("logged in successfully!");

      localStorage.clear();
      localStorage.setItem("access_token",data.access_token);
      localStorage.setItem("refresh_token",data.refresh_token);
      localStorage.setItem("Participant",data.Participant);
      localStorage.setItem("expires_in",data.expires_in);
      
      this.generalService.isLoggedIn=true;

      let participant:Participant=JSON.parse(localStorage.getItem('Participant'));
      // + uninary operator converts the string to int here
      //this.logoutTimer();
      if(participant.RoleName==='ADMIN')
      {
        this.router.navigateByUrl('/admin');
      }
      else if(participant.RoleName==='PARTICIPANT')
      {
        this.router.navigateByUrl('/dashboard');
      }      
    },
    (err:HttpErrorResponse)=>
    {
     
      this.toastr.warning("wrong credentials!");
    });
  }

  logoutTimer()
  {
    this.generalService.timerForLogout=setInterval(()=>
    {
      if(this.generalService.timeout<=(+localStorage.getItem('expires_in')))
      {
        this.generalService.timeout++; 
        console.log(this.generalService.timeout);
      }
      else  
      {
        console.log("logged out :"+this.generalService.timeout);
        this.toastr.error("Session timeout","", {timeOut: 3000});
        this.generalService.timeout=0;
        this.generalService.logout();
      }
    },1000);
  }
}
