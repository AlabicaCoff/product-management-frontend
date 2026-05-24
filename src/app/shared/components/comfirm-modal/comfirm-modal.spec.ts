import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmModal } from './comfirm-modal';

describe('ComfirmModal', () => {
  let component: ComfirmModal;
  let fixture: ComponentFixture<ComfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComfirmModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComfirmModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
