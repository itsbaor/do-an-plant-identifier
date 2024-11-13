import { e_CategoryLabel } from "~/data/categoryData";

export enum SUN {
  NONE = 'None',
  FULL_SHADE = 'Full Shade',
  PART_SHADE = 'Part Shade',
  SUN_PART_SHADE = 'Sun-Part Shade',
  FULL_SUN = 'Full Sun',
}

export enum CYCLE {
  NONE = 'None',
  PERENNIAL = 'Perennial',
  ANNUAL = 'Annual',
  BIENNIAL = 'Biennial',
}

export enum GROWTH {
  NONE = 'None',
  HIGH = 'High',
  MODERATE = 'Moderate',
  LOW = 'Low',
}

export enum WATERING {
  NONE = 'None',
  FREQUENT = 'Frequent',
  AVERAGE = 'Average',
  MINIMAL = 'Minimal',
}

export enum CATEGORY {
  OUTDOOR = 'Outdoor',
  INDOOR = 'Indoor',
  MEDICINAL = 'Medicinal',
  RARE = 'Rare',
  FRUITS = 'Fruits',
  FLOWERS = 'Flowers',
  POISONOUS = 'Poisonous',
  EDIBLE = 'Edible',
}

export type t_CategoryChecklist = {category: e_CategoryLabel; isChecked: boolean};
