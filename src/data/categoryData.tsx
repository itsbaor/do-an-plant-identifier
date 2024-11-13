export type t_CategoryObject = {
  label: e_CategoryLabel;
  image?: NodeRequire;
};

export enum e_CategoryLabel {
  ALL = 'All',
  OUTDOOR = 'Outdoor',
  INDOOR = 'Indoor',
  MEDICINAL = 'Medicinal',
  RARE = 'Rare',
  FRUITS = 'Fruits',
  FLOWERS = 'Flowers',
  POISONOUS = 'Poisonous',
  EDIBLE = 'Edible',
}

export const categoryData: t_CategoryObject[] = [
  {
    label: e_CategoryLabel.ALL,
  },
  {
    label: e_CategoryLabel.OUTDOOR,
    image: require('~/resources/images/category/outdoor.png'),
  },
  {
    label: e_CategoryLabel.INDOOR,
    image: require('~/resources/images/category/indoor.png'),
  },
  {
    label: e_CategoryLabel.MEDICINAL,
    image: require('~/resources/images/category/medical.png'),
  },
  {
    label: e_CategoryLabel.RARE,
    image: require('~/resources/images/category/rare.png'),
  },
  {
    label: e_CategoryLabel.FRUITS,
    image: require('~/resources/images/category/fruit.png'),
  },
  {
    label: e_CategoryLabel.FLOWERS,
    image: require('~/resources/images/category/flower.png'),
  },
  {
    label: e_CategoryLabel.POISONOUS,
    image: require('~/resources/images/category/poisonous.png'),
  },
  {
    label: e_CategoryLabel.EDIBLE,
    image: require('~/resources/images/category/edible.png'),
  },
];
