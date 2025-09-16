import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingOverview } from './spending-overview';

describe('SpendingOverview', () => {
  let component: SpendingOverview;
  let fixture: ComponentFixture<SpendingOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
