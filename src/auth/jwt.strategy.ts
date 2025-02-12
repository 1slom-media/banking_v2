import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserEntity,'main')
        private readonly userRepository: Repository<UserEntity>,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('SECRET_KEY_JWT'),
        });
    }
   
    async validate(payload: { id: string }) {
        const user = await this.userRepository.findOne({ where: { id: payload.id } });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
