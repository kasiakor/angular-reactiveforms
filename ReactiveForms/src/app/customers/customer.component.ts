import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { Customer } from './customer';

//factory function that accepts params and returns Validator function
function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): {[key: string]: boolean} | null => {
    if( c.value !== null && (isNaN(c.value) || c.value < min || c.value > max )) {
      //validation error object
      return {'range': true};
    }
    return null;
   }
}

// //custom validator
// function ratingRange(c: AbstractControl): {[key: string]: boolean} | null {
//  if( c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5 )) {
//    //if validation is broken key/value pair is returned key for rule, true for error
//    return {'range': true};
//  }
//  //null for not broken rules, formcontrol is valid
//  return null;
// }
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
  emailMessage: string;
  
  //add property to store validation messages
  private validationMessages = {
    required: 'Add required email address',
    email: 'Add valid email address'
  };

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses')
  }


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
      rating: [null, ratingRange(1,5)],
      sendCatalog: true,
      //we create the first instance that we add to the form model
      addresses: this.fb.array([this.buildAddress()])
    });

    //subscribe to observable for value changes
    this.customerForm.get('notification').valueChanges.subscribe( value => this.setNotification(value));


    //add watcher on email form control
    const emailControl = this.customerForm.get('email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    )
    .subscribe( value => this.setMessage(emailControl));


    // this.customerForm =  new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl()
    // })
  }
  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      console.log('c errors:', c.errors, typeof(c.errors));
        this.emailMessage = Object.keys(c.errors).map(
          key => console.log('Validation messages key value, that is a message:', this.validationMessages[key])).join(' ')
          console.log('Object keys:',Object.keys(c.errors));
          console.log('Validation messages object:',this.validationMessages);

    };
    console.log(this.customerForm);
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

  //function to be called when we need an instance of the form group fro address
  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      state: '',
      city: '',
      zip: ''
    })
  }

  //update some form data from the component
  populateTestData(): void {
    this.customerForm.patchValue({
        firstName: "Jack",
        lastName: "New",
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
