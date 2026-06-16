import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from '../models/roles.model';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    const createMockExecutionContext = (user: any): ExecutionContext => {
      return {
        switchToHttp: () => ({
          getRequest: () => ({
            user,
          }),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;
    };

    it('should allow access when no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      const context = createMockExecutionContext({ id: 1, roles: [] });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required role (admin)', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
      const context = createMockExecutionContext({
        id: 1,
        roles: [Role.ADMIN],
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required role (user)', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.USER]);
      const context = createMockExecutionContext({
        id: 1,
        roles: [Role.USER],
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user does not have required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
      const context = createMockExecutionContext({
        id: 1,
        roles: [Role.USER],
      });

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should deny access when user has no roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
      const context = createMockExecutionContext({
        id: 1,
        roles: [],
      });

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should deny access when user is not authenticated', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
      const context = createMockExecutionContext(null);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should allow access when user has multiple roles including required one', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
      const context = createMockExecutionContext({
        id: 1,
        roles: [Role.USER, Role.ADMIN],
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle multiple required roles correctly', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN, Role.USER]);
      const context = createMockExecutionContext({
        id: 1,
        roles: [Role.USER],
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
