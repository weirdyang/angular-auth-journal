import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Profile, User } from 'src/app/types/user';

@Component({
  selector: 'dm-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  username!: string;
  profile$ = this.userService
  .getProfile(this.username)
  .pipe(
    filter(profile => profile != null)
  );

  constructor(private route: ActivatedRoute, private userService: UserService) {

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
    })
  }

}
