import { Injectable } from '@nestjs/common';
import { TowingRequest } from './towingRequest.entity';

@Injectable()
export class TowingRequestDomainFacade {
  private towingRequests: TowingRequest[] = [];

  public findMany(): TowingRequest[] {
    return this.towingRequests;
  }

  public create(createDto: TowingRequest): TowingRequest {
    const newRequest = { ...createDto, id: Date.now().toString() };
    this.towingRequests.push(newRequest);
    return newRequest;
  }

  public findOne(id: string): TowingRequest | undefined {
    return this.towingRequests.find(request => request.id === id);
  }

  public update(id: string, updateDto: Partial<TowingRequest>): TowingRequest | undefined {
    const requestIndex = this.towingRequests.findIndex(request => request.id === id);
    if (requestIndex > -1) {
      this.towingRequests[requestIndex] = { ...this.towingRequests[requestIndex], ...updateDto };
      return this.towingRequests[requestIndex];
    }
    return undefined;
  }

  public delete(id: string): boolean {
    const requestIndex = this.towingRequests.findIndex(request => request.id === id);
    if (requestIndex > -1) {
      this.towingRequests.splice(requestIndex, 1);
      return true;
    }
    return false;
  }

  public findByUser(userId: string): TowingRequest[] {
    return this.towingRequests.filter(request => request.userId === userId);
  }
}