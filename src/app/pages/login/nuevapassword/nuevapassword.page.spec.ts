import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevapasswordPage } from './nuevapassword.page';

describe('NuevapasswordPage', () => {
  let component: NuevapasswordPage;
  let fixture: ComponentFixture<NuevapasswordPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NuevapasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
