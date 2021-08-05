import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyCheckComponent } from './key-check.component';

describe('KeyCheckComponent', () => {
  let component: KeyCheckComponent;
  let fixture: ComponentFixture<KeyCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
