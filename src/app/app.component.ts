import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {

  fileData: File = null;
  previewUrl: any = null;
  uploadedFilePath: string = null;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  fileProgress(fileInput: any) {
    this.fileData  =  fileInput.target.files[0]  as File;
    this.preview();
  }

  preview() {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  onSubmit(token) {
    const formData = new FormData();
    formData.append('file', this.fileData);
    const  headers = new  HttpHeaders().set('Authorization', token);

    console.log(`Token`, token);



    this.http.post <Doco>('https://devdoc.gravityfusion.com.au/upload', formData, {headers})
      .subscribe(resp => {
          this.uploadedFilePath =  resp.filename;
          alert('SUCCESS !!');
      });
  }
}

export interface Doco {
  filename: string;
  size: number;
  private: boolean;
}
