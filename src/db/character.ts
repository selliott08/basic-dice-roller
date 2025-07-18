import { RollModel } from './roll';

export interface CharacterModel {
  id?: number;
  name: string;
  classes?: CharacterClassModel[];
  rolls?: RollModel[];
}

export interface CharacterClassModel {
  id?: number;
  characterId: number;
  class: string;
  level: number;
}
