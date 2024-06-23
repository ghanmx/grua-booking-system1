import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { EventService } from '../event/event.service';
import { TowingRequestDomainFacade } from '../towingRequest/towingRequest.domain.facade';
import { AuthenticationDomainFacade } from '../authentication/authentication.domain.facade';
import { TowingRequestCreateDto, TowingRequestUpdateDto } from './towingRequest.dto';
import { TowingRequestApplicationEvent } from './towingRequest.application.event;

@Controller('/v1/towingRequests')
export class TowingRequestController {
  constructor(
    private readonly eventService: EventService,
    private readonly towingRequestDomainFacade: TowingRequestDomainFacade,
    private readonly authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get()
  async findMany() {
    return this.towingRequestDomainFacade.findMany();
  }

  @Post()
  async create(@Body() createDto: TowingRequestCreateDto) {
    const towingRequest = await this.towingRequestDomainFacade.create(createDto);
    this.eventService.emit(new TowingRequestApplicationEvent.TowingRequestCreated(towingRequest.id, towingRequest.userId));
    return towingRequest;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.towingRequestDomainFacade.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: TowingRequestUpdateDto) {
    return this.towingRequestDomainFacade.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.towingRequestDomainFacade.delete(id);
  }
}