import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private marker: L.Marker | undefined;

  @Input() initialLocation: { lat: number; lng: number } | null = null;
  @Output() locationSelected: EventEmitter<{ lat: number; lng: number }> = new EventEmitter();

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    // Ako postoji pocetna lokacija koristi je 
    const initialLat = this.initialLocation?.lat || 45.2671;
    const initialLng = this.initialLocation?.lng || 19.8335;

    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    if (this.initialLocation) {
      this.marker = L.marker([this.initialLocation.lat, this.initialLocation.lng]).addTo(this.map);
      // Emituj pocetnu lokaciju da komponenta zna da je lokacija vec postavljena
      this.locationSelected.emit(this.initialLocation);
    }

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([lat, lng]).addTo(this.map);

      // Emitovanje koordinata
      this.locationSelected.emit({ lat, lng });
    });
  }
}