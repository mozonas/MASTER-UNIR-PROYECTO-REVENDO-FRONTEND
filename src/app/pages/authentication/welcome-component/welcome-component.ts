import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-component',
  imports: [],
  templateUrl: './welcome-component.html',
  styleUrl: './welcome-component.css',
})
export class WelcomeComponent {
  constructor(private router: Router) {}


login() {
  this.router.navigate(['/login']);
}

signin() {
  this.router.navigate(['/signin']);
}
}
