import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationComponent } from './delegation.component';

describe('DelegationComponent', () => {
  let component: DelegationComponent;
  let fixture: ComponentFixture<DelegationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelegationComponent]
    });
    fixture = TestBed.createComponent(DelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
