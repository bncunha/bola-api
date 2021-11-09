import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1623974977142 implements MigrationInterface {
    name = 'Migration1623974977142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bolao` CHANGE `dataInicio` `dataInicio` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_1bb9d47089115613f6f376a27d` ON `palpite` (`partidaId`, `participacaoId`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bolao` CHANGE `dataInicio` `dataInicio` datetime(0) NOT NULL DEFAULT '2021-05-28 19:24:28'");
        await queryRunner.query("CREATE UNIQUE INDEX `partidaId` ON `palpite` (`partidaId`, `participacaoId`)");
    }

}
