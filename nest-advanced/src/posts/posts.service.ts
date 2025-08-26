import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
    private posts:Post[] = [
        {
            id:1,
            title:'First',
            content:'First Post content',
            authorName:'John Doe',
            createdAt: new Date()
        }
    ]

    findAll(): Post[] {
        return this.posts;
    }


    findOne(id:number): Post {
        const singlPost = this.posts.find(post => post.id === id);

        if(!singlPost) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        return singlPost;
    }

    create(createPostData: Omit<Post, 'id' | 'createdAt'>): Post {
        const newPost: Post = {
            id: this.getNextId(),
            ...createPostData,
            createdAt: new Date()
        };

        this.posts.push(newPost);
        return newPost;

    }

    update(id:number, updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>): Post {
        const currentPostIndexEdit = this.posts.findIndex(post => post.id === id);
        if(currentPostIndexEdit === -1) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        const updatedPost = {
            ...this.posts[currentPostIndexEdit],
            ...updatePostData,
            updatedAt: new Date()
        };

        this.posts[currentPostIndexEdit] = updatedPost;
        return updatedPost;
    }

    remove(id:number):{message:string} {
        const PostIndex = this.posts.findIndex(post => post.id === id);

        if(PostIndex === -1) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        this.posts.splice(PostIndex, 1);

        return {message: `Post with id ${id} has been removed.`};
    }


    private getNextId(): number {
        return this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
    }


}
