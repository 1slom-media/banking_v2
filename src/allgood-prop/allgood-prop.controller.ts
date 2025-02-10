import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AllgoodPropService } from './allgood-prop.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllgoodPropDto } from './dto/allgood-prop';

@ApiTags('Allgood Prop schotlari')
@Controller('allgood-prop')
export class AllgoodPropController {
  constructor(private readonly propService: AllgoodPropService) {}

  @ApiOperation({ summary: 'Barcha bank shotlarini olish' })
  @Get()
  getAll() {
    return this.propService.findAll();
  }

  @ApiOperation({ summary: 'Bank unikalkasi orqali shu bank shotini olish' })
  @Get(':uniqueId')
  getByBank(@Param('uniqueId') id: number) {
    return this.propService.findOneByBank(id);
  }

  @Post()
  async createProp(@Body() data: AllgoodPropDto) {
    return await this.propService.create(data);
  }

  @ApiOperation({ summary: "Shotni deactive holatga o'tkazish" })
  @Delete(':id')
  async deactiveProp(@Param('id') id: string) {
    return await this.propService.deleteProp(id);
  }
}
