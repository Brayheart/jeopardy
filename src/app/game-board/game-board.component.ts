import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';


interface Question {
  question: string;
  answer: string;
  showAnswer: boolean;
  showFinalAnswer: boolean;
  isAnswered: boolean;
}


interface QuestionRow {
  value: number;
  questions: Question[];
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  animations: [
    trigger('flip', [
      state('front', style({ transform: 'rotateY(0)' })),
      state('back', style({ transform: 'rotateY(180deg)' })),
      transition('front <=> back', [
        animate('0.5s')
      ])
    ]),
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0, cursor: 'default'})),
      transition('in <=> out', [
        animate('0.5s')
      ])
    ])
  ]
})

export class GameBoardComponent implements OnInit {

  categories = ['Gartner', 'Research and Advisory', 'Advisors', 'Analysts', 'Know Your Leaders'];
  questionRows: QuestionRow[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('assets/questions.json').subscribe(rawData => {
      // Populate the questionRows array
      rawData.forEach(categoryData => {
        let questionRow: QuestionRow = {
          value: categoryData.value,
          questions: categoryData.questions.map((questionData: any) => {
            return {
              question: questionData.question,
              answer: questionData.answer,
              showAnswer: false,
              isAnswered: false
            }
          })
        };
        this.questionRows.push(questionRow);
      });
    });
  }

  flipCard(question: any) {
    if (question.showAnswer) {
      question.isAnswered = true;
    } else {
      question.showAnswer = true;
    }
  }  
}
