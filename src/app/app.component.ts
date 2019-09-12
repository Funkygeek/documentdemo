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

  onSubmitUpload(token) {
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

  // downloadFile(): Observable<HttpResponse<Blob>>{
  // 		return this.http.get('http://localhost:8080/employees/download', { responseType: ResponseContentType.Blob });
  //    }

  onSubmitDownload(token, filename) {
    const  headers = new  HttpHeaders().set('Authorization', token);
    this.http.get (`https://devdoc.gravityfusion.com.au/download/${filename}`,  { headers, responseType: 'blob' })
      .subscribe((response: any) => {
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        if (filename) {
          downloadLink.setAttribute('download', filename);
        }
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }
}

export interface Doco {
  filename: string;
  size: number;
  private: boolean;
}
