import dayjs from 'dayjs';
import { IDetailsDemande } from 'app/shared/model/details-demande.model';

export interface IDemandeRembourssement {
  id?: number;
  raison?: string | null;
  pieceJointeContentType?: string | null;
  pieceJointe?: string | null;
  etat?: string | null;
  dateCreation?: string | null;
  dateModification?: string | null;
  detailsDemandes?: IDetailsDemande[] | null;
}

export const defaultValue: Readonly<IDemandeRembourssement> = {};
