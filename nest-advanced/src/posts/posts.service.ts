import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// import { Post } from './interfaces/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {
    // private posts:Post[] = [
    //     {
    //         id:1,
    //         title:'First',
    //         content:'First Post content',
    //         authorName:'John Doe',
    //         createdAt: new Date()
    //     }
    // ]


    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
        // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // findAll(): Post[] {
    //     return this.posts;
    // }
    async findAll(): Promise<Post[]> {
        return await this.postsRepository.find({
            relations:{
                authorName:true
            },
        });
    }



    // findOne(id:number): Post {
    //     const singlPost = this.posts.find(post => post.id === id);

    //     if(!singlPost) {
    //         throw new NotFoundException(`Post with id ${id} not found`);
    //     }

    //     return singlPost;
    // }
    async findOne(id:number): Promise<Post>  {
        const singlPost = await this.postsRepository.findOne({
            where: {id},
            relations: ['authorName']
        });

        if(!singlPost) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        return singlPost;
    }

    // create(createPostData: Omit<Post, 'id' | 'createdAt'>): Post {
    //     const newPost: Post = {
    //         id: this.getNextId(),
    //         ...createPostData,
    //         createdAt: new Date()
    //     };

    //     this.posts.push(newPost);
    //     return newPost;

    // }
    async create(createPostData: CreatePostDto, authorName: User): Promise<Post> {
        const newlyCreatedPost = this.postsRepository.create({
            title: createPostData.title,
            content: createPostData.content,
            authorName: authorName
        });

        
        return this.postsRepository.save(newlyCreatedPost);

    }

    // update(id:number, updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>): Post {
    //     const currentPostIndexEdit = this.posts.findIndex(post => post.id === id);
    //     if(currentPostIndexEdit === -1) {
    //         throw new NotFoundException(`Post with id ${id} not found`);
    //     }

    //     const updatedPost = {
    //         ...this.posts[currentPostIndexEdit],
    //         ...updatePostData,
    //         updatedAt: new Date()
    //     };

    //     this.posts[currentPostIndexEdit] = updatedPost;
    //     return updatedPost;
    // }
    async update(id:number, updatePostData: UpdatePostDto, user: User): Promise<Post> {
        const findPostToUpdate = await this.findOne(id);

        if(findPostToUpdate.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You are not allowed to update this post');
        }

        if(updatePostData.title) {
            findPostToUpdate.title = updatePostData.title;
        }

        if(updatePostData.content) {
            findPostToUpdate.content = updatePostData.content;
        }

        // if(updatePostData.authorName) {
        //     findPostToUpdate.authorName = updatePostData.authorName;
        // }

        return this.postsRepository.save(findPostToUpdate);
    }

    // remove(id:number):{message:string} {
    //     const PostIndex = this.posts.findIndex(post => post.id === id);

    //     if(PostIndex === -1) {
    //         throw new NotFoundException(`Post with id ${id} not found`);
    //     }

    //     this.posts.splice(PostIndex, 1);

    //     return {message: `Post with id ${id} has been removed.`};
    // }
    async remove(id:number):Promise<void> {
       const findPostToDelete = await this.findOne(id);

       await this.postsRepository.remove(findPostToDelete);
    }


    // private getNextId(): number {
    //     return this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
    // }


}
