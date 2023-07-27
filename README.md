# API 명세

## 1. Graphql

### Article

- articles: 모든 글 조회

```
query articles{
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
query article($articleID: String!){
  article(articleID: $articleID) {
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
mutation createArticle($title: String!, $content: String){
  createArticle(createArticleDTO :{title: $title, content: $content}) {
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
mutation updateArticle($title: String!, $content: String, $articleID: String!) {
  updateArticle(updateArticleDTO :{title: $title, content: $content}, articleID: $articleID) {
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
mutation deleteArticle($articleID: String!){
  deleteArticle(articleID: $articleID)
}
```

### User

- users: 모든 유저 조회

```
query users{
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
query user($uid: String!){
  user(uid: $uid){
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
query me{
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
mutation createUser($name: String!, $email: String!, $password: String!){
  createUser(createUserDTO: {name: $name, email: $email, password: $password}){
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
mutation deleteUser {
  deleteUser
}
```

### Auth(JWT)

- signin: 로그인

```
mutation signin($email: String!, $password: String!){
	signin(signInDTO: {email: $email, password: $password}){
    accessToken
    accesss
    refreshToken
  }
}
```

- signOut: 로그아웃(로그인 필요)

```
mutation signout {
  signout{
    token
    httpOnly
    maxAge
  }
}
```

- refreshToken: accesstoekn발급(cookie에 refresh token 필요)

```
mutation refreshToken {
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
mutation signinWithGithub($code: String!){
	signinWithGithub(oauthSigninDTO: {code: $code}){
    statusCode
    message
    accessToken{
			token
      httpOnly
      maxAge
    }
    refreshToken{
			token
      httpOnly
      maxAge
    }
  }
}
```

# ERROR CODE

| CODE              | 설명                   | 예시                                               |
| ----------------- | ---------------------- | -------------------------------------------------- |
| EXPIRED           | code나 token이 만료    | 같은 code 두 번 사용으로 만료                      |
| NONEXISTENT_VALUE | 필요한 값이 없음       | query variable이 부족한 경우                       |
| INVALID_VALUE     | 유효하지 않은 값       | 패스워드 불일치, 회원가입시 이미 계정 존재         |
| BAD_USER_INPUT    | invalid query variable | 해당 User가 존재하지 않음, article이 존재하지 않음 |
| UNAUTHORIZED      | 인가실패               | 로그인이 필요한 기능                               |
| UNAUTHENTICATED   | 인증실패               | 로그인, refreshtoken 재발급                        |
| BAD_REQUEST       | class-validator error  | 이메일, 패스워드 포맷과 안맞는 경우                |
