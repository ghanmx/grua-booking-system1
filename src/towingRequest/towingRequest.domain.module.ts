import { Module } from '@nestjs/common';
import { TowingRequestDomainFacade } from './towingRequest.domain.facade';

@Module({
  providers: [TowingRequestDomainFacade],
  exports: [TowingRequestDomainFacade],
})
export class TowingRequestDomainModule {}