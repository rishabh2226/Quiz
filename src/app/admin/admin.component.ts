import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from '../model/Subject.model';
import { Question } from '../model/Question.model';
import { DataPoint } from '../model/DataPoints.model';
import { AdminService } from '../services/admin.service';
import { GeneralService } from '../services/general.service';
import { Participant } from '../model/Participant.model';
import { Chart } from 'node_modules/chart.js';
import { Event } from '../model/Event.model'
import { formatDate } from '@angular/common'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isSelected: number;
  subjects: Subject[];
  summaryDataPoint: DataPoint[];
  data :number[]= [2,4,5,3,7];
  label:string[]=["php","java","c++","C","python"];


  constructor(
    public adminService: AdminService,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private toastr: ToastrService) 
    {
     
    }

  ngOnInit(): void {
    

    this.generalService.isLoggedIn = true;



    this.adminService.questionAnswerForm = this.fb.group(
      {
        SubjectID: ['',Validators.required],
        QuestionText: ['',Validators.required],
        Options: this.fb.array([this.createOption()],[Validators.required]),
        Answer: ['']
      });

      //console.log(this.adminService.event);
      if(this.adminService.event!=null)
      {
        this.editEvent(this.adminService.event);
      }
      else
      {
        this.adminService.eventForm = this.fb.group(
          {
            SubjectID: ['',Validators.required],
            Title:['',Validators.required],
            StartDate: ['',Validators.required],
            EndDate: ['',Validators.required],
            ExamDate: ['',Validators.required],
            AdminID: [''],
            Description: ['',Validators.required],
            Duration : ['',Validators.required],
            NOQ : ['',Validators.required]
          });
      }

      if(this.adminService.summaryDataPoint!=null)
      {
        this.chart(this.adminService.summaryDataPoint);
      }else
      {
        this.subscribeToSummary();
      }
      
      //console.log(this.adminService.summaryDataPoint);
     // console.log(this.summaryDataPoint);
  }
//getter for validation in questionvanswer form
  get subject(){   return this.adminService.questionAnswerForm.get('SubjectID');  }
  get question(){   return this.adminService.questionAnswerForm.get('QuestionText');  }
  get opt(): FormArray { return this.adminService.questionAnswerForm.get('Options') as FormArray; } 

