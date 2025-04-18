import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// decorador para obtener el usuario autenticado en la petición
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);