export type t_SubcriptionDetail = {
  basePlanId: string;
  offerId?: any;
  offerTags?: any;
  offerToken: string;
  pricingPhases?: any;
  currency?: any;
  price?: any;
};

export type t_Subcription = {
  description: string;
  name: string;
  platform: string;
  productId: string;
  productType: string;
  subscriptionOfferDetails: t_SubcriptionDetail[];
  title: string;
};
