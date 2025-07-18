import { RollModel } from './roll';

export interface SpellModel {
  id?: number;
  characterId: number;
  name: string;
  description: string;
  flavorText: string;
  rollId: RollModel;
}
