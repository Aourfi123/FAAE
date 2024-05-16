import dayjs from 'dayjs';
import { IBordereau } from 'app/shared/model/bordereau.model';
import { IDocument } from 'app/shared/model/document.model';

export interface ILignesDocument {
  id?: number;
  dateDebut?: string | null;
  dateFin?: string | null;
  bordereaus?: IBordereau | null;
  documents?: IDocument | null;
}

export const defaultValue: Readonly<ILignesDocument> = {};
