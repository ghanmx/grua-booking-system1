import { Module } from '@nestjs/common';
import { AuthenticationDomainFacade } from './authentication.domain.facade';

@Module({
  providers: [AuthenticationDomainFacade],
  exports: [AuthenticationDomainFacade],
})
export class AuthenticationDomainModule {}