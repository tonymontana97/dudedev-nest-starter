import { Injectable } from '@nestjs/common';
import {RedisService} from "nestjs-redis";
import * as Redis from "ioredis";

@Injectable()
export class RedisServiceAdapter {
    public client: Redis.Redis;

    constructor(
        private readonly redisService: RedisService
    ) {
        this.client = this.redisService.getClient();
    }

    public set(
        key: string,
        value: string,
        expiryMode?: string | any[],
        time?: number | string,
        setMode?: number | string
    ): Promise<string> {
        return this.client.set(key, value);
    }

    public get(key: string): Promise<string> {
        return this.client.get(key);
    }

    public delete(key: string): Promise<number> {
        return this.client.del(key);
    }
}
