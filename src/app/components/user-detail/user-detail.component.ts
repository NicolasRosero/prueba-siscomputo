import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user$: Observable<User | undefined>;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.loading = true;
        this.errorMessage = '';
        const id = params.get('id');

        if (id) {
          return this.userService.getUserById(parseInt(id)).pipe(
            catchError(error => {
              this.loading = false;
              this.errorMessage = error.message;
              return of(undefined);
            })
          );
        } else {
          this.loading = false;
          this.errorMessage = 'No se encontró el ID del usuario.';
          return of(undefined);
        }
      })
    );
  }

  ngOnInit(): void {
    this.user$.subscribe(() => {
      this.loading = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
