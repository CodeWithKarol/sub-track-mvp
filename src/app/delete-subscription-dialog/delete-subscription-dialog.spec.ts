import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubscriptionDialog } from './delete-subscription-dialog';

describe('DeleteSubscriptionDialog', () => {
  let component: DeleteSubscriptionDialog;
  let fixture: ComponentFixture<DeleteSubscriptionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSubscriptionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSubscriptionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
