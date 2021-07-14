import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WriteJournalComponent } from './write-journal.component';
const routes: Routes = [{ path: '', component: WriteJournalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WriteJournalRoutingModule { }
