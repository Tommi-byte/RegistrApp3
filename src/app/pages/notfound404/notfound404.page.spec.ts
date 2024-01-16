import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notfound404Page } from './notfound404.page';

describe('Notfound404Page', () => {
  let component: Notfound404Page;
  let fixture: ComponentFixture<Notfound404Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Notfound404Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
