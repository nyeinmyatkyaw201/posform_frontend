import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  saveOrder(saveData: Object) {
    return this.http.post('http://localhost:3000/api/v1/posform', saveData);
  }
  getOrder() {
    return this.http.get('http://localhost:3000/api/v1/posform');
  }
  delete(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/posform/${id}`);
  }
  update(id: any,data : any){
  
   return this.http.patch(`http://localhost:3000/api/v1/posform/${id}`,data)
  }
  saveAll(data: any){
    return this.http.post('http://localhost:3000/api/v1/posform/saveall', data)
  }
}
