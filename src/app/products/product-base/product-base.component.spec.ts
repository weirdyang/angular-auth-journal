import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBaseComponent } from './product-base.component';

describe('ProductBaseComponent', () => {
  let component: ProductBaseComponent;
  let fixture: ComponentFixture<ProductBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
