import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AnorbankService } from './anorbank.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('anorbank')
export class AnorbankController {
  constructor(public anorbankService: AnorbankService) {}

  @ApiOperation({ summary: 'Billing proxy' })
  @ApiBody({
    description: 'Raw JSON input',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @Post()
  async anorSendTransaction(@Body() data: any) {
    return this.anorbankService.sendPayment(data);
  }
}
