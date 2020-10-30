export class ExamDetails
{
    SubjectID : number;
    SubjectName : string;
    Duration :number;
    Name : string;
    Email : string;
    ParticipantID : number;
    Score :any;
    NOQ :any;
    EventID: number;
    constructor()
    {
        this.SubjectID =0;
        this.SubjectName ="";
        this.Duration =0;
        this.Name ="";
        this.Email ="";
        this.ParticipantID =0;
        this.Score =0;
        this.NOQ=0;
        this.EventID=0;
    }
}