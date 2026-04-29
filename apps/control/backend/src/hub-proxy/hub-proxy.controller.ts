import { Controller, Get, Headers, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';

@Controller('devices')
export class HubProxyController {
  private readonly hubInternalUrl: string;

  constructor() {
    this.hubInternalUrl = process.env.HUB_INTERNAL_API_URL || 'http://hub-backend:3000';
  }

  @Get()
  async getDevices(
    @Headers('authorization') authHeader: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!authHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    try {
      const response = await axios.get(`${this.hubInternalUrl}/devices`, {
        headers: {
          Authorization: authHeader,
        },
        timeout: 5000,
      });

      return res.status(HttpStatus.OK).json(response.data);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'Failed to proxy request to Hub',
        statusCode: HttpStatus.BAD_GATEWAY,
      });
    }
  }
}
