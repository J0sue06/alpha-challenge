import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { Login } from "../../shared/interfaces/Login";
import { UserProfile } from "../../shared/interfaces/User";
import { UsersService } from "../users/users.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/login`;
  userService = inject(UsersService);

  constructor(private http: HttpClient) {}

  login(login: Login): Observable<any> {
    const body = new URLSearchParams();
    body.set("username", login.username);
    body.set("password", login.password);

    const headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );

    return this.http.post<any>(this.apiUrl, body.toString(), { headers });
  }

  storeToken(token: string): void {
    localStorage.setItem("access_token", token);
    
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.storeUserInfo(response);
      },
      error: (e) => {
        console.error("User Profile failed:", e);
      },
    });
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  deleteToken(): void {
    localStorage.removeItem("access_token");
  }

  storeUserInfo(data: UserProfile): void {
    localStorage.setItem("userProfile", JSON.stringify(data));
  }

  getUserInfo(): UserProfile | null {
    const userInfoObj = localStorage.getItem("userProfile") ?? null;
    if (userInfoObj) {
      const userInfoJSON = JSON.parse(userInfoObj);
      let userInfo: UserProfile = {
        username: userInfoJSON?.username,
        email: userInfoJSON?.email,
        rol_id: userInfoJSON?.rol_id,
        rol_name: userInfoJSON?.rol_name,
      };
      return userInfo;
    }
    return null;
  }

  deleteUserInfo(): void {
    localStorage.removeItem("userProfile");
  }
}
