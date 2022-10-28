import { MigrationInterface, QueryRunner } from "typeorm";

export class initialSchema1666797807932 implements MigrationInterface {
    name = 'initialSchema1666797807932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`people\` (\`person_id\` int NOT NULL AUTO_INCREMENT, \`face_id\` char(36) NOT NULL, \`face_image\` mediumblob NOT NULL, \`name\` varchar(128) NOT NULL, \`name_ssml\` varchar(512) NOT NULL, \`family\` tinyint NOT NULL, \`unlock_expiration_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_3d05990f2ebf4903ae780b695b\` (\`face_id\`), PRIMARY KEY (\`person_id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3d05990f2ebf4903ae780b695b\` ON \`people\``);
        await queryRunner.query(`DROP TABLE \`people\``);
    }

}
