import {e_CategoryLabel} from '~/data/categoryData';
import {CYCLE, GROWTH, SUN, WATERING} from './category';

export type t_PlantType = {
  id?: number;
  name: string;
  image: string | NodeRequire;
  treeLike: string;
  type: CYCLE;
  waterlevel: WATERING;
  sunlevel: SUN;
  growth?: GROWTH;
  category?: e_CategoryLabel[];
};

export type t_PlantDetail = {
  name: string;
  image: string | NodeRequire;
  commonName: string;
  lifeSpan: string;
  description: string;
  family: string;
  origin: string[];
  type: string;
  flower?: string[];
  branches?: string;
  twigs?: string;
  leafs?: string;
  propagation: string[];
  watering: string[];
  sunlight: string[];
  height: string;
};

export type t_PlantDetailBaseInfo = {
  name: string;
  commonName: string;
  image: string | NodeRequire;
  lifeSpan: string;
  watering: string;
  sunlight: string;
};

export type t_CareGuideDetail = {
  image: NodeRequire | string;
  name: string;
  otherName: string;
  lifeSpan: string;
  watering: string;
  sunlight: string;
  waterDetail: string;
  sunlightDetail: string;
  pruning: string;
};

type t_Symptom = {
  symptom_name: string;
  detail: string;
};

export type t_ProblemDetail = {
  image: NodeRequire | string;
  name: string;
  otherName: string;
  definition: string;
  reason: string;
  symptoms: t_Symptom[];
  solution: string;
};
