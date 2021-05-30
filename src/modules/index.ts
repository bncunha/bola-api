import { ParticipacoesModule } from "src/participacoes/participacoes.module";
import { BoloesModule } from "./boloes/boloes.module";
import { CampeonatosModule } from "./campeonatos/campeonatos.module";
import { PalpitesModule } from "./palpites/palpites.module";
import { PartidasModule } from "./partidas/partidas.module";
import { TimesModule } from "./times/times.module";
import { UsuariosModule } from "./usuarios/usuarios.module";

const MODULES = [
  UsuariosModule,
  BoloesModule,
  ParticipacoesModule,
  TimesModule,
  CampeonatosModule,
  PalpitesModule,
  PartidasModule
]

export default MODULES