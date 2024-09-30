import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class TowingRequestCreateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9\s,'-]*$/, {
    message: 'Pickup location must be a valid address',
  })
  pickupLocation: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9\s,'-]*$/, {
    message: 'Destination location must be a valid address',
  })
  destinationLocation: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}

export class TowingRequestUpdateDto {
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9\s,'-]*$/, {
    message: 'Pickup location must be a valid address',
  })
  pickupLocation?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9\s,'-]*$/, {
    message: 'Destination location must be a valid address',
  })
  destinationLocation?: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}