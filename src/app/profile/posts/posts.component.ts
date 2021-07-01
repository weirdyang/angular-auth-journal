import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { JournalService } from 'src/app/services/journal.service';

@Component({
  selector: 'dm-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(private journalService: JournalService) { }

  ngOnInit(): void {
    this.journalService.getAllJournals()
      .pipe(
        tap(res => console.log(res)),
        tap(_ => console.log('ok')),
      ).subscribe();
  }

}
