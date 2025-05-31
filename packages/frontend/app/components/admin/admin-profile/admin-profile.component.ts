import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { catchError, of } from "rxjs";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  firstName: string;
}

@Component({
  standalone: true,
  selector: "app-admin-profile",
  styleUrl: "./admin-profile.component.scss",
  templateUrl: "./admin-profile.component.html",
  imports: [CommonModule, RouterModule],
})
export class AdminProfileComponent implements OnInit {
  user: User | null = null;
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.checkAuth();
  }

  private checkAuth(): void {
    this.authService.getCurrentUser().pipe(
      catchError(() => {
        // Если ошибка 404, пробуем получить данные из localStorage
        const savedUser = localStorage.getItem('userProfile');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.isAdmin) {
            this.user = user;
            return of(user);
          }
        }
        this.router.navigate(['/login']);
        return of(null);
      })
    ).subscribe(user => {
      if (user) {
        this.user = user;
        if (!user.isAdmin) {
          this.router.navigate(['/profile']);
        }
        // Сохраняем данные пользователя
        localStorage.setItem('user', JSON.stringify(user));
      }
    });
  }
} 