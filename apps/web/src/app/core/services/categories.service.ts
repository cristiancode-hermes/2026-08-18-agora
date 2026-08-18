import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Category, CategoriesResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);

  list() {
    return this.http.get<CategoriesResponse>('/api/categories');
  }
}
