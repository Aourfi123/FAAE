import { IArticle } from 'app/shared/model/article.model';
import { IDemandeRembourssement } from 'app/shared/model/demande-rembourssement.model';

export interface IDetailsDemande {
  id?: number;
  quantite?: number | null;
  etat?: string | null;
  articles?: IArticle | null;
  demandeRemboursements?: IDemandeRembourssement | null;
}

export const defaultValue: Readonly<IDetailsDemande> = {};
