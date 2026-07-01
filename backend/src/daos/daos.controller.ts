import { Controller, Post, Body, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { DaosService } from './daos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('daos')
export class DaosController {
  constructor(private daosService: DaosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() body: any) {
    return this.daosService.create(req.user.sub, body);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.daosService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.daosService.findOne(id);
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  addMember(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body('role') role: string,
  ) {
    return this.daosService.addMember(id, userId, role);
  }
}
