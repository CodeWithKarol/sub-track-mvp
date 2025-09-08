import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubscriptionDialog } from './create-subscription-dialog';

describe('CreateSubscriptionDialog', () => {
  let component: CreateSubscriptionDialog;
  let fixture: ComponentFixture<CreateSubscriptionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubscriptionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubscriptionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
