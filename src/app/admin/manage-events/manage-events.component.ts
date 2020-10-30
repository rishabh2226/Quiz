import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Participant } from 'src/app/model/Participant.model';
import { AdminService } from 'src/app/services/admin.service';
import { GeneralService } from 'src/app/services/general.service';
import {Event} from '../../model/Event.model'

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {

  now:number;
  constructor(
    private generalService:GeneralService,
    public adminService:AdminService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.now= Date.now();
    this.generalService.isBackButtonOn=true;
    this.generalService.backButtonLink="/admin";
    this.fetchEvents();
  }
  ngOnDestroy()
  {
    this.generalService.isBackButtonOn=false;
    this.generalService.backButtonLink="";
    console.log("destroy called");   
  }

  fetchEvents()
  {
    let admin :Participant=JSON.parse(localStorage.getItem('Participant'));
    this.adminService.fetchEvents(admin.ParticipantID).subscribe(
      (data:Event[])=>{
          this.adminService.events=data;
      }
    );
  }
  editEvent(event){
    //console.log("event ="+event);
    if(confirm("Are you sure want to edit this event?")) 
    {
      this.adminService.isEventFormOn=true;
      this.adminService.event=event;
      this.router.navigateByUrl('/admin');
    }
  }

}
