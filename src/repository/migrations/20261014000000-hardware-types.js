'use strict';

module.exports = {
  async up(q, S) {
    const transaction = await q.sequelize.transaction();
    try {
      await q.createTable('HardwareType', {
        id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        name: { type: S.STRING(100), allowNull: false, unique: true },
        imageUrl: { type: S.STRING(255), allowNull: true },
        createdAt: { type: S.DATE, allowNull: false },
        updatedAt: { type: S.DATE, allowNull: false }
      }, { transaction });
      await q.addColumn('Hardware', 'hardwareTypeId', {
        type: S.INTEGER, allowNull: true,
        references: { model: 'HardwareType', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      }, { transaction });
      // Keep a complete backup of old image rows for rollback and audit.
      await q.createTable('HardwareImageLegacyBackup', {
        id: { type: S.INTEGER, primaryKey: true, allowNull: false },
        imageUrl: { type: S.STRING(255), allowNull: false },
        hardwareId: { type: S.INTEGER, allowNull: false },
        createdAt: { type: S.DATE, allowNull: false },
        updatedAt: { type: S.DATE, allowNull: false }
      }, { transaction });
      await q.sequelize.query('INSERT INTO HardwareImageLegacyBackup SELECT * FROM HardwareImage', { transaction });
      const [hardware] = await q.sequelize.query('SELECT id, hardwareName FROM Hardware ORDER BY id', { transaction });
      const [images] = await q.sequelize.query('SELECT hardwareId, imageUrl FROM HardwareImage ORDER BY id', { transaction });
      const names = new Map(hardware.map(h => [h.id, h.hardwareName]));
      const urls = new Map();
      for (const img of images) {
        const name = names.get(img.hardwareId);
        if (!name) continue;
        if (urls.has(name) && urls.get(name) !== img.imageUrl) {
          throw new Error(`Different images exist for hardware type "${name}". Resolve this before migrating.`);
        }
        urls.set(name, img.imageUrl);
      }
      const ids = new Map();
      for (const row of hardware) {
        if (!ids.has(row.hardwareName)) {
          const now = new Date();
          const result = await q.bulkInsert('HardwareType', [{ name: row.hardwareName,
            imageUrl: urls.get(row.hardwareName) || null, createdAt: now, updatedAt: now }], { transaction });
          // MySQL insert id is not guaranteed across dialects; query by name.
          const [found] = await q.sequelize.query('SELECT id FROM HardwareType WHERE name = :name', {
            replacements: { name: row.hardwareName }, transaction
          });
          ids.set(row.hardwareName, found[0].id);
        }
        await q.sequelize.query('UPDATE Hardware SET hardwareTypeId = :typeId WHERE id = :id', {
          replacements: { typeId: ids.get(row.hardwareName), id: row.id }, transaction
        });
      }
      await q.changeColumn('Hardware', 'hardwareTypeId', {
        type: S.INTEGER, allowNull: false,
        references: { model: 'HardwareType', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      }, { transaction });
      await q.dropTable('HardwareImage', { transaction });
      await transaction.commit();
    } catch (err) { await transaction.rollback(); throw err; }
  },
  async down(q, S) {
    const transaction = await q.sequelize.transaction();
    try {
      await q.createTable('HardwareImage', {
        id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        imageUrl: { type: S.STRING(255), allowNull: false },
        hardwareId: { type: S.INTEGER, allowNull: false, references: { model: 'Hardware', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { type: S.DATE, allowNull: false }, updatedAt: { type: S.DATE, allowNull: false }
      }, { transaction });
      await q.sequelize.query('INSERT INTO HardwareImage SELECT * FROM HardwareImageLegacyBackup', { transaction });
      await q.removeColumn('Hardware', 'hardwareTypeId', { transaction });
      await q.dropTable('HardwareType', { transaction });
      await q.dropTable('HardwareImageLegacyBackup', { transaction });
      await transaction.commit();
    } catch (err) { await transaction.rollback(); throw err; }
  }
};
