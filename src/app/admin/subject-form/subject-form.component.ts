import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'src/app/model/Subject.model';
import { AdminService } from 'src/app/services/admin.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit {

  subjects:Subject[];
  constructor
  (
    public  generalService: GeneralService,
    public adminService: AdminService,
    private fb : FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    //console.log("init called"); 
    this.generalService.isBackButtonOn=true;
    this.generalService.backButtonLink="/admin";

    //create subject Form 
    this.createSubjectForm();
    this.fetchSubjects();
  }


  ngOnDestroy()
  {
    this.generalService.isBackButtonOn=false;
    this.generalService.backButtonLink=""; 
   // console.log("destroy called"); 
  }
//getter for subject input type
  get sub(){   return this.adminService.subjectForm.get('SubjectName');  }

  createSubjectForm()
  {
    this.adminService.subjectForm=this.fb.group(
      {
        SubjectID: [''],
        SubjectName: ['',Validators.required]
      });
  }

  resetSubjectForm()
  {
    this.adminService.subjectForm=this.fb.group(
      {
        SubjectID: [''],
        SubjectName: ['',Validators.required]
      });
  }

  onSubjectFormSubmit()
  {
    //console.log(this.adminService.subjectForm.value);
    this.adminService.savesubject(this.adminService.subjectForm.value).subscribe(
      (data : any)=>{
        this.resetSubjectForm();
        this.toastr.success("Subject Save Successfully!");
        this.subjects=data;
      }
    );
  }

  fetchSubjects()
  {
    this.generalService.getSubjects().subscribe(
      (data :any)=>
      {
        this.subjects=data;
      }
    );
  }

  editSubject(subject:Subject)
  {
    console.log(subject);
    this.adminService.subjectForm.controls['SubjectID'].setValue(subject.SubjectID);
    this.adminService.subjectForm.controls['SubjectName'].setValue(subject.SubjectName);
  }

  deleteSubject(subject:Subject)
  {
    if(confirm("Are you sure want to delete ?"))
    {
      this.adminService.deleteSubject(subject.SubjectID).subscribe(
        (data : any)=>{
          this.toastr.success("Subject deleted Successfully!");
          this.subjects=data;
        }
      );
    }

  }

}
