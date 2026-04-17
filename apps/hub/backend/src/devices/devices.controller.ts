import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DevicesService } from './devices.service';
import { CreateDeviceRequestDto, UpdateDeviceRequestDto } from './dto';

/**
 * Контроллер для управления устройствами
 */
@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  /**
   * Получить все устройства
   */
  @Get()
  async findAll() {
    return this.devicesService.findAll();
  }

  /**
   * Получить устройство по ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  /**
   * Создать новое устройство
   */
  @Post()
  async create(@Body() createDeviceDto: CreateDeviceRequestDto) {
    return this.devicesService.create(createDeviceDto);
  }

  /**
   * Обновить устройство
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceRequestDto) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  /**
   * Удалить устройство
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }
}
