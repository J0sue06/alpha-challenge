import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User, UserCreate, UserProfile } from "../../shared/interfaces/User";
import { environment } from "../../../environments/environments";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/`);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getUsers(skip = 0, limit = 100): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?skip=${skip}&limit=${limit}`);
  }

  createUser(user: UserCreate): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(
    userId: number,
    updatedData: Partial<UserCreate>
  ): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, updatedData);
  }

  deleteUser(userId: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${userId}`);
  }
}
