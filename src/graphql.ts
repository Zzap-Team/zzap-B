
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class UserInput {
    name: string;
    email: string;
    password?: Nullable<string>;
}

export class LoginWithPasswordInput {
    email: string;
    password: string;
}

export class LoginWithThirdPartyInput {
    vendor: string;
    authCode: string;
}

export class ArticleInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
    description?: Nullable<string>;
}

export class User {
    userId: string;
    email: string;
    name: string;
    createdAt: Date;
    deletedAt?: Nullable<Date>;
    articles: Nullable<Article>[];
}

export class Article {
    articleId: string;
    author: User;
    title: string;
    content: string;
    description?: Nullable<string>;
    createdAt: Date;
    modifiedAt: Date;
}

export abstract class IQuery {
    abstract me(): User | Promise<User>;

    abstract article(articleId: string): Article | Promise<Article>;
}

export abstract class IMutation {
    abstract deleteMe(): boolean | Promise<boolean>;

    abstract updateMe(input?: Nullable<UserInput>): User | Promise<User>;

    abstract addArticle(input?: Nullable<ArticleInput>): Article | Promise<Article>;

    abstract deleteArticle(articleId: string): boolean | Promise<boolean>;

    abstract updateArticle(articleId: string, input?: Nullable<ArticleInput>): Article | Promise<Article>;

    abstract loginWithThirdParty(input?: Nullable<LoginWithThirdPartyInput>): LoginResult | Promise<LoginResult>;

    abstract loginWithPassword(input?: Nullable<LoginWithPasswordInput>): LoginResult | Promise<LoginResult>;

    abstract refreshAccessToken(): JWT | Promise<JWT>;
}

export class LoginResult {
    user: User;
    accessToken: JWT;
}

export type JWT = any;
type Nullable<T> = T | null;
