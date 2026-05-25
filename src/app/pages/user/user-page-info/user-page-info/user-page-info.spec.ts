import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageInfo } from './user-page-info';

describe('UserPageInfo', () => {
  let component: UserPageInfo;
  let fixture: ComponentFixture<UserPageInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPageInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
