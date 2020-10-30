export class ScoreCard
{
    ParticipantID : number; 
    Name : string;
    SubjectID : number;
    SubjectName :string;
    Score : number;
    TotalQuestion :number;
    Duration : number;
    TotalAttempts: number;
    CorrectAttempts: number;
    WrongAttempts: number;
    EmptyAttempts: number;
    TimeTaken :number;
    Date :Date;
    EventID :number;
    Title :string;

    constructor()
    {
        this.ParticipantID =0; 
        this.Name ="";
        this.SubjectID =0;;
        this.SubjectName ="";
        this.Score =0;
        this.TotalQuestion =0;
        this.Duration =0;
        this.TotalAttempts=0;
        this.CorrectAttempts=0;
        this.WrongAttempts=0;
        this.EmptyAttempts=0;
        this.TimeTaken=0;
        this.Date=new Date();
        this.EventID=0;
        this.Title="";
    }
}