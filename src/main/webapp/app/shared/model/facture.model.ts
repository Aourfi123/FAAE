import { IDocument } from 'app/shared/model/document.model';
import { IPaiement } from 'app/shared/model/paiement.model';

export interface IFacture {
  id?: number;
  code?: string | null;
  etat?: string | null;
  document?: IDocument | null;
  paiement?: IPaiement | null;
}

export const defaultValue: Readonly<IFacture> = {};
