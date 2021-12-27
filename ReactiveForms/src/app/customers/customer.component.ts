import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Customer } from './customer';

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

  constructor() { }

  ngOnInit(): void {
    this.customerForm =  new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendCatalog: new FormControl()
    })
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
        sendCatalog: false
    })
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}
