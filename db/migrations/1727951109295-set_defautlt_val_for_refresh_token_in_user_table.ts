import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefautltValForRefreshTokenInUserTable1727951109295 implements MigrationInterface {
    name = 'SetDefautltValForRefreshTokenInUserTable1727951109295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
