import dayjs from 'dayjs';
import { IReduction } from 'app/shared/model/reduction.model';
import { IArticle } from 'app/shared/model/article.model';

export interface ITarif {
  id?: number;
  dateDebut?: string | null;
  dateFin?: string | null;
  reductions?: IReduction | null;
  articles?: IArticle | null;
}

export const defaultValue: Readonly<ITarif> = {};
