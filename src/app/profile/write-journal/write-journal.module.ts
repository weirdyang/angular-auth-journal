import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field'
import { WriteJournalRoutingModule } from './write-journal-routing.module';
import { WriteJournalComponent } from './write-journal.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [
    WriteJournalComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    WriteJournalRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    SafeHtmlPipe
  ]
})
export class WriteJournalModule { }
