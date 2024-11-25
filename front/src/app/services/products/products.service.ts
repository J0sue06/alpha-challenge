import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductCreate } from '../../shared/interfaces/Product';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  createProducto(producto: ProductCreate): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, producto);
  }

  updateProducto(id: number, producto: ProductCreate): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
