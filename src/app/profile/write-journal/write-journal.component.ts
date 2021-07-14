import { Component, OnInit } from '@angular/core';
import * as marked from 'marked';
import { AuthService } from 'src/app/services/auth.service';
import { JournalService } from 'src/app/services/journal.service';
import { Journal } from 'src/app/types/journal';
import { IApiResponse } from 'src/app/types/user';

@Component({
  selector: 'dm-write-journal',
  templateUrl: './write-journal.component.html',
  styleUrls: ['./write-journal.component.scss']
})
export class WriteJournalComponent implements OnInit {

  journal!: Journal;
  constructor(private authService: AuthService,
    private journalService: JournalService) { }

  private _converted: string = "";

  get converted() {
    return this.md.parse(this.journal.entry)
  }

  set converted(value) {
    this._converted = value
  }
  submit() {
    this.journalService.post(this.journal)
      .subscribe(
        {
          next: res => {
            const response = res as IApiResponse;
            console.log(response.message);
          },
          error: err => console.log(err)
        }
      );
  }
  preview() {

  }
  md: any = marked.setOptions({});
  ngOnInit(): void {
    this.journal = {
      title: "",
      dateOfEntry: new Date(),
      entry: "",
      user: this.authService.getUser()?.id as string
    }
  }
}
