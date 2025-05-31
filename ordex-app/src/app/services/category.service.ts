import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { Category } from '../models/category';
import { CategoryDetails } from '../models/categoryDetails';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends AbstractCrudService<Category> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/categories');
  }
  getCategoryDetails(): Observable<CategoryDetails[]> {
    return this.http.get<CategoryDetails[]>(`${this.apiUrl}/details`);
  }

}
