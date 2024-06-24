import { Module } from '@nestjs/common';
import { AuthenticationDomainModule } from '../authentication/authentication.domain.module';
import { TowingRequestDomainModule } from '../towing-request/towingRequest.domain.module';
import { UserDomainModule } from '../user/user.domain.module';

import { EventService } from '../event/event.service';
import { TowingRequestDomainFacade } from '../towingRequest/towingRequest.domain.facade';
import { AuthenticationDomainFacade } from '../authentication/authentication.domain.facade';
import { NewService } from '../new/new.service';

@Module({
  imports: [
    AuthenticationDomainModule,
    TowingRequestDomainModule,
    UserDomainModule,
  ],
  
  providers: [
    EventService,
    TowingRequestDomainFacade,
    {
      provide: 'AuthenticationDomainFacade',
      useClass: AuthenticationDomainFacade,
    },
    NewService,
  ],
})
export class TowingRequestApplicationModule {}