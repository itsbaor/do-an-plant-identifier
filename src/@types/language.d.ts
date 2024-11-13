export type t_Lang = 'de' | 'en' | 'es' | 'hi' | 'id' | 'ja' | 'ko' | 'pt' | '';

export type t_LangObject = {
  id: t_Lang;
  name: string;
  image: JSX.Element;
};
