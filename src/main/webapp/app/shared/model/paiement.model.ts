import dayjs from 'dayjs';
import { IFacture } from 'app/shared/model/facture.model';

export interface IPaiement {
  id?: number;
  reference?: string | null;
  date?: string | null;
  typePaiement?: string | null;
  facture?: IFacture | null;
}

export const defaultValue: Readonly<IPaiement> = {};
