export interface RollModel {
  id?: number;
  characterId: number;
  attrId?: number;
  spellId?: number;
  name: string;
  description: string;
  elements?: RollElementModel[];
}

export interface RollElementModel {
  id?: number;
  rollId: number;
  value: string;
  damageType: number;
}
