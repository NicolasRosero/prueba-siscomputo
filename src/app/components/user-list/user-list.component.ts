import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;
  filter = new FormControl('');
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.users$ = combineLatest([
      this.userService.getAllUsers()
        .pipe(
          catchError((error) => {
            this.errorMessage = error.message;
            return [];
          })
        ),
      this.filter.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([users, filterString]) =>
        users.filter((user) => user.name.toLowerCase().includes(filterString?.toLowerCase() || ''))
      )
    );
  }

  ngOnInit(): void {}

  seeDetails(user: User) {
    this.router.navigate(['/user', user.id]);
  }
}
