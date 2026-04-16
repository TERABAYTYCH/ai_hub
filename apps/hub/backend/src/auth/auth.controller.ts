import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  login() {}
}
