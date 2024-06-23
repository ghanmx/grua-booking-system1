import { Controller, Get, Param } from '@nestjs/common';
import { TowingRequestDomainFacade } from '../towingRequest/towingRequest.domain.facade';

@Controller('/v1/users/:userId/towingRequests')
export class TowingRequestByUserController {
  constructor(private readonly towingRequestDomainFacade: TowingRequestDomainFacade) {}

  @Get()
  async findByUser(@Param('userId') userId: string) {
    return this.towingRequestDomainFacade.findByUser(userId);
  }
}