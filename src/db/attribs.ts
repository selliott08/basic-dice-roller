import { RollModel } from './roll';

export interface AttributeModel {
  id?: number;
  characterId: number;
  name: string;
  description: string;
  rollId: RollModel;
}
