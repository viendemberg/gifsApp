import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey    : string    = 'twrzQW4OMK2SOJHUsCXfHMpitFSw2lN9';
  private urlService: string    = 'https://api.giphy.com/v1/gifs';
  private _history  : string[]  = [];

  public results: Gif[] = [];

  get history() {
    return [...this._history];
  }

  constructor(private http: HttpClient) {
    this._history = JSON.parse(localStorage.getItem('historial')!)  || [];
    this.results  = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  searchGifs(query: string = ''): void {
    query = query.trim().toLowerCase();

    if (!this._history.includes(query)) {
      this._history.unshift(query);
      this._history = this._history.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._history));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('1', query);

    this.http
      .get<SearchGifsResponse>(`${this.urlService}/search`, { params })
      .subscribe(response => {
        this.results = response.data;
        localStorage.setItem('resultados', JSON.stringify(this.results));
      });
  }
}
