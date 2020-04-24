const hasha = require('hasha');
const glob = require('glob');
const path = require('path');
const { readFileSync } = require('fs');
const JSONC = require('jsonc');
const { LayoutSchema, WebsiteSchema, FolderSchema } = require('../vtexy-schemas');
const { fromPairs, difference, toPairs } = require('lodash');

const encrypt = v => hasha(v, { algorithm: 'sha1' });

const integrityStreamSync = async arg => {
  try {
    arg = await Promise.all(
      arg.map(async ([key, value]) => {
        if (await LayoutSchema.isValidSync(value)) {
          value = await LayoutSchema.validateSync(value);
        }
        if (await WebsiteSchema.isValidSync(value)) {
          value = await WebsiteSchema.validateSync(value);
        }
        if (await FolderSchema.isValidSync(value)) {
          value = await FolderSchema.validateSync(value);
        }

        return [encrypt(key), encrypt(JSON.stringify(value))];
      })
    );

    let encryptedObject = JSON.stringify(fromPairs(arg));

    return [encrypt(Buffer.from(encryptedObject), 'utf8'), encryptedObject];
  } catch (error) {
    console.error(error);
  }
};

const diffEncryptedObjects = (from, to) => {
  return difference(toPairs(from), toPairs(to));
};

(async () => {
  const integrity = await integrityStreamSync(
    await Promise.all(
      glob.sync(path.join(process.env.VTEXY_DATA, '**/*.jsonc')).map(async file => {
        return [
          path.relative(process.env.VTEXY_DATA, path.join(path.dirname(file), path.basename(file, '.jsonc'))),
          JSONC.parse(await readFileSync(file, 'utf8'))
        ];
      })
    )
  );

  console.log('DIFF:', diffEncryptedObjects(JSON.parse(integrity[1]), JSON.parse(integrity[1])));

  console.log(integrity[0]);
})();
