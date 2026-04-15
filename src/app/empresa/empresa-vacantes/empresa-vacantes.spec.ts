import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaVacantes } from './empresa-vacantes';

describe('EmpresaVacantes', () => {
  let component: EmpresaVacantes;
  let fixture: ComponentFixture<EmpresaVacantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaVacantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaVacantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
