import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from '../services/general.service';
import { ScoreCard} from '../model/ScoreCard.model'
import { Question } from '../model/Question.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-exam-panel',
  templateUrl: './exam-panel.component.html',
  styleUrls: ['./exam-panel.component.css']
})
export class ExamPanelComponent implements OnInit {

scoreCard :ScoreCard;
Answer:any;

  constructor
  (
    public generalService: GeneralService,
    private router: Router,
    private toastr:ToastrService
  ) { this.preventRefresh(); }

  ngOnInit(): void {
    this.preventRefresh();
    this.startTimer();
  }

preventRefresh()
{
  window.addEventListener("keyup", disableF5);
  window.addEventListener("keydown", disableF5);
  function disableF5(e) {

    if ((e.which || e.keyCode) == 116) e.preventDefault(); 

 };
}

radioValue(event:any)
{ 
  let c=this.generalService.questionCount;
  this.generalService.questions[c].OptionSelected=event.target.Value;
  //console.log(this.generalService.questions);
}

moveToPreviousQuestion()
{
  
    this.generalService.questionCount--;
    this.Answer=2;
}

moveToNextQuestion()
{
  let c=this.generalService.questionCount;
  let totalQuestion=this.generalService.totalQuestionToDisplay;
  this.Answer=2;
  if(c<totalQuestion)
  {
    this.generalService.questionCount++;
  }
}

generateReport()
{
  this.stopTimer();
  this.generalService.isReportGenerated=true;
  this.scoreCard=new ScoreCard();
  this.scoreCard.EventID=this.generalService.examDetail.EventID;
  this.scoreCard.CorrectAttempts=0;
  this.generalService.questions.forEach((e,i)=>
  {  
    if(this.generalService.questions[i].OptionSelected!=0 || this.generalService.questions[i].OptionSelected == undefined)
    {
      this.generalService.questions[i].options.forEach((ee,ii)=>
      {
          if(this.generalService.questions[i].OptionSelected==this.generalService.questions[i].options[ii].OptionNumber && this.generalService.questions[i].options[ii].Answer == 1)
          {
            this.scoreCard.CorrectAttempts++;
          }     
      });
      this.scoreCard.TotalAttempts++;
    }
    else
    {
      this.scoreCard.EmptyAttempts++;
    }
    
  });
  this.scoreCard.TotalQuestion=this.generalService.totalQuestionToDisplay;
  this.scoreCard.WrongAttempts=this.scoreCard.TotalQuestion-this.scoreCard.CorrectAttempts-this.scoreCard.EmptyAttempts;
  this.scoreCard.Score=this.scoreCard.CorrectAttempts*2;
  this.scoreCard.ParticipantID=this.generalService.examDetail.ParticipantID;
  this.scoreCard.SubjectID=this.generalService.examDetail.SubjectID;
  this.scoreCard.Duration=this.generalService.examDetail.Duration;
  console.warn(this.scoreCard);
  //console.warn(this.generalService.isReportGenerated);

}

discard()
{
  if(this.generalService.eventIsOn)
  {
    this.generalService.eventIsOn=false;
    this.generalService.appliedEvents=[];
    this.generalService.showUpcomingEvent=false;
  }
  else
  {
    this.generalService.SYQ=false;
  }

  this.generalService.questions=new Question()[1];
 // this.generalService.examForm.reset();
  this.scoreCard=new ScoreCard();
  this.generalService.isReportGenerated=false;
  this.generalService.questionCount=0;
  this.generalService.second=0;
  this.stopTimer();
  this.router.navigateByUrl('/dashboard');
}

showAnswer()
{
  this.generalService.questions[this.generalService.questionCount].options.forEach((e,i)=>
  {
    if(this.generalService.questions[this.generalService.questionCount].options[i].Answer==1)
    {
      if(this.Answer==1)
        this.Answer=2;
      else
      this.Answer=1;
    }
  });
}

saveScoreCard()
{
    this.scoreCard.TimeTaken=this.generalService.second;
    this.scoreCard.Duration=this.generalService.examForm.get("Duration").value;
    this.generalService.saveScoreCard(this.scoreCard).subscribe(
    (data: any)=>
    {
        this.toastr.success("Score card saved successfully!","Success");
        this.discard();
    });
}

startTimer()
{
  this.generalService.timer=setInterval(()=>
  {
    if(this.generalService.durationOfQuiz==(this.generalService.second/60))
    {
      this.stopTimer();
      this.generateReport();
    }
    else
    {
      this.generalService.second++;
    }
    
  },1000);
}

stopTimer()
{
    clearInterval(this.generalService.timer);
}

}
