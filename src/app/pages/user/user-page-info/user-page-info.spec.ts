import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageInfoComponent } from './user-page-info';

describe('UserPageInfoComponent', () => {
  let component: UserPageInfoComponent;
  let fixture: ComponentFixture<UserPageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPageInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
