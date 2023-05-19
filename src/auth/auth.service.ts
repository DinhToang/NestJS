import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { async, asyncScheduler } from "rxjs";

@Injectable()
export class AuthService{
constructor(private prisma: PrismaService) {}
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
            delete user.hash;
    
            //trả lại thông tin được lưu
            return user;
            
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
        delete user.hash;
        return user;
    }
}