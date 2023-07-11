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

| Method | URI            | BODY          | 설명                                      |
| ------ | -------------- | ------------- | ----------------------------------------- |
| POST   | /auth/signin   | SignInDTO     | 로그인                                    |
| GET    | /auth/refresh  |               | accessToken재발급(refreshToken 쿠키 필요) |
| POST   | /auth/signout  | CreateUserDTO | 로그아웃                                  |
| DELETE | /uauthser/:uid |               | 사용자 삭제                               |
