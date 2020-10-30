export class Event
{
    EventID:number;
    Title:string;
    SubjectID: number;
    StartDate: Date;
    EndDate: Date;
    ExamDate: Date;
    AdminID: number;
    Description: string;
    SubjectName: string;
    ParticipantID:number;
    Duration :number;
    NOP :number ;
    NOQ : number;
    ExamEndDuration :Date;


    constructor(){
        this.EventID=0;
        this.Title="";
        this.SubjectID=0;
        this.StartDate=new Date();
        this.EndDate=new Date();
        this.ExamDate=new Date();
        this.AdminID=0;
        this.Description="";
        this.ParticipantID=0;
        this.Duration=0;
        this.NOP=0;
        this.NOQ=0;
        this.ExamEndDuration=new Date();
    }
}