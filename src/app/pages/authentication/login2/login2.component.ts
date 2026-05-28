import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login2',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css'],
})

export class Login2Component implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    console.log('Datos listos para enviar al servidor:', this.loginForm.value);
  }
}
