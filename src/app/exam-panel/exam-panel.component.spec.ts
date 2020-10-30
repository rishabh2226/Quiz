import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPanelComponent } from './exam-panel.component';

describe('ExamPanelComponent', () => {
  let component: ExamPanelComponent;
  let fixture: ComponentFixture<ExamPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
