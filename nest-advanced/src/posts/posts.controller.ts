import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { single } from 'rxjs';
import type { Post as PostInterface } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './pipes/post-exists.pipe';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) {}

    @Get()
    findAll(@Query('search') search?:string): PostInterface[] {
        const extractAllPosts = this.postService.findAll();

        if(search) {
            return extractAllPosts.filter(singlePost =>singlePost.title.toLowerCase().includes(search.toLowerCase()));
        }

        return extractAllPosts
    }

    // @Get(':id')
    // findOne(@Param('id', ParseIntPipe) id:number): PostInterface {
    //     return this.postService.findOne(id);
    // }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe, PostExistsPipe) id:number): PostInterface {
        return this.postService.findOne(id);
    }

    // @Post('create')
    // @HttpCode(HttpStatus.CREATED)
    // create(@Body() createPostData: Omit<PostInterface, 'id' | 'createdAt'>): PostInterface {
    //     return this.postService.create(createPostData);
    // }
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
    create(@Body() createPostData: CreatePostDto): PostInterface {
        return this.postService.create(createPostData);
    }

    // @Put(':id')
    // update(@Param('id', ParseIntPipe) id:number, @Body() updatePostData: Partial<Omit<PostInterface, 'id' | 'createdAt'>>): PostInterface {
    //     return this.postService.update(id, updatePostData);
    // }
    @Put(':id')
    update(@Param('id', ParseIntPipe, PostExistsPipe) id:number, @Body() updatePostData: UpdatePostDto): PostInterface {
        return this.postService.update(id, updatePostData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe, PostExistsPipe) id:number): void {
          this.postService.remove(id);
    }   
}
