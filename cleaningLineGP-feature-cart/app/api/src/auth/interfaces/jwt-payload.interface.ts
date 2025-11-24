import { Role } from '../models/roles.model';

export interface JwtPayload {
  id: number;
  email: string;
  roles: Role[];
}