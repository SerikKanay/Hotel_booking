import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { tap, catchError } from "rxjs/operators";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  firstName: string;
}

interface LoginModel {
  email: string;
  password: string;
}

interface UserModel {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
}

interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login({ email, password }: LoginModel): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.user) {
          localStorage.setItem('userProfile', JSON.stringify(response.user));
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        }
      })
    );
  }

  register({ email, password, firstName, lastName }: UserModel): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { email, password, firstName, lastName });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { observe: "response" }).pipe(
      tap(() => {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('authToken');
      })
    );
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      const user = this.getUserFromStorage();
      if (!user) {
        return throwError(() => new Error('No user found'));
      }
      return of(user);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/users/me`, { headers }).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('userProfile', JSON.stringify(user));
        }
      }),
      catchError(() => {
        const user = this.getUserFromStorage();
        if (user) {
          return of(user);
        }
        return throwError(() => new Error('No user found'));
      })
    );
  }

  getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('userProfile');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isAdmin(): boolean {
    const user = this.getUserFromStorage();
    return user?.isAdmin || false;
  }
}
