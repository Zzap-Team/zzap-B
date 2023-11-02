import { Injectable } from '@nestjs/common';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { map, lastValueFrom } from 'rxjs';

/**
 * HttpService 클래스.
 * NestJS의 HttpService Wrapping 클래스입니다.
 * Method들이 Promise를 반환합니다.
 * @date 11/2/2023 - 1:32:47 AM
 *
 * @export
 * @class HttpService
 * @typedef {HttpService}
 */
@Injectable()
export class HttpService {
  constructor(private readonly httpService: AxiosHttpService) {}

  async get(url: string, options: AxiosRequestConfig<any>) {
    try {
      return lastValueFrom(
        this.httpService.get(url, options).pipe(map((res) => res.data)),
      );
    } catch (error) {
      console.error('[HttpService] Error occurred.', error);
    }
  }

  async post(url: string, data: any, options: AxiosRequestConfig<any>) {
    try {
      return lastValueFrom(
        this.httpService.post(url, data, options).pipe(map((res) => res.data)),
      );
    } catch (error) {
      console.error('[HttpService] Error occurred.', error);
    }
  }
}
