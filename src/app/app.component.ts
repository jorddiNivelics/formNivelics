import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {startWith, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'formulario';
  form: FormGroup;
  RegExpression = /[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+/;
  typeDocument =[
    {
      id:1,
      value: 'Cédula de Ciudadanía'
    },
    {
      id:2,
      value: 'Pasaporte'
    },
    {
      id:3,
      value: 'Cédula de extranjeria'
    }
  ];

  messageError:string ='';
  ciudades: any[] = [];
  filteredCity: Observable<string[]>;
  maxDate: Date;// fecha minima de edad

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    ){
      this.buildForm();
      this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.validateRequired(1);
    this.getUseraddress().subscribe((response)=>{
      this.setCities(response);
    });
    this.form.get('city').valueChanges.subscribe((val) => {
      if (val) {
        let filter = this.ciudades.filter(item => item === val);
        if(filter.length <= 0){
          this.form.get('city').setErrors({pattern:'error'})
        }
      }
    });
  }

  buildForm = () => this.form = this.formBuilder.group({
    firsName: ['', [Validators.required, Validators.pattern('^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$'), Validators.minLength(3), Validators.maxLength(15)]],
    lastName: ['', [Validators.required, Validators.pattern('^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$'), Validators.minLength(3), Validators.maxLength(15)]],
    typeId:[1, [Validators.required]],
    idNumber:['',],
    phoneNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')]],
    city: ['', [Validators.required]],
    birthDay: ['', [Validators.required]],
    email:['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\\.[a-zA-Z]{2,4}$")]],
    password:['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],
  })

  register(){
    this.form.markAllAsTouched();
  }

  validateRequired(typeId){
    let validators = [Validators.required];

    switch (typeId) {
      case 1:
        validators.push(Validators.required,Validators.minLength(5), Validators.maxLength(10), Validators.pattern('^[0-9]*$'));
        this.messageError = 'La cédula '
        break;
      case 2:
        validators.push(Validators.required, Validators.minLength(5), Validators.maxLength(10), Validators.pattern('^[A-Z0-9]*$'));
        this.messageError = 'El pasaporte '
        break;
      case 3:
        validators.push(Validators.required, Validators.minLength(5), Validators.maxLength(10), Validators.pattern('^[0-9]*$'));
        this.messageError = 'La cédula '
        break;

      default:
        break;
    }
    this.form.controls['idNumber'].setValidators(validators)
  }

  getUseraddress(): Observable<any> {
    const url = 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json';
    return this.httpClient.get<any>(url);
  }

  setCities(response){
    response.map(item => item.ciudades.forEach(item => this.ciudades.push(item)))
    this.filteredCity = this.form.controls['city'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(city: string): string[] {
    const filterValue = this._normalizeValue(city);
    return this.ciudades.filter(ciudad => this._normalizeValue(ciudad).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
