import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {GeneralService} from '../app/services/general.service'
import {AdminService} from '../app/services/admin.service'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule} from 'ngx-toastr'
import {AuthGuard} from '../app/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamPanelComponent } from './exam-panel/exam-panel.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AdminComponent } from './admin/admin.component'
import {ErrorInterceptor} from '../app/Error/error.interceptor';
import { ManageQuestionsComponent } from './admin/manage-questions/manage-questions.component'
import {NgxPaginationModule} from 'ngx-pagination';
import { ManageEventsComponent } from './admin/manage-events/manage-events.component';
import { EventRegistrationComponent } from './dashboard/event-registration/event-registration.component';
import { ScorecardsComponent } from './dashboard/scorecards/scorecards.component';
import { SubjectFormComponent } from './admin/subject-form/subject-form.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    ExamPanelComponent,
    SignupComponent,
    SigninComponent,
    AdminComponent,
    ManageQuestionsComponent,
    ManageEventsComponent,
    EventRegistrationComponent,
    ScorecardsComponent,
    SubjectFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [GeneralService,AuthGuard,AdminService,    
    {
      provide: HTTP_INTERCEPTORS,
      useClass : ErrorInterceptor,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
