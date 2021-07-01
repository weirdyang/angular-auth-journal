import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteJournalComponent } from './write-journal.component';

describe('WriteJournalComponent', () => {
  let component: WriteJournalComponent;
  let fixture: ComponentFixture<WriteJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
