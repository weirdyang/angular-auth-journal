import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WriteJournalRoutingModule } from './write-journal-routing.module';
import { WriteJournalComponent } from './write-journal.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WriteJournalComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    WriteJournalRoutingModule
  ],
  exports: [
    SafeHtmlPipe
  ]
})
export class WriteJournalModule { }
