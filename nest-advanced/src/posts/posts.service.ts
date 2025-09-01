import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { Post } from './interfaces/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { CACHE_MANAGER,Cache } from '@nestjs/cache-manager';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Injectable()
export class PostsService {
    private postListCachekeys: Set<string> = new Set();

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
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    private generatePostsListCacheKey(query: FindPostsQueryDto): string {
        const { page = 1, limit = 10, title } = query;
        return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
    }

    // findAll(): Post[] {
    //     return this.posts;
    // }
    // async findAll(): Promise<Post[]> {
    //     return await this.postsRepository.find({
    //         relations:{
    //             authorName:true
    //         },
    //     });
    // }
    async findAll(query: FindPostsQueryDto): Promise<PaginatedResponse<Post>> {
    const cacheKey = this.generatePostsListCacheKey(query);

    this.postListCachekeys.add(cacheKey);

    const getCachedData =
      await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);

    if (getCachedData) {
      console.log(
        `Cache Hit --------> Returning posts list from Cache ${cacheKey}`,
      );
      return getCachedData;
    }
    console.log(`Cache Miss --------> Returning posts list from database`);

    const { page = 1, limit = 10, title } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authorName', 'authorName')
      .orderBy('post.createdDate', 'DESC')
      .skip(skip)
      .take(limit);

    if (title) {
      queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` });
    }

    const [items, totalItems] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    const responseResult = {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };

    await this.cacheManager.set(cacheKey, responseResult, 30000);
    return responseResult;
  }



    // findOne(id:number): Post {
    //     const singlPost = this.posts.find(post => post.id === id);

    //     if(!singlPost) {
    //         throw new NotFoundException(`Post with id ${id} not found`);
    //     }

    //     return singlPost;
    // }
    // async findOne(id:number): Promise<Post>  {
    //     const singlPost = await this.postsRepository.findOne({
    //         where: {id},
    //         relations: ['authorName']
    //     });

    //     if(!singlPost) {
    //         throw new NotFoundException(`Post with id ${id} not found`);
    //     }

    //     return singlPost;
    // }
    async findOne(id: number): Promise<Post> {
    const cacheKey = `post_${id}`;
    const cachedPost = await this.cacheManager.get<Post>(cacheKey);

    if (cachedPost) {
      console.log(`Cache Hit --------> Returning post from Cache ${cacheKey}`);

      return cachedPost;
    }

    console.log(`Cache miss ---------> Returning post from DB`);

    const singlePost = await this.postsRepository.findOne({
      where: { id },
      relations: ['authorName'],
    });

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }

    //store the post to cache
    await this.cacheManager.set(cacheKey, singlePost, 30000);

    return singlePost;
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
    // async create(createPostData: CreatePostDto, authorName: User): Promise<Post> {
    //     const newlyCreatedPost = this.postsRepository.create({
    //         title: createPostData.title,
    //         content: createPostData.content,
    //         authorName: authorName
    //     });

        
    //     return this.postsRepository.save(newlyCreatedPost);

    // }
    async create(createPostData: CreatePostDto, authorName: User): Promise<Post> {
    const newlyCreatedPost = this.postsRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      authorName,
    });

    //Invalidate the existing cache
    await this.invalidateAllExistingListCaches();

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
    // async update(id:number, updatePostData: UpdatePostDto, user: User): Promise<Post> {
    //     const findPostToUpdate = await this.findOne(id);

    //     if(findPostToUpdate.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
    //         throw new ForbiddenException('You are not allowed to update this post');
    //     }

    //     if(updatePostData.title) {
    //         findPostToUpdate.title = updatePostData.title;
    //     }

    //     if(updatePostData.content) {
    //         findPostToUpdate.content = updatePostData.content;
    //     }

    //     // if(updatePostData.authorName) {
    //     //     findPostToUpdate.authorName = updatePostData.authorName;
    //     // }

    //     return this.postsRepository.save(findPostToUpdate);
    // }
    async update(
        id: number,
        updatePostData: UpdatePostDto,
        user: User,
    ): Promise<Post> {
    const findPostToUpdate = await this.findOne(id);

    if (
      findPostToUpdate.authorName.id !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('You can only update your own posts');
    }

    if (updatePostData.title) {
      findPostToUpdate.title = updatePostData.title;
    }

    if (updatePostData.content) {
      findPostToUpdate.content = updatePostData.content;
    }

    const updatedPost = await this.postsRepository.save(findPostToUpdate);

    await this.cacheManager.del(`post_${id}`);

    await this.invalidateAllExistingListCaches();

    return updatedPost;
  }

    // remove(id:number):{message:string} {
    //     const PostIndex = this.posts.findIndex(post => post.id === id);

    //     if(PostIndex === -1) {
    //         throw new NotFoundException(`Post with id ${id} not found`);
    //     }

    //     this.posts.splice(PostIndex, 1);

    //     return {message: `Post with id ${id} has been removed.`};
    // }
    // async remove(id:number):Promise<void> {
    //    const findPostToDelete = await this.findOne(id);

    //    await this.postsRepository.remove(findPostToDelete);
    // }
    async remove(id: number): Promise<void> {
        const findPostToDelete = await this.findOne(id);

        await this.postsRepository.remove(findPostToDelete);

        await this.cacheManager.del(`post_${id}`);

        await this.invalidateAllExistingListCaches();
  }


    // private getNextId(): number {
    //     return this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
    // }


    private async invalidateAllExistingListCaches(): Promise<void> {
        console.log(
        `Invalidating ${this.postListCachekeys.size} list cache entries`,
        );

        for (const key of this.postListCachekeys) {
        await this.cacheManager.del(key);
        }

        this.postListCachekeys.clear();
  }


}
