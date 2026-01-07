import { Role } from '../models/roles.model';

export interface JwtPayload {
  sub: number; // ID del usuario (estándar JWT usa 'sub' para subject)
  email: string;
  roles: Role[];
}