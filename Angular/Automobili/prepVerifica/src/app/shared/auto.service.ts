import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStorageService } from './datastorage.service';

@Injectable({
  providedIn: 'root',
})
export class AutoService {
  public marche;
  public modelloSelezionato;
  public modelli;
  public automobili;
  public veicoloSelezionato;
  public prezzoVeicoloSelezionato: number;

  constructor(private datastorage: DataStorageService) {}

  getMarche = () => {
    this.datastorage.sendGetRequest('marche').subscribe(
      (data) => {
        this.marche = data;
      },
      (err) => console.error('GET_MARCHE', err)
    );
  };

  getModelli = (idMarca) => {
    this.datastorage.sendGetRequest(`modelli?codMarca=${idMarca}`).subscribe(
      (data) => {
        this.modelli = data;
      },
      (err) => console.error('GET_MODELLI', err)
    );
  };

  getModello = (idModello) => {
    this.datastorage.sendGetRequest(`modelli/${idModello}`).subscribe(
      (data) => {
        this.modelloSelezionato = data;
      },
      (err) => console.error('GET_MODELLI', err)
    );
  };

  getCars = (idModello) => {
    this.datastorage
      .sendGetRequest(`automobili?codModello=${idModello}`)
      .subscribe(
        (data) => {
          this.automobili = data;
        },
        (err) => console.error('GET_MODELLI', err)
      );
  };

  getDetails = (idCar) => {
    this.datastorage.sendGetRequest(`automobili/${idCar}`).subscribe(
      (data) => {
        this.veicoloSelezionato = data;
        this.prezzoVeicoloSelezionato = this.veicoloSelezionato.prezzo;
        this.getModello(this.veicoloSelezionato?.codModello);
      },
      (err) => console.error('GET_DETAILS', err)
    );
  };

  deleteAuto = (idAuto): Observable<any> =>
    this.datastorage.sendDeleteRequest(`automobili/${idAuto}`);

  updatePrice = () => {
    this.datastorage
      .sendPatchRequest(`automobili/${this.veicoloSelezionato.id}`, {
        prezzo: this.prezzoVeicoloSelezionato,
      })
      .subscribe(
        () => console.log('done'),
        (err) => console.error(err)
      );
  };
}
