import { Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { HttpService } from './http.service';

/**
 * HTTP요청에 사용하는 모듈.
 * 실제 요청 함수는 Service객체를 이용해주세요.
 * @date 11/2/2023 - 1:31:23 AM
 *
 * @export
 * @class HttpModule
 * @typedef {HttpModule}
 */
@Module({
  imports: [AxiosHttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
