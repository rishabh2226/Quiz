import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { partition } from 'rxjs';
import { Participant } from 'src/app/model/Participant.model';
import { GeneralService } from 'src/app/services/general.service';
import { Event } from '../../model/Event.model';

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css']
})
export class EventRegistrationComponent implements OnInit {

  participant:Participant;
  event:Event;
  constructor
  (
    public generalService:GeneralService,
    private router:Router,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void 
  {
    if(this.generalService.event==null)
    {
      this.router.navigateByUrl('/dashboard');
    }
    this.participant=JSON.parse(localStorage.getItem('/Participant'));
    this.event=this.generalService.event;
    //console.log(this.generalService.event);
  }
  discard(){
    if(confirm('Press "ok" to leave this page !'))
    {
      this.router.navigateByUrl('/dashboard');
    }
  }
  applyForEvent(event:Event)
  {
    if(confirm('press "ok" to confirm your participation !'))
    {
      let participant:Participant=JSON.parse(localStorage.getItem('Participant'));
      event.ParticipantID=participant.ParticipantID;
      //console.log(event);
      //console.log(participant);
      
      this.generalService.applyForEvent(event).subscribe(
        (res:any)=>{
          this.toastr.success("Applied successfully!");
          this.router.navigateByUrl('/dashboard');
        }
      );
    }
  }

}
