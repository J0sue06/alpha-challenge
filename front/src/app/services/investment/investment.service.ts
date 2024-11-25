import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Investment, InvestmentCreate } from '../../shared/interfaces/Investment';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private apiUrl = `${environment.apiUrl}/investment`;

  constructor(private http: HttpClient) {}

  calculateInvestment(data: InvestmentCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/calculate_investment`, data);
  }

  getInvestments(): Observable<Investment[]> {
    return this.http.get<Investment[]>(this.apiUrl);
  }

  deleteInvestment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
