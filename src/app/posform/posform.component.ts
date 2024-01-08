import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-posform',
  templateUrl: './posform.component.html',
  styleUrls: ['./posform.component.css'],
})
export class PosformComponent implements OnInit {
  @ViewChild("fileInput")fileInput!: ElementRef;
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private route: ActivatedRoute
  ) {}

  order_id!: number;
  counter_no!: Number;
  casher_name!: String;
  order_date!: Date;
  refund: Boolean = false;
  discount: Boolean = false;
  discount_percentage?: Number | null;
  errors: any = [];
  orders: any = [];
  array: any = [];
  searchText: any;
  pageSize = 10;
  currentPage = 1;
  successMessage: boolean = false;
  importData: any = [];

  ngOnInit(): void {
    this.getDetails();
  }
  toogleRefundNo() {
    this.refund = false;
  }
  toogleRefundYes() {
    this.refund = true;
  }

  // async saveAll() {
  //   length = this.importData.length;
  //   for (let i = 0; i < length; i++){
  //     if(this.orders[i].order_id == this.importData[i].order_id){
  //       return alert('the data with this orderid already exist')
  //     }
  //     var saveData = {
  //       order_id: this.importData[i].order_id,
  //       counter_no: this.importData[i].counter_no,
  //       casher_name: this.importData[i].casher_name,
  //       order_date: this.importData[i].order_date || Date.now(),
  //       refund: this.importData[i].refund,
  //       discount: this.importData[i].discount || false,
  //       discount_percentage: this.importData[i].discount_percentage || 0,
  //     };

  //     await this.api.saveOrder(saveData).subscribe({
  //       next: (res: any) => {
  //         console.log(res, 'response');
  //         this.getDetails();

  //         // this.orders.sort((a: any, b: any) => a.order_id - b.order_id);
  //         // this.successMessage = true;
  //         // setTimeout(() => {
  //         //   this.successMessage = false;
  //         // }, 3000);
  //       },
  //       error: (err: any) => {
  //         this.errors = err.error.errors;
  //         console.log(err.message);
          
  //       },
  //     });
  //   }
  // }

  async saveOrder(form: any) {
    var saveData = {
      order_id: this.order_id,
      counter_no: this.counter_no,
      casher_name: this.casher_name,
      order_date: this.order_date || Date.now(),
      refund: this.refund,
      discount: this.discount || false,
      discount_percentage: this.discount_percentage || 0,
    };
    await this.api.saveOrder(saveData || form).subscribe({
      next: (res: any) => {
        console.log(res, 'response');
        this.orders.push(saveData);

        form.resetForm();
        this.orders.sort((a: any, b: any) => a.order_id - b.order_id);
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false;
        }, 3000);
      },
      error: (err: any) => {
        this.errors = err.error.errors;
        console.log(err.message);
        alert('Something was wrong');
      },
    });
  }
  async getDetails() {
    await this.api.getOrder().subscribe({
      next: (res: any) => {
        console.log(res, 'response');
        this.orders = res.data;
        // ascending orders
        res.data.sort((a: any, b: any) => a.order_id - b.order_id);
        console.log(this.orders);
      },
      error: (err: any) => {
        this.errors = err.error.errors;
        console.log(err.message);
      },
    });
  }
  async deleteData() {
    await this.api.delete(this.order_id).subscribe({
      next: (res: any) => {
        console.log(res, 'response');
        this.getDetails();
      },
      error: (err: any) => {
        this.errors = err.error.errors;
        alert('something was wrong');
      },
    });
  }
  async update() {
    var saveData = {
      order_date: this.array.order_date || Date.now(),
      counter_no: this.array.counter_no,
      casher_name: this.array.casher_name,
      refund: this.array.refund,
      discount: this.array.discount,
      discount_percentage: this.array.discount_percentage

    };
    await this.api.update(this.array.order_id, saveData).subscribe({
      next: (res: any) => {
        console.log(res, 'response');
        this.getDetails();
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false;
        }, 3000);
      },
      error: (err: any) => {
        this.errors = err.error.errors;
        console.log(err.message);
        alert('something was wrong');
      },
    });
  }
  getid(id: any) {
    this.order_id = id;
  }
  getarray(data: any) {
    this.array = data;
  }
  clearform(form: any) {
    form.resetForm();
  }
  clearPercentage() {
    if (this.discount === false) {
      this.discount_percentage = null;
    }
  }
  //export Excel
  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.readFile(file);
    }
  }

  readFile(file: any) {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, {
        type: 'binary',
      });

      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convert the worksheet to an array of objects
      const excelData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
      });

      // Process the Excel data as needed
      console.log(excelData);
      // this.saveOrder(excelData)
      this.importData = excelData
      if(this.orders.order_id && this.importData.order_id == this.orders.order_id){
        var message = 'order with this order_id already exists'
      }
     
       this.api.saveAll(excelData).subscribe({
      
        next: (res: any) => {
          console.log(res, 'response');
          this.getDetails();
        },
        error: (err: any) => {
          this.errors = err.error.errors;
          alert(`${message}`);
          console.log(">>>>>>>>>>>>>")
        },
      });
     
    };

    reader.readAsBinaryString(file);
  }
  openFileInput() {
    // Trigger a click on the hidden file input
    this.fileInput.nativeElement.click();
  }

}
