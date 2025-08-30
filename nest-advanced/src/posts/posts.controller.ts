import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './pipes/post-exists.pipe';
// import type { Post as PostInterface } from './interfaces/post.interface';
import { Post as PostEntity } from './entities/post.entity';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) {}

    // @Get()
    // findAll(@Query('search') search?:string): PostInterface[] {
    //     const extractAllPosts = this.postService.findAll();

    //     if(search) {
    //         return extractAllPosts.filter(singlePost =>singlePost.title.toLowerCase().includes(search.toLowerCase()));
    //     }

    //     return extractAllPosts
    // }
    @Get()
    async findAll() : Promise<PostEntity[]> {
        return await this.postService.findAll();
    }

    // @Get(':id')
    // findOne(@Param('id', ParseIntPipe) id:number): PostInterface {
    //     return this.postService.findOne(id);
    // }
    // @Get(':id')
    // findOne(@Param('id', ParseIntPipe, PostExistsPipe) id:number): PostInterface {
    //     return this.postService.findOne(id);
    // }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe, PostExistsPipe) id:number): Promise<PostEntity> {
        return await this.postService.findOne(id);
    }

    // @Post('create')
    // @HttpCode(HttpStatus.CREATED)
    // create(@Body() createPostData: Omit<PostInterface, 'id' | 'createdAt'>): PostInterface {
    //     return this.postService.create(createPostData);
    // }
//     @Post('create')
//     @HttpCode(HttpStatus.CREATED)
//     @UsePipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//     }),
//   )
//     create(@Body() createPostData: CreatePostDto): PostInterface {
//         return this.postService.create(createPostData);
//     }
    @UseGuards(JwtAuthGuard)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
        }),
    )
    async create(@Body() createPostData: CreatePostDto, @CurrentUser() user: any): Promise<PostEntity> {
        return await this.postService.create(createPostData, user);
    }

    // @Put(':id')
    // update(@Param('id', ParseIntPipe) id:number, @Body() updatePostData: Partial<Omit<PostInterface, 'id' | 'createdAt'>>): PostInterface {
    //     return this.postService.update(id, updatePostData);
    // }
    // @Put(':id')
    // update(@Param('id', ParseIntPipe, PostExistsPipe) id:number, @Body() updatePostData: UpdatePostDto): PostInterface {
    //     return this.postService.update(id, updatePostData);
    // }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id', ParseIntPipe, PostExistsPipe) id:number, @Body() updatePostData: UpdatePostDto, @CurrentUser() user: any): Promise<PostEntity> {
        return await this.postService.update(id, updatePostData, user);
    }

    // @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // remove(@Param('id', ParseIntPipe, PostExistsPipe) id:number): void {
    //       this.postService.remove(id);
    // }   
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe, PostExistsPipe) id:number): Promise<void> {
          return await this.postService.remove(id);
    }
}
