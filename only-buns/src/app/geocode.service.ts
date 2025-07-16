//servis pomocu kojeg se adresa usera menja u koordinatu na mapi
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GeocodeService {
  constructor(private http: HttpClient) {}

  geocodeAddress(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    return this.http.get<any[]>(url);
  }
}
