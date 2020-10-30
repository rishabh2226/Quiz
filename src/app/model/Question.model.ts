import {Option} from './Option.Model'

export class Question
{
    QuestionID :number;
    QuestionText: string;
    SubjectID:number;
    options : Option[];
    OptionSelected :number;
    ParticipantID :number;
}