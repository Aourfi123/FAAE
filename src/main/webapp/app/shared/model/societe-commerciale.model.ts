import { IReduction } from 'app/shared/model/reduction.model';

export interface ISocieteCommerciale {
  id?: number;
  codePays?: string | null;
  libelle?: string | null;
  devise?: string | null;
  societeCommerciales?: IReduction[] | null;
}

export const defaultValue: Readonly<ISocieteCommerciale> = {};
