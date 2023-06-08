import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto } from './dto';


@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Get()
    getBookmarks(@GetUser('id') userId: number){

    }
    
    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId:number){

    }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto){
        
    }

    @Patch()
    editBookmark(@GetUser('id') userId: number){

    }

    @Delete()
    deleteBookmarkById(@GetUser('id') userId: number){

    }

}