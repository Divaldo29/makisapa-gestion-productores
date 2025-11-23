-- CreateTable
CREATE TABLE `Productor` (
    `id_productor` INTEGER NOT NULL AUTO_INCREMENT,
    `nombres` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dni` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Productor_dni_key`(`dni`),
    PRIMARY KEY (`id_productor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lote` (
    `id_lote` INTEGER NOT NULL AUTO_INCREMENT,
    `id_productor` INTEGER NOT NULL,
    `fecha_recepcion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `peso_kg` DOUBLE NOT NULL,
    `tipo_cafe` VARCHAR(191) NOT NULL,
    `estado_lote` VARCHAR(191) NOT NULL DEFAULT 'PENDIENTE',
    `observaciones` VARCHAR(191) NULL,

    PRIMARY KEY (`id_lote`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ControlCalidad` (
    `id_control` INTEGER NOT NULL AUTO_INCREMENT,
    `id_lote` INTEGER NOT NULL,
    `humedad` DOUBLE NOT NULL,
    `defectos` INTEGER NOT NULL,
    `taza` VARCHAR(191) NOT NULL,
    `resultado` VARCHAR(191) NOT NULL,
    `aprobado` BOOLEAN NOT NULL,
    `fecha_control` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_control`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Compra` (
    `id_compra` INTEGER NOT NULL AUTO_INCREMENT,
    `id_lote` INTEGER NOT NULL,
    `precio_x_kg` DOUBLE NOT NULL,
    `monto_total` DOUBLE NOT NULL,
    `metodo_pago` VARCHAR(191) NOT NULL,
    `fecha_pago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado_pago` VARCHAR(191) NOT NULL DEFAULT 'PENDIENTE',

    UNIQUE INDEX `Compra_id_lote_key`(`id_lote`),
    PRIMARY KEY (`id_compra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lote` ADD CONSTRAINT `Lote_id_productor_fkey` FOREIGN KEY (`id_productor`) REFERENCES `Productor`(`id_productor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ControlCalidad` ADD CONSTRAINT `ControlCalidad_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `Lote`(`id_lote`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compra` ADD CONSTRAINT `Compra_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `Lote`(`id_lote`) ON DELETE RESTRICT ON UPDATE CASCADE;
