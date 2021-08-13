import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { HomeComponent } from './pages/home/home.component';
import { NoteComponent } from './pages/note/note.component';
import { P404Component } from './pages/p404/p404.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CameraComponent } from './components/camera/camera.component';
import { FabComponent } from './components/fab/fab.component';
import { BiComponent } from './components/bi/bi.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { SigninComponent } from './pages/signin/signin.component';
import { QuickComponent } from './pages/quick/quick.component';
import { ScrollableDirective } from './directives/scrollable.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoteComponent,
    P404Component,
    NavbarComponent,
    CameraComponent,
    FabComponent,
    BiComponent,
    TimelineComponent,
    SigninComponent,
    QuickComponent,
    ScrollableDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
