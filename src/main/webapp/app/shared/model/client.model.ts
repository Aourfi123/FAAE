import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IClientBordereau } from 'app/shared/model/client-bordereau.model';

export interface IClient {
  id?: number;
  cin?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  numeroTelephone?: number | null;
  dateNaissance?: string | null;
  nationalite?: string | null;
  adresse?: string | null;
  genre?: string | null;
  user?: IUser | null;
  clientBordereaus?: IClientBordereau[] | null;
}

export const defaultValue: Readonly<IClient> = {};
