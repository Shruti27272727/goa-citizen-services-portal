import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1759611317662 implements MigrationInterface {
    name = 'InitSchema1759611317662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "departments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_d96b4020e5321e51e7701f4b6c8"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "citizens_id_seq" OWNED BY "citizens"."id"`);
        await queryRunner.query(`ALTER TABLE "citizens" ALTER COLUMN "id" SET DEFAULT nextval('"citizens_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "citizens" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_fe8dcab94e4095af071399c6523" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_d96b4020e5321e51e7701f4b6c8" FOREIGN KEY ("citizen_id") REFERENCES "citizens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_d96b4020e5321e51e7701f4b6c8"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_fe8dcab94e4095af071399c6523"`);
        await queryRunner.query(`ALTER TABLE "citizens" ALTER COLUMN "id" SET DEFAULT nextval('citizens_id_seq1')`);
        await queryRunner.query(`ALTER TABLE "citizens" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "citizens_id_seq"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_d96b4020e5321e51e7701f4b6c8" FOREIGN KEY ("citizen_id") REFERENCES "citizens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "departments"`);
    }

}
