import { IDocument } from 'app/shared/model/document.model';

export interface IAvoir {
  id?: number;
  code?: string | null;
  document?: IDocument | null;
}

export const defaultValue: Readonly<IAvoir> = {};
