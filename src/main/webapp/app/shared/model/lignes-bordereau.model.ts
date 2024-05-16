import dayjs from 'dayjs';
import { IBordereau } from 'app/shared/model/bordereau.model';
import { IArticle } from 'app/shared/model/article.model';

export interface ILignesBordereau {
  id?: number;
  quantite?: number | null;
  dateDebut?: string | null;
  dateFin?: string | null;
  bordereaus?: IBordereau | null;
  articles?: IArticle | null;
}

export const defaultValue: Readonly<ILignesBordereau> = {};
