import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamPanelComponent } from './exam-panel/exam-panel.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AdminComponent } from './admin/admin.component';
import { ManageQuestionsComponent } from './admin/manage-questions/manage-questions.component';
import { ManageEventsComponent } from './admin/manage-events/manage-events.component';
import { EventRegistrationComponent } from './dashboard/event-registration/event-registration.component';
import { ScorecardsComponent } from './dashboard/scorecards/scorecards.component';
import { SubjectFormComponent } from './admin/subject-form/subject-form.component';

const routes: Routes = [
  {path:'' , redirectTo : '/signin', pathMatch : 'full'},
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard]},
  { path: 'exam-panel', component: ExamPanelComponent,canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'admin', component: AdminComponent,canActivate :[AuthGuard]},
  { path: 'manage-questions', component: ManageQuestionsComponent,canActivate :[AuthGuard]},
  { path: 'manage-events', component: ManageEventsComponent,canActivate :[AuthGuard]},
  { path: 'event-registration', component: EventRegistrationComponent,canActivate :[AuthGuard]},
  { path: 'scorecards', component: ScorecardsComponent ,canActivate :[AuthGuard]},
  { path: 'Add-Subject', component: SubjectFormComponent ,canActivate :[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
