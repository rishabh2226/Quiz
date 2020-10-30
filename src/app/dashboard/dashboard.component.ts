import { Component, OnInit } from '@angular/core';
import { Subject } from '../model/Subject.model';
import { Question } from '../model/Question.model';
import { Participant } from '../model/Participant.model';
import { GeneralService } from '../services/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ExamDetails } from '../model/ExamDetail.model';
import { ScoreCard } from '../model/ScoreCard.model';
import { Event } from '../model/Event.model'
import { partition } from 'rxjs';
import { ExamPanelComponent } from '../exam-panel/exam-panel.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  participant : Participant;
  scoreCard:ScoreCard[];
  subjects:Subject[];
  today :string;
  now:number ;
  
  constructor(
    public generalService: GeneralService,
    private toastr:ToastrService,
    private router: Router,
    private examFB : FormBuilder
    ) 
    { 
      
    }

  ngOnInit(): void {
    this.now= Date.now();
    //console.log( this.now);
    this.today =this.now.toString();
    //console.log(this.now);
    this.generalService.isLoggedIn=true;
    this.generalService.examForm=this.examFB.group(
      {
        SubjectID : ['',Validators.required],
        Duration : ['',Validators.required],
        NOQ : ['',Validators.required]
      });
    this.participant=JSON.parse(localStorage.getItem('Participant'));
    

    //settign the scorecard list in UI
    this.setScoreCard();
    //setting the event list on UI
    if(this.generalService.events!=null)
      this.fetchEvents();

    //console.log(this.scoreCard);
  }

  //getter form exam form 

    get subject() {  return this.generalService.examForm.get('SubjectID');  }

    get duration() {  return this.generalService.examForm.get('Duration');  }

    get noq() {  return this.generalService.examForm.get('NOQ');  }
    
  scheduleQuiz()
  {
    this.generalService.getSubjects().subscribe((data :any)=>
    {
        this.subjects=data;
    });
    this.generalService.SYQ=true;
  }

  cancelQuiz()
  {
    this.generalService.SYQ=false;
    this.resetExamForm();
  }

  resetExamForm()
  {
    this.generalService.examForm=this.examFB.group(
      {
        SubjectID : ['',Validators.required],
        Duration : ['',Validators.required],
        NOQ : ['',Validators.required]
      });
  }

  onSubjectChange(event:any)
  {
    let subject=event.target.options[event.target.options.selectedIndex].text;
    //console.log(event.target.options[event.target.options.selectedIndex].text);
    this.generalService.examDetail=new ExamDetails();
    this.generalService.examDetail.SubjectName=subject;
    //console.log(this.generalService.examDetail);
  }

  startQuiz()
  {
      let examForm: ExamDetails=this.generalService.examForm.value;
      let participant:Participant=JSON.parse(localStorage.getItem('Participant'));

      examForm.Email=participant.Email;
      examForm.Name=participant.Name;
      examForm.ParticipantID=participant.ParticipantID;
      examForm.SubjectName=this.generalService.examDetail.SubjectName;

      this.generalService.examDetail=examForm;
      //this.generalService.totalQuestionToDisplay=Math.floor(examForm.Duration/2);
      this.generalService.totalQuestionToDisplay=examForm.NOQ;
      //this.generalService.totalQuestionToDisplay=3
      this.generalService.fetchQuestions(examForm.SubjectID,this.generalService.totalQuestionToDisplay).subscribe((data:Question[])=>
      {
        this.generalService.questions=new Question()[this.generalService.totalQuestionToDisplay];
        this.generalService.questions=data;
        this.generalService.questionsFetched=true;
        this.generalService.second=0; //initial second with 0 
        //this.startTimer();
        this.generalService.durationOfQuiz=examForm.Duration;
        this.router.navigateByUrl('/exam-panel');
      },(err: HttpErrorResponse)=>
      {
        if(err.status==404)
        {
          //this.toastr.warning("No Question was found !","No Content");
          this.generalService.SYQ=true;
          this.resetExamForm();
          this.generalService.questions=new Question()[1];
        }else if(err.status==403)
        {
          //this.toastr.warning("Unauthorised Access!","Access Denied");
          this.generalService.SYQ=true;
          this.resetExamForm();
          this.generalService.questions=new Question()[1];
        }
      });
      
  }

  setScoreCard()
  {
    let participant:Participant=JSON.parse(localStorage.getItem('Participant'));
    this.generalService.getScoreCard(participant.ParticipantID).subscribe(
      (data :ScoreCard[])=>
      {
        this.scoreCard=new ScoreCard()[data.length];
        this.scoreCard=data;
      }
    );
  }

  fetchEvents()
  {
    this.participant=JSON.parse(localStorage.getItem('Participant'));
      this.generalService.fetchEvents(this.participant.ParticipantID).subscribe(
        (data:Event[])=>{
          this.generalService.events=data;
        }
      );
  }

  applyForEvent(event:Event)
  {
    //console.log(event);
    this.generalService.event=event;
    this.router.navigateByUrl('/event-registration');
  }

  showUpcomingEvents(){
    this.now= Date.now();
    this.participant=JSON.parse(localStorage.getItem('Participant'));
    this.generalService.fetchAppliedEvents(this.participant.ParticipantID).subscribe(
      (data:Event[])=>{
        this.generalService.appliedEvents=data;
      }
    );
    this.generalService.showUpcomingEvent=true;
  }

  hideUpcomingEvent(){
    this.generalService.showUpcomingEvent=false;
    this.generalService.appliedEvents=new Event()[1];
  }

  attemptQuiz(event:Event)
  { 

    if(confirm('are you sure want to attempt ?'))
    {
      //console.log(event.ExamEndDuration);

      this.now=Date.now();
      let dur= ((Math.abs( this.now-new Date(event.ExamEndDuration).getTime()))/1000)/60;

      //console.log("dur="+dur);
      let participant:Participant=JSON.parse(localStorage.getItem('Participant'));
      let examForm: ExamDetails=new ExamDetails();

      examForm.Duration=Math.floor(dur);
      examForm.Email=participant.Email;
      examForm.Name=participant.Name;
      examForm.ParticipantID=participant.ParticipantID;
      examForm.SubjectName=event.SubjectName;
      examForm.SubjectID=event.SubjectID;
      examForm.EventID=event.EventID;

      this.generalService.examDetail=examForm;
      this.generalService.totalQuestionToDisplay=event.NOQ;
      event.ParticipantID=participant.ParticipantID;
      //this.generalService.totalQuestionToDisplay=3
      this.generalService.activateParticipation(event).subscribe((data:Question[])=>
      {
        this.generalService.questions=new Question()[this.generalService.totalQuestionToDisplay];
        this.generalService.questions=data;
        this.generalService.questionsFetched=true;
        this.generalService.second=0; //initial second with 0 
        //this.startTimer();
        this.generalService.durationOfQuiz=examForm.Duration;
        this.generalService.eventIsOn=true;
        this.router.navigateByUrl('/exam-panel');
      },(err: HttpErrorResponse)=>
      {
        this.toastr.error("Something went wrong!");
        // if(err.status==404)
        // {
        //   //this.toastr.warning("No Question was found !","No Content");
        //   this.generalService.SYQ=true;
        //   this.resetExamForm();
        //   this.generalService.questions=new Question()[1];
        // }else if(err.status==403)
        // {
        //   //this.toastr.warning("Unauthorised Access!","Access Denied");
        //   this.generalService.SYQ=true;
        //   this.resetExamForm();
        //   this.generalService.questions=new Question()[1];
        // }
      });
    }

  }

  refreshAppliedQuiz()
  {
    this.now= Date.now();
    // let date=new Date();
    // console.log(date.getTime());
    // let d1:Date=new Date('2011/10/09 12:00');
    // let d2:Date=new Date('2011/10/09 13:00');
    // let min=((Math.abs( d1.getTime()-d2.getTime()))/1000)/60;
    // console.log(min);

  }

  viewAllScoreCards()
  {    
    this.router.navigateByUrl('/scorecards');
  }
}
