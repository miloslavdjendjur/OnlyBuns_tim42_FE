import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkTrendsComponent } from './network-trends.component';

describe('NetworkTrendsComponent', () => {
  let component: NetworkTrendsComponent;
  let fixture: ComponentFixture<NetworkTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkTrendsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetworkTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
