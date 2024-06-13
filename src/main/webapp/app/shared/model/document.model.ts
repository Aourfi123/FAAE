import dayjs from 'dayjs';
import { IAvoir } from 'app/shared/model/avoir.model';
import { IFacture } from 'app/shared/model/facture.model';
import { ILignesDocument } from 'app/shared/model/lignes-document.model';

export interface IDocument {
  id?: number;
  code?: string | null;
  reference?: string | null;
  montantTotal?: number | null;
  dateCreation?: Date | null;
  dateModification?: Date | null;
  avoir?: IAvoir | null;
  facture?: IFacture | null;
  lignesDocuments?: ILignesDocument[] | null;
}

export const defaultValue: Readonly<IDocument> = {};
