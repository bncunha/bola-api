import { Module } from '@nestjs/common';
import { CampeonatosModule } from 'src/modules/campeonatos/campeonatos.module';
import { PalpitesModule } from 'src/modules/palpites/palpites.module';
import { PartidasJobService } from './partidas-job/partidas-job.service';

@Module({
  imports: [CampeonatosModule, PalpitesModule],
  providers: [PartidasJobService],
  exports: [PartidasJobService]
})
export class JobsModule {}
