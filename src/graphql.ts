
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class UserInput {
    name?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export class LoginWithPasswordInput {
    email: string;
    password: string;
}

export class LoginWithThirdPartyInput {
    vendor: string;
    authCode?: Nullable<string>;
}

export class User {
    userId: string;
    email: string;
    name: string;
    createdAt: Date;
    isActive: boolean;
}

export abstract class IQuery {
    abstract user(id: string): User | Promise<User>;
}

export abstract class IMutation {
    abstract addUser(input?: Nullable<UserInput>): User | Promise<User>;

    abstract deleteUser(id: string): boolean | Promise<boolean>;

    abstract updateUser(id: string, input?: Nullable<UserInput>): User | Promise<User>;

    abstract loginWithThirdParty(input?: Nullable<LoginWithThirdPartyInput>): User | Promise<User>;

    abstract loginWithPassword(input?: Nullable<LoginWithPasswordInput>): User | Promise<User>;
}

type Nullable<T> = T | null;
