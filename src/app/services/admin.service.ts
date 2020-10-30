import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormArray, FormGroup } from '@angular/forms';
import {HttpClient,HttpHeaders} from "@angular/common/http"
import { Question } from '../model/Question.model';
import { DataPoint } from '../model/DataPoints.model';
import {Event} from '../model/Event.model'
import { Subject } from '../model/Subject.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  //subjetc form related variables 
     subjectForm:FormGroup;
     isSubjectFormOn=false;


  //event list for manage event page
  events:Event[]=[];
  eventForm:FormGroup;
  event:Event;


  isAddQuestionFormOn=false;
  isEventFormOn=false;
  questionAnswerForm: FormGroup;
  questionAnswerUpdateForm: FormGroup;
  options: FormArray;
  summaryDataPoint: DataPoint[];
  data = [];
  label=[];
  questions:Question[];

  constructor(private http:HttpClient) 
  {}

  saveQuestions(questionOptions:Question)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.post("http://localhost:44361/api/Question",questionOptions,{headers:header});
  }

  fetchSummary(adminID:number)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/Question/"+adminID,{headers : header});
  }

  fetchQuestionsForAdmin(adminID:number,subjectID:number)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/Question/GetQuestionByAdmin/"+adminID+"/"+subjectID,{headers : header});
  }

  deleteQuestion(questionID:number)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/Question/DeleteQuestion?id="+questionID,{headers: header});
  }

  saveEvent(event:Event)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.post("http://localhost:44361/api/Event",event,{headers:header});
  }

  fetchEvents(adminID:number)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/Event/"+adminID,{headers : header});
  }

  savesubject(subject:Subject)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.post("http://localhost:44361/api/Subject/",subject,{headers: header});
  }

  deleteSubject(subjectID:number)
  {
    const header=new HttpHeaders({'Authorization' : 'Bearer '+localStorage.getItem('access_token')});
    return this.http.get("http://localhost:44361/api/Subject/DeleteSubject?id="+subjectID,{headers: header});
  }

}
