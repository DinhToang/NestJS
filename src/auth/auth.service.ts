import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService{
constructor(private prisma: PrismaService) {}
    async signup(dto: AuthDto){
        //tạo ra pass mã hóa
        const hash = await argon.hash(dto.password);
        //lưu người dùng vào db
        const user = await this.prisma.user.create({
            data:{
                email: dto.email,
                hash,
            },
        })
        //trả lại thông tin được lưu
        return user;
    }

    signin(){
        return { msg: 'I am sign in'};
    }
}