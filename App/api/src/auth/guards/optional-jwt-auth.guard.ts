import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Sobrescribe handleRequest para que no lance un error si el usuario no está autenticado
  handleRequest(err, user, info, context) {
    // No lances un error, simplemente devuelve el usuario si existe, o undefined si no.
    return user;
  }
}
