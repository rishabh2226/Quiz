import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from '../../model/Subject.model';
import { GeneralService } from 'src/app/services/general.service';
import { AdminService } from 'src/app/services/admin.service';
import { Participant } from 'src/app/model/Participant.model';
import { Question } from 'src/app/model/Question.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option } from 'src/app/model/Option.Model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.css']
})
export class ManageQuestionsComponent implements OnInit,OnDestroy {

  // variables for pagination
  config: any;
  totalRecords :any;

  //variables for edit form
  isEditModeOn=false;
  questionForEdit:Question;

  selectedSubject:number=0;
  isSelected:any;
  subjects:Subject[];
  questions:Question[];

  constructor
  (
    private generalService : GeneralService,
    public adminService : AdminService,
    private toastr : ToastrService,
    private router : Router,
    private fb :FormBuilder,
    private activatedRoute:ActivatedRoute
  ) 
  { 
    //this.paginationConfig();
  }

  ngOnInit(): void {
    this.generalService.getSubjects().subscribe((data :any)=>
    {
        this.subjects=data;
    });
    this.adminService.questionAnswerForm = this.fb.group(
      {
        QuestionID: [''],
        SubjectID: [''],
        QuestionText: ['',Validators.required],
        Options: this.fb.array([],[Validators.required]),
        Answer: ['']
      });
      this.generalService.isBackButtonOn=true;
      this.generalService.backButtonLink="/admin";
    // this.adminService.questionAnswerUpdateForm = this.fb.group(
    //   {
    //     SubjectID: [''],
    //     QuestionText: [''],
    //     Options: this.fb.array([this.createOption()]),
    //     Answer: ['']
    //   });
  }

  ngOnDestroy()
  {
    this.adminService.questions=[];
    this.generalService.isBackButtonOn=false;
    this.generalService.backButtonLink="";
    //console.log("destroy called");
  }

  //getter for validation in questionvanswer form
  get question(){   return this.adminService.questionAnswerForm.get('QuestionText');  }
  get opt(): FormArray { return this.adminService.questionAnswerForm.get('Options') as FormArray; } 

  paginationConfig()
  {
    this.config={
      currentPage:1,
      itemsPerPage :4,
      totalItems : this.totalRecords
    };
    this.activatedRoute.queryParams.subscribe(
      params=>this.config.currentPage=params['page'] ? params['page']:1
    );
  }
  onSubjectChnage()
  {
    let admin :Participant=JSON.parse(localStorage.getItem('Participant'));
    this.adminService.fetchQuestionsForAdmin(admin.ParticipantID,this.selectedSubject).subscribe(
      (res: Question[])=>
      {
        this.adminService.questions=new Question()[res.length];
        this.adminService.questions=res;
        this.totalRecords=res.length; 
        this.pageChange(1);
        this.paginationConfig();
      },
      (err: HttpErrorResponse)=>
      {
        console.log(err.status);

          console.log(err);
          this.router.navigateByUrl('/manage-questions');
          this.selectedSubject=0;
      }
    );
  }

  deleteQuestion(question: Question)
  {
    console.log(question);
    if(confirm('are you sure want to delete ? '))
    {
      this.adminService.deleteQuestion(question.QuestionID).subscribe(
        (res:any)=>
        {
          this.toastr.success("Question, Deleted Successfully !");
          this.onSubjectChnage();
        }
      );
    }
  }

  turnEditModeOn(question :Question)
  {
    this.questionForEdit=question;
    //console.log("From DB: "+this.questionForEdit);
    this.isEditModeOn=true;
      this.generalService.getSubjects().subscribe((data :any)=>
      {
        this.subjects=data;
      });
    // this.adminService.questionAnswerForm = this.fb.group(
    //   {
    //     SubjectID: [''],
    //     QuestionText: [''],
    //     Options: this.fb.array([]),
    //     Answer: ['']
    //   });         
      this.adminService.questionAnswerForm.controls['QuestionID'].setValue(this.questionForEdit.QuestionID);
      this.adminService.questionAnswerForm.controls['QuestionText'].setValue(this.questionForEdit.QuestionText);
    
      this.addOption(this.questionForEdit.options.length,this.questionForEdit.options); 
      //console.log(this.adminService.questionAnswerForm);
  }

  createOption(optionText:string,Answer:number,optionID:number): FormGroup {
    return this.fb.group(
      {
        OptionID: [optionID],
        OptionText: [optionText,Validators.required],
        Answer: [Answer]
      });
  }

  addOption(length:number,options:Option[]) { 
    this.adminService.options = this.adminService.questionAnswerForm.get('Options') as FormArray;
    for(var i=0;i<length;i++)
    {

      if(options[i].Answer==1)
        this.isSelected=i+1;
      this.adminService.options.push(this.createOption(options[i].OptionText,options[i].Answer,options[i].OptionID));
    } 
  }

  discard()
  {
    this.isEditModeOn=false;
    this.adminService.options = this.adminService.questionAnswerForm.get('Options') as FormArray;
    this.adminService.options.clear();
    this.adminService.questionAnswerForm.reset();
  }

  onAnswerSelect() {
    this.adminService.questionAnswerForm.controls['Answer'].setValue(this.isSelected);
  }

  onUpdate()
  {
    //console.log(this.isSelected);
    console.log(this.adminService.questionAnswerForm.value);
    this.adminService.saveQuestions(this.adminService.questionAnswerForm.value).subscribe(
      (res:any)=>
      {
        this.toastr.success("Update successful!");
        this.discard();
        this.onSubjectChnage();
      }
    );
  }

  pageChange(newPage :number)
  {
    this.router.navigate(['/manage-questions'],{queryParams: {page : newPage}});
  }
  
}
