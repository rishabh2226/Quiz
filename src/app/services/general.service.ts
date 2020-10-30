import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {HttpClient,HttpHeaders} from "@angular/common/http"
import { Participant } from '../model/Participant.model';
import {ExamDetails} from '../model/ExamDetail.model'
import { Question } from '../model/Question.model';
import { ScoreCard } from '../model/ScoreCard.model';
import { ToastrService } from 'ngx-toastr';
import {  Router } from '@angular/router';
import { Event } from '../model/Event.model'


@Injectable({
  providedIn: 'root'
})
export class GeneralService {


  //variables for upcoming events of participant
    showUpcomingEvent=false;
  //variable for events
    events:Event[]=[];
    event:Event;

    appliedEvents:Event[]=[];

    eventIsOn=false;

  //variable for back button
    isBackButtonOn=false;
    backButtonLink:string;
  //logoutTImer variable
  timeout:number=0;
  timerForLogout :any;

  //flag variables
  SYQ:boolean=false;
  isReportGenerated=false;
  isLoggedIn=false;

  //exam relaed varialbs
  questionCount:number=0;
  totalQuestionToDisplay: number=0;
  examDetail: ExamDetails;
  questions : Question[];
  questionsFetched: boolean=false;

  //form related variables
  registrationForm: FormGroup;
  loginForm :FormGroup;
  examForm :FormGroup;

  //header
   header:any;

//timer variables
  durationOfQuiz: number;
  second :any;
  timer :any;

  constructor
  (
    private http : HttpClient,
    private toastr:ToastrService,
    private router: Router
  ) {  

      let token=localStorage.getItem('access_token');
      if(token!=null)
      {
        this.isLoggedIn=true;
      }
  }

  saveParticipant(participant: Participant)
  {
    console.warn(participant);
    return this.http.post('http://localhost:44361/api/Participant',participant);   
  }

  authenticateParticipant(participant:Participant)
  {   
    let data = "username="+participant.Email+"&password="+participant.Password+"&grant_type=password";
    this.header=new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded'});
    return this.http.post("http://localhost:44361/token",data,{headers : this.header});
  }

  refreshToken()
  {   
    let refresh_token=localStorage.getItem("refresh_token");
    let data = "refresh_token="+refresh_token+"&grant_type=refresh_token";
    //this.header=new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded'});
    return this.http.post("http://localhost:44361/token",data);
  }

  getSubjects()
  {
    this.header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    //console.log(header);
    return this.http.get('http://localhost:44361/api/Subject',{ headers : this.header});
  }

  fetchQuestions(subjectID:number,noOfQuestion)
  {
    this.header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/Question/GetQuestion/"+subjectID+"/"+noOfQuestion,{headers : this.header});
  }

  displayTimeElapsed()
  {
    return Math.floor(this.second/3600)+":"+Math.floor(this.second/60)+":"+Math.floor(this.second % 60);
  }

  saveScoreCard(scoreCard:ScoreCard)
  {
    this.header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.post("http://localhost:44361/api/ScoreCard",scoreCard,{headers: this.header});
  }

  getScoreCard(participantID:number)
  {
    this.header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/ScoreCard/"+participantID,{headers : this.header});
  }

  logout()
  {
    localStorage.removeItem("access_token");
    localStorage.removeItem("Participant");
    localStorage.clear();   
    //console.log(this.timeout)
    clearInterval(this.timerForLogout);
    //this.loginForm.reset();
    this.isLoggedIn=false;
    this.toastr.warning("Logged out successfully","",{timeOut: 3000});
    this.router.navigateByUrl('/signin');   
    
  }

  roleMatch(allowedRole :string): boolean 
  {
    var isMatched=false;
    var participant:Participant=JSON.parse(localStorage.getItem('Participant'));
    var userRole:string=participant.RoleName;
    if(userRole===allowedRole)
    {
      isMatched=true;
    }
    return isMatched;
  }

  fetchEvents(participantID:number)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/Event/GetEvents/"+participantID,{headers : header});
  }

  fetchAppliedEvents(participantID:number)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/Event/GetAppliedEvents/"+participantID,{headers : header});
  }
  
  applyForEvent(event:Event)
  {
    this.header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.post("http://localhost:44361/api/Participation",event,{headers: this.header});
  }

  activateParticipation(event:Event){
    this.header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.post("http://localhost:44361/api/Event/ActivateParticipation",event,{headers: this.header});
  }
  
  getAllScoreCards(participantID:number)
  {
    this.header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/ScoreCard/getAllScoreCards/"+participantID,{headers : this.header});
  }
  
  
}
