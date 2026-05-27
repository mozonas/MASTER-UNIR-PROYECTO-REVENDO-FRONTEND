import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageEditComponent } from './user-page-edit';

describe('UserPageEditComponent', () => {
  let component: UserPageEditComponent;
  let fixture: ComponentFixture<UserPageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserPageEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
