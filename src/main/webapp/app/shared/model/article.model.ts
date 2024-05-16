import dayjs from 'dayjs';
import { ITarif } from 'app/shared/model/tarif.model';
import { ILignesBordereau } from 'app/shared/model/lignes-bordereau.model';
import { IDetailsDemande } from 'app/shared/model/details-demande.model';

export interface IArticle {
  id?: number;
  modele?: string | null;
  largeurPneus?: number | null;
  hauteurPneus?: number | null;
  typePneus?: string | null;
  diametre?: number | null;
  photoContentType?: string | null;
  photo?: string | null;
  dateCreation?: string | null;
  tarifs?: ITarif[] | null;
  lignesBordereaus?: ILignesBordereau[] | null;
  detailsDemandes?: IDetailsDemande[] | null;
}

export const defaultValue: Readonly<IArticle> = {};