// getter for validation of event registration form

  get subjectID(){   return this.adminService.eventForm.get('SubjectID');  }
  get duration(){   return this.adminService.eventForm.get('Duration');  }
  get noq(){   return this.adminService.eventForm.get('NOQ');  }
  get description(){   return this.adminService.eventForm.get('Description');  }
  get title(){   return this.adminService.eventForm.get('Title');  }
  get examDate(){   return this.adminService.eventForm.get('ExamDate');  }
  get startDate(){   return this.adminService.eventForm.get('StartDate');  }
  get endDate(){   return this.adminService.eventForm.get('EndDate');  }
  
  createOption(): FormGroup {
    return this.fb.group(
      {

        OptionText: ['',[Validators.required]],
        Answer: [0]
      });
  }
  addOption() 
  {
    this.adminService.options = this.adminService.questionAnswerForm.get('Options') as FormArray;
    //let len=this.adminService.options.length;
    this.adminService.options.push(this.createOption());
    //console.log(this.adminService.questionAnswerForm);
  }

  deleteOption(length:number)
  {
    this.adminService.options = this.adminService.questionAnswerForm.get('Options') as FormArray;
    this.adminService.options.removeAt(length-1);
  }

  showAddQuestionForm() {
    this.adminService.isAddQuestionFormOn = true;
    this.adminService.isSubjectFormOn=true;
    this.generalService.getSubjects().subscribe((data: any) => {
      this.subjects = data;
    });
  }
  showEventForm()
  {
    this.adminService.isEventFormOn = true;
    this.adminService.isSubjectFormOn=true;
    this.generalService.getSubjects().subscribe((data: any) => {
      this.subjects = data;
    });
  }
  onAnswerSelect() {
    this.adminService.questionAnswerForm.controls['Answer'].setValue(this.isSelected);
  }
  onSubmit() {

    let admin: Participant = JSON.parse(localStorage.getItem('Participant'));
    let questionOptions: Question = this.adminService.questionAnswerForm.value;
    questionOptions.ParticipantID = admin.ParticipantID;

    this.adminService.saveQuestions(questionOptions).subscribe(
      (data: any) => {
        this.toastr.success("Question added Successfully!");
        this.resetForm('addQuestion');
        this.isSelected=0;
        this.subscribeToSummary();
      }
    );
  }
  onEventSubmit()
  {
    console.log(this.adminService.eventForm.value);
    let admin:Participant=JSON.parse(localStorage.getItem('Participant'));
    let event:Event=this.adminService.eventForm.value;
    event.AdminID=admin.ParticipantID;
    this.adminService.saveEvent(event).subscribe(
      (res:any)=>{
        this.toastr.success("Event saved Successfully!","",{timeOut: 2000});
        //this.adminService.isEventFormOn=false;
        this.resetForm('event');
      }
    );
  }
  resetForm(value:string) {
    if(value==='event')
    {
      this.adminService.eventForm = this.fb.group(
        {
          SubjectID: ['',Validators.required],
          Title:['',Validators.required],
          StartDate: ['',Validators.required],
          EndDate: ['',Validators.required],
          ExamDate: ['',Validators.required],
          AdminID: [''],
          Description: ['',Validators.required],
          Duration : ['',Validators.required],
          NOQ : ['',Validators.required]
        });
    }
    else if(value==='addQuestion')
    {
      this.adminService.questionAnswerForm = this.fb.group(
        {
          SubjectID: ['',Validators.required],
          QuestionText: ['',Validators.required],
          Options: this.fb.array([this.createOption()],[Validators.required]),
          Answer: ['']
        });
    }
    
  }

  subscribeToSummary() {
    let admin: Participant = JSON.parse(localStorage.getItem('Participant'));

    this.adminService.fetchSummary(admin.ParticipantID).subscribe(
      (data:any) => {
        this.adminService.summaryDataPoint=data;
        this.summaryDataPoint=data;
        this.chart(data);
        console.log(data);
      }
    );
  }

  discard(value)
  {
    if(confirm('are you sure to discard changes?'))
    {
      if(value==='event')
      {
        this.adminService.isEventFormOn=false;    
        this.adminService.isSubjectFormOn=false;
      }
      else if(value==='addQuestion')
      {
        this.adminService.isAddQuestionFormOn=false;
        this.adminService.isSubjectFormOn=false;
        this.isSelected=0;
      }
      this.resetForm(value);
    }
  }

  chart(d: DataPoint[])
  {
    let data :number[]=[];
    let label :string[]=[];
    d.forEach(function(item:DataPoint)
    {
      data.push(item.y);
      label.push(item.name);
    });
    var myChart = new Chart("myChart", {
      type: 'pie',
      data: {
          labels: label,
          datasets: [{
              label: '# of Votes',
              data: data,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
  }

  editEvent(event:Event){
    this.generalService.getSubjects().subscribe((data: any) => {
      this.subjects = data;
    });
    //console.log(event);
    this.adminService.eventForm.controls['Title'].setValue(event.Title);
    this.adminService.eventForm.controls['Duration'].setValue(event.Duration);
    this.adminService.eventForm.controls['NOQ'].setValue(event.NOQ);
    this.adminService.eventForm.controls['Description'].setValue(event.Description);
    this.adminService.eventForm.controls['SubjectID'].setValue(event.SubjectID);
    this.adminService.eventForm.controls['ExamDate'].setValue(formatDate(event.ExamDate,'yyyy-MM-dd', 'en'));
    this.adminService.eventForm.controls['StartDate'].setValue(formatDate(event.StartDate,'yyyy-MM-dd', 'en'));
    this.adminService.eventForm.controls['EndDate'].setValue(formatDate(event.EndDate,'yyyy-MM-dd', 'en'));
    this.adminService.eventForm.addControl("EventID",this.fb.control(event.EventID));
  }


}
