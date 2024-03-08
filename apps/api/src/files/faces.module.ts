import { Module } from '@nestjs/common';
import { FacesService } from './services/faces.service';

@Module({
  providers: [FacesService],
  exports: [FacesService],
})
export class FacesModule {}
