import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearVacante } from './crear-vacante';

describe('CrearVacante', () => {
  let component: CrearVacante;
  let fixture: ComponentFixture<CrearVacante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearVacante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearVacante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
