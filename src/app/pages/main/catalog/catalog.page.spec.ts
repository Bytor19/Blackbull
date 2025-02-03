import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'; // 👈 Importa waitForAsync
import { CatalogPage } from './catalog.page';

describe('CatalogPage', () => {
  let component: CatalogPage;
  let fixture: ComponentFixture<CatalogPage>;

  beforeEach(waitForAsync(() => { // 👈 Usa waitForAsync en lugar de async
    fixture = TestBed.createComponent(CatalogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
