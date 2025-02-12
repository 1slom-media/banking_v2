import { UserEntity } from '../auth/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: UserEntity;
  }
}
