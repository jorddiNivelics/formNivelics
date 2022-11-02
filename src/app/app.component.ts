import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'formulario';
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ){
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm = () => this.form = this.formBuilder.group({
    firsName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    city: ['', [Validators.required]],
    birthDay: ['', [Validators.required]],
    typeId:['', [Validators.required]],
    idNumber:['', [Validators.required]],
    password:['', [Validators.required]]
  })
}
