import Dexie, { Table } from 'dexie';
import { CharacterClassModel, CharacterModel } from './character';
import { DmgTypeModel } from './dmg-type';
import { RollElementModel, RollModel } from './roll';
import { PropertyModel } from './property';
import { SkillModel } from './skill';
import { SpellModel } from './spell';
import { AttributeModel } from './attribs';

export class AppDB extends Dexie {
  damageTypes!: Table<DmgTypeModel, number>;
  characters!: Table<CharacterModel, number>;
  characterClasses!: Table<CharacterClassModel, number>;
  rolls!: Table<RollModel, number>;
  rollElements!: Table<RollElementModel, number>;
  properties!: Table<PropertyModel, number>;
  skills!: Table<SkillModel, number>;
  spells!: Table<SpellModel, number>;
  attributes!: Table<AttributeModel, number>;

  constructor() {
    super('BasicDiceRoller');
    this.version(1).stores({
      damageTypes: '++id',
      characters: '++id',
      characterClasses: '++id, characterId',
      rolls: '++id, characterId',
      rollElements: '++id, rollId',
      skills: '++id, characterId',
      spells: '++id, characterId, rollId',
      attributes: '++id, characterId, rollId',
      properties: '++id, characterId',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await db.damageTypes.bulkAdd([
      {
        name: 'slashing',
      },
      {
        name: 'bludgeoning',
      },
      {
        name: 'piercing',
      },
      {
        name: 'fire',
      },
      {
        name: 'ice',
      },
      {
        name: 'sonic',
      },
      {
        name: 'shocking',
      },
      {
        name: 'acid',
      },
      {
        name: 'poison',
      },
      {
        name: 'radiant',
      },
      {
        name: 'necrotic',
      },
      {
        name: 'psionic',
      },
    ]);
  }

  // async resetDatabase() {
  //   await db.transaction('rw', 'todoItems', 'todoLists', () => {
  //     this.todoItems.clear();
  //     this.todoLists.clear();
  //     this.populate();
  //   });
  // }
}

export const db = new AppDB();
