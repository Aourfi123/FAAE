import dayjs from 'dayjs';
import { IClientBordereau } from 'app/shared/model/client-bordereau.model';
import { ILignesBordereau } from 'app/shared/model/lignes-bordereau.model';
import { ILignesDocument } from 'app/shared/model/lignes-document.model';

export interface IBordereau {
  id?: number;
  reference?: string | null;
  etat?: string | null;
  montantTotal?: number | null;
  dateCreation?: string | null;
  dateModification?: string | null;
  clientBordereaus?: IClientBordereau[] | null;
  lignesBordereaus?: ILignesBordereau[] | null;
  lignesDocuments?: ILignesDocument[] | null;
}

export const defaultValue: Readonly<IBordereau> = {};
