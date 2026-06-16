import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { Response, Request } from 'express';

import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'roles'],
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar access token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    const accessToken = this.jwtService.sign(payload);

    // Generar refresh token (con mayor duración)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Hashear y guardar refresh token en la base de datos
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(user.id, { hashedRefreshToken });

    // Establecer refresh token en cookie HttpOnly
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Crear nuevo usuario (la contraseña se hashea automáticamente en la entidad)
    const user = this.userRepository.create({
      email,
      password,
      roles: ['user' as any], // Rol por defecto
    });

    await this.userRepository.save(user);

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async logout(request: Request, response: Response) {
    const user = request.user as JwtPayload;

    // Limpiar refresh token de la base de datos
    await this.userRepository.update(user.sub, {
      hashedRefreshToken: null,
    });

    // Limpiar cookie
    response.clearCookie('refreshToken');

    return { message: 'Logout exitoso' };
  }

  async refresh(request: Request, response: Response) {
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      // Verificar el refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Buscar usuario
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        select: ['id', 'email', 'roles', 'hashedRefreshToken'],
      });

      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verificar que el refresh token coincida con el guardado
      const isValid = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generar nuevo access token
      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };
      const newAccessToken = this.jwtService.sign(newPayload);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'roles'],
      order: { id: 'DESC' },
    });

    return users;
  }
}
