ALTER TABLE "Usuario"
ADD COLUMN "resetPasswordToken" VARCHAR(255),
ADD COLUMN "resetPasswordExpiration" TIMESTAMP;
