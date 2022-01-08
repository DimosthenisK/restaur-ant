import { SetMetadata } from '@nestjs/common';

export interface SelfDecoratorParams {
  userIDParam: string;
  allowAdmins?: boolean;
}

export const Self = (params: SelfDecoratorParams | string) =>
  SetMetadata(
    'selfParams',
    typeof params == 'string' ? { userIDParam: params } : params,
  );
