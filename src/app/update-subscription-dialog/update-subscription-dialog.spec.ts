import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubscriptionDialog } from './update-subscription-dialog';

describe('UpdateSubscriptionDialog', () => {
  let component: UpdateSubscriptionDialog;
  let fixture: ComponentFixture<UpdateSubscriptionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSubscriptionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSubscriptionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
