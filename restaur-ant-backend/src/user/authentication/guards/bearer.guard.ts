import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BearerAuthGuard extends AuthGuard('bearer') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * If an @Anonymous decorator is set,
   * then ignore the default canActivate
   * @param context
   */
  canActivate(context: ExecutionContext) {
    let isAnonymous = this.reflector.get<boolean>(
      'anonymous',
      context.getClass(),
    );
    if (!isAnonymous) {
      isAnonymous = this.reflector.get<boolean>(
        'anonymous',
        context.getHandler(),
      );
      if (!isAnonymous) return super.canActivate(context);
    }

    return true;
  }
}
