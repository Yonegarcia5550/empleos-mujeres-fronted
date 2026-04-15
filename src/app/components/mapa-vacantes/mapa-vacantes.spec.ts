import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaVacantes } from './mapa-vacantes';

describe('MapaVacantes', () => {
  let component: MapaVacantes;
  let fixture: ComponentFixture<MapaVacantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaVacantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaVacantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
