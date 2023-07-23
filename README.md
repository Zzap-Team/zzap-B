# API 명세

## 1. REST API

### Article

| Method | URI                 | BODY             | 설명             |
| ------ | ------------------- | ---------------- | ---------------- |
| GET    | /article            |                  | 모든 게시글 조회 |
| GET    | /article/:articleID |                  | 게시글 조회      |
| POST   | /article            | CreateArticleDTO | 게시글 생성      |
| DELETE | /article/:articleID |                  | 게시글 삭제      |
| UPDATE | /article/:articleID | UpdateArticleDTO | 게시글 갱신      |

### User

| Method | URI        | BODY          | 설명             |
| ------ | ---------- | ------------- | ---------------- |
| GET    | /user      |               | 모든 사용자 조회 |
| GET    | /user/:uid |               | 사용자 조회      |
| POST   | /user      | CreateUserDTO | 사용자 생성      |
| DELETE | /user/:uid |               | 사용자 삭제      |

### auth/jwt

| Method | URI           | BODY          | 설명                                      |
| ------ | ------------- | ------------- | ----------------------------------------- |
| POST   | /auth/signin  | SignInDTO     | 로그인                                    |
| GET    | /auth/refresh |               | accessToken재발급(refreshToken 쿠키 필요) |
| POST   | /auth/signout | CreateUserDTO | 로그아웃                                  |
| DELETE | /auth/:uid    |               | 사용자 삭제                               |

### oauth/github

| Method | URI            | BODY           | 설명   |
| ------ | -------------- | -------------- | ------ |
| POST   | /github/signin | oauthSigninDTO | 로그인 |

## 2. Graphql

### Article

- articles: 모든 글 조회

```
query{
  articles{
    articleID
    title
    content
    createdAt
    updatedAt
    author {
      uid
      name
      email
    }
  }
}
```

- article: 글 조회

```
query{
  article(articleID: "articleid") {
    articleID
    title
    content
    createdAt
    updatedAt
    author {
      uid
      name
      email
    }
  }
}
```

- createArticle: 글 생성(로그인 필요)

```
mutation{
  createArticle(createArticleDTO :{title: "title", content: "content"}) {
    articleID
    title
    content
    createdAt
    updatedAt
    author {
      uid
      name
      email
    }
  }
}
```

- updateArticle: 글 업데이트(로그인 필요)

```
mutation{
  updateArticle(updateArticleDTO :{title: "title", content: "content"}, articleID: "id") {
    articleID
    title
    content
    createdAt
    updatedAt
    author {
      uid
      name
      email
    }
  }
}
```

- deleteArticle: 글 삭제(로그인 필요)

```
mutation{
  deleteArticle(articleID: "id")
}
```

### User

- users: 모든 유저 조회

```
query{
  users{
    uid
    name
    email
    password
    createdAt
    articles{
      articleID
      title
      content
    }
  }
}
```

- user: 유저 조회

```
query{
  user(uid: "uid"){
    uid
    name
    email
    password
    createdAt
    articles{
      articleID
      title
      content
    }
  }
}
```

- me: 본인 정보 조회(로그인필요)

```
query{
  me{
    uid
    name
    email
    password
    createdAt
    articles{
      articleID
      title
      content
    }
  }
}
```

- createUser: 유저 생성

```
/*
name: 2~30글자
email: 이메일형태로 이루어진 60글자 이내
password: 영문대소문자, 숫자, 특수문자로 이루어진 8~30글자
*/
mutation{
  createUser(createUserDTO: {name: "name", email: "email", password: "password"}){
    uid
    name
    email
    password
    createdAt
    articles{
      articleID
      title
      content
    }
  }
}
```

- deleteUser: 회원 탈퇴(로그인 필요)

```
mutation{
  deleteUser
}
```

### Auth(JWT)

- signin: 로그인

```
mutation {
	signin(signInDTO: {email: "email", password: "password"}){
    accessToken
    refreshToken
  }
}
```

- signOut: 로그아웃(로그인 필요)

```
mutation{
  signout{
    token
    httpOnly
    maxAge
  }
}
```

- refreshToken: accesstoekn발급(cookie에 refresh token 필요)

```
mutation{
  refreshToken{
    token
    httpOnly
    maxAge
  }
}
```

### Oauth(github)

- signinWithGithub: 로그인

```
mutation{
  signinWithGithub(oauthSigninDTO: {code: "code"}){
    accessToken
    refreshToken
  }
}
```
