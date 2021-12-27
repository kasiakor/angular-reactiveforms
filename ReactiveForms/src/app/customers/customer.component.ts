import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Customer } from './customer';

//custom validator
function ratingRange(c: AbstractControl): {[key: string]: boolean} | null {
 if( c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5 )) {
   //if validation is broken key/value pair is returned key for rule, true for error
   return {'range': true};
 }
 //null for not broken rules, formcontrol is valid
 return null;
}
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  //defines form model, associates form element with this root Form Group instance
  customerForm: FormGroup;

  //data model, data send to/from the back end server
  customer = new Customer();

  constructor( private fb:FormBuilder) { }

  ngOnInit(): void {
    //use form builder to build the form model
    //group method takes in control configuration object 
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      notification: 'email',
      sendCatalog: true
    })


    // this.customerForm =  new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl()
    // })
  }
  //update all form data from the component
  // populateTestData(): void {
  //   this.customerForm.setValue({
  //       firstName: "Jack",
  //       lastName: "New",
  //       email: "jack.new@gmail.com",
  //       sendCatalog: false
  //   })
  // }

  //update some form data from the component
  populateTestData(): void {
    this.customerForm.patchValue({
        firstName: "Jack",
        lastName: "New",
        rating: [null, ratingRange],
        sendCatalog: false
    })
  }
  // set validation rule to phone when text notification selected in the form
  setNotification(notifyBy: string): void {
    const phoneControl = this.customerForm.get('phone');
    if( notifyBy === 'text') {
      phoneControl.setValidators(Validators.required)
    }
    else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}
