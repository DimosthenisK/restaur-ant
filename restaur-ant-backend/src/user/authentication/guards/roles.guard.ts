import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (this.reflector.get<boolean>('anonymous', context.getHandler()))
      return true;

    if (user.role == Role.ADMIN) return true;

    let requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      requiredRoles = this.reflector.get<Role[]>('roles', context.getClass());
      if (!requiredRoles) return true;
    }

    let hasRole = false;
    for (const role of requiredRoles) if (role == user.role) hasRole = true;

    return user && user.role && hasRole;
  }
}
