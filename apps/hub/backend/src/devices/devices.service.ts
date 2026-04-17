import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceRequestDto, UpdateDeviceRequestDto } from './dto';

/**
 * Сервис для управления устройствами
 */
@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  /**
   * Получить все устройства
   */
  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Получить устройство по ID
   */
  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Device with ID "${id}" not found`);
    }
    return device;
  }

  /**
   * Создать новое устройство
   */
  async create(createDeviceDto: CreateDeviceRequestDto): Promise<Device> {
    const device = this.deviceRepository.create(createDeviceDto);
    return this.deviceRepository.save(device);
  }

  /**
   * Обновить устройство
   */
  async update(id: string, updateDeviceDto: UpdateDeviceRequestDto): Promise<Device> {
    const device = await this.findOne(id);
    Object.assign(device, updateDeviceDto);
    return this.deviceRepository.save(device);
  }

  /**
   * Удалить устройство
   */
  async remove(id: string): Promise<void> {
    const device = await this.findOne(id);
    await this.deviceRepository.remove(device);
  }
}
