import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
    async signup(dto: AuthDto){
        //tạo ra pass mã hóa
        const hash = await argon.hash(dto.password);
        try {
            //lưu người dùng vào db
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash,
                },
            })
    
            //trả lại thông tin được lưu
            return this.signToken(user.id, user.email)
            
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Crednetials taken",);
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthDto){
        //Tìm người dùng bằng email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        //Nếu người dùng không tồn tại bắt ngoại lệ
        if (!user) {    
            throw new ForbiddenException(
                'Credentials incorrect'
            );
        }
        //So sánh mật khẩu
        const pwMatches = await argon.verify(user.hash,dto.password);
        //Nếu không đúng mật khẩu thì bắt ngoại lệ
        if(!pwMatches){
            throw new ForbiddenException(
                "Credentials incorrect",
            );
        }
        //Trả về người dùng
    
        return this.signToken(user.id, user.email)
    }


    async signToken(userID: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userID,
            email,
        }
        
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        })

        return {
            access_token: token,
        }
        
        
    }
}