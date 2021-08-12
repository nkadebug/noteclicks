import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NoteComponent } from './pages/note/note.component';
import { P404Component } from './pages/p404/p404.component';
import { TimelineComponent } from './pages/timeline/timeline.component';

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'timeline',
    component:TimelineComponent
  },
  {
    path:'note/:id',
    component:NoteComponent
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo:'home'
  },
  {
    path:'**',
    component:P404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
