import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageEdit } from './user-page-edit';

describe('UserPageEdit', () => {
  let component: UserPageEdit;
  let fixture: ComponentFixture<UserPageEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPageEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
