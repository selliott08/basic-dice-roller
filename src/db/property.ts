export interface PropertyModel {
  id?: number;
  characterId: number;
  name: string;
  static: boolean;
  modifier: boolean;
  value: number;
  temp: number;
  current: number;
  calculation: string;
}
