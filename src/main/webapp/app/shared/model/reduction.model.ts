import dayjs from 'dayjs';
import { ISocieteCommerciale } from 'app/shared/model/societe-commerciale.model';
import { ITarif } from 'app/shared/model/tarif.model';

export interface IReduction {
  id?: number;
  description?: string | null;
  typeOperation?: string | null;
  pourcentage?: number | null;
  dateDebut?: string | null;
  dateFin?: string | null;
  societeCommercial?: ISocieteCommerciale | null;
  tarifs?: ITarif[] | null;
}

export const defaultValue: Readonly<IReduction> = {};
