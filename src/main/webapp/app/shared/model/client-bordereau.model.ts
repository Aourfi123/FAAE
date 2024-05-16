import dayjs from 'dayjs';
import { IBordereau } from 'app/shared/model/bordereau.model';
import { IClient } from 'app/shared/model/client.model';

export interface IClientBordereau {
  id?: number;
  dateDebut?: string | null;
  dateFin?: string | null;
  bordereaus?: IBordereau | null;
  clients?: IClient | null;
}

export const defaultValue: Readonly<IClientBordereau> = {};
