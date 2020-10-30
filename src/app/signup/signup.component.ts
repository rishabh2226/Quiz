import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../services/general.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {Participant} from '../model/Participant.model'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  participant : Participant;
  constructor(private registrationFB: FormBuilder,
    public generalService:GeneralService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    // let participant:Participant=JSON.parse(localStorage.getItem('Participant'));
    // if(participant!=null)
    // {
    //   if(this.generalService.isLoggedIn)
    //   {
        
    //     if(participant.RoleName==='ADMIN')
    //     {
    //       this.router.navigateByUrl('/admin');
    //     }
    //     else if(participant.RoleName==='PARTICIPANT')
    //     {
    //       this.router.navigateByUrl('/dashboard');
    //     }  
    //   }
    //   else
    //     this.router.navigateByUrl('/signin');
    // }
    // else
    //     this.router.navigateByUrl('/signin');

    this.generalService.registrationForm=this.registrationFB.group({
      Name : ['',Validators.required],
      Email : ['',[Validators.required,Validators.email]],
      Password : ['',[Validators.required,Validators.minLength(8)]]
    });
  }

  //getter for registration form 

  get name(){   return this.generalService.registrationForm.get('Name');  }
  get email(){   return this.generalService.registrationForm.get('Email');  }
  get password(){   return this.generalService.registrationForm.get('Password');  } 

  onSignup()
  {
    this.participant=this.generalService.registrationForm.value;
    //console.warn(this.participant);
    this.generalService.saveParticipant(this.participant).subscribe((success)=>{
      this.toastr.success("Participant registered successfully!");
      this.generalService.registrationForm.reset();
      this.router.navigateByUrl('/signin');
    }
    );
  }
}
