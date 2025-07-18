export interface SkillModel {
  id?: number;
  characterId: number;
  name: string;
  trained: boolean;
  trainedRoll: string;
  untrainedRoll: string;
}
