import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Holydays, HolydaysCreate } from '../../shared/interfaces/HolyDays';

@Injectable({
  providedIn: 'root',
})
export class HolydaysService {
  private apiUrl = `${environment.apiUrl}/day_off`;

  constructor(private http: HttpClient) {}

  getHolydays(): Observable<Holydays[]> {
    return this.http.get<Holydays[]>(this.apiUrl);
  }

  createHolyday(dayOff: HolydaysCreate): Observable<any> {
    return this.http.post(this.apiUrl, dayOff);
  }

  updateHolyday(id: number, dayOff: HolydaysCreate): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dayOff);
  }

  deleteHolyday(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
