import { Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { HttpService } from './http.service';

/**
 * HTTP 요청을 다루는 모듈.
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
