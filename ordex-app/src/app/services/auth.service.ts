import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

interface JwtPayload {
  sub: string;
  authorities: string[];
  iat: number;
  exp: number;
  userId: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  username: any;
  email: any;
  roles: any;
  accessToken!: string;
  userId: string | null = null;

  private jwtHelper = new JwtHelperService();
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private httpClient: HttpClient, private router: Router) {
    this.loadFromLocalStorage();
  }

  register(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.httpClient.post(`${this.baseUrl}/register`, body);
  }

  verifyRegister(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.httpClient.post(`${this.baseUrl}/verifyregister`, body);
  }

  verifyRegisterCode(email: string, code: string, username: string, password: string): Observable<any> {
    const body = { email, code, username, password };
    return this.httpClient.post(`${this.baseUrl}/verify-register-code`, body);
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/login`, {
      username,
      password
    });
  }

  getUserId(): string | null {
    return this.userId;
  }

  loadProfile(data: any): void {
    this.isAuthenticated = true;
    this.accessToken = data['access-token'];
    localStorage.setItem('access-token', this.accessToken);
    const decodedJwt = this.jwtHelper.decodeToken<JwtPayload>(this.accessToken);
    this.username = decodedJwt?.sub;
    this.email = decodedJwt?.email || null;
    this.roles = decodedJwt?.authorities || [];
    this.userId = decodedJwt?.userId || null;
  }

  loadFromLocalStorage(): void {
    const token = localStorage.getItem('access-token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.accessToken = token;
      const decodedJwt = this.jwtHelper.decodeToken<JwtPayload>(this.accessToken);
      this.username = decodedJwt?.sub;
      this.email = decodedJwt?.email || null;
      this.roles = decodedJwt?.authorities || [];
      this.userId = decodedJwt?.userId || null;
      this.isAuthenticated = true;
    }
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem('access-token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.accessToken = token;
      return this.accessToken;
    }
    return null;
  }

  isUserAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.username = null;
    this.roles = null;
    this.userId = null;
    this.email = null;
    this.accessToken = '';
    localStorage.removeItem('access-token');
    this.router.navigate(['/home/main']);
  }

  hasRole(role: string): boolean {
    return this.roles?.includes(role);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/forgot-password`, { email });
  }

  verifyResetCode(code: string, password: string, email: string): Observable<any> {
    const body = { email, code, password };
    return this.httpClient.post(`${this.baseUrl}/verify-code`, body);
  }

  requestRegisterCode(email: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/verify-register`, { email });
  }
}
