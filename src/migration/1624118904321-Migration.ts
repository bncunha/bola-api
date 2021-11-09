import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1624118904321 implements MigrationInterface {
    name = 'Migration1624118904321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_1bb9d47089115613f6f376a27d` ON `palpite`");
        await queryRunner.query("DROP INDEX `partidaId` ON `palpite`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE UNIQUE INDEX `partidaId` ON `palpite` (`partidaId`, `participacaoId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_1bb9d47089115613f6f376a27d` ON `palpite` (`partidaId`, `participacaoId`)");
    }

}
