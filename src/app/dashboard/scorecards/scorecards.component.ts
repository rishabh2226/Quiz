import { Component, OnInit } from '@angular/core';
import { Subject } from './../../model/Subject.model';
import { ScoreCard } from 'src/app/model/ScoreCard.model';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-scorecards',
  templateUrl: './scorecards.component.html',
  styleUrls: ['./scorecards.component.css']
})
export class ScorecardsComponent implements OnInit {

  scorecards:ScoreCard[];
  scorecardsTemp:ScoreCard[];
  subjects:Subject[];

  constructor
  (
    private generalService : GeneralService
  ) { }

  ngOnInit(): void {
    //back button config
    this.generalService.isBackButtonOn=true;
    this.generalService.backButtonLink="/dashboard";

    this.fetchSubject();
    //score card initiallization
    this.getAllScoreCards();
  }
  ngOnDestroy()
  {
    this.generalService.isBackButtonOn=false;
    this.generalService.backButtonLink="";
    //console.log("destroy called");   
  }

  getAllScoreCards()
  {
    let participant=JSON.parse(localStorage.getItem('Participant'));
    this.generalService.getAllScoreCards(participant.ParticipantID).subscribe(
      (data : any)=>
      {
        this.scorecards=new ScoreCard()[data.length];
        this.scorecards=data;
        this.scorecardsTemp=data;
      }
    );
  }
  fetchSubject()
  {
    this.generalService.getSubjects().subscribe(
      (data:any)=>
      {
        this.subjects=data;
      }
    );
  }


  filterScorecards(event:any)
  {
    let subject=event.target.value;
    this.scorecards=this.scorecardsTemp.filter(res=>
            {
            return res.SubjectName.toLowerCase().match(subject.toLowerCase());
            });
  }
  datewiseFilter(event:any)
  {
    let date=event.target.value;
    //alert(date);
    this.scorecards=this.scorecardsTemp.filter(res=>
            {
            return res.Date.toString().match(date);
            });
  }
}
