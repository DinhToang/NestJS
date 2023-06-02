import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me') //GET/user/me
    getMe(@GetUser() user: User){
        return user
    }
}

