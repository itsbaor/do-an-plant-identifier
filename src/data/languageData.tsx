import {t_LangObject} from '~/@types/language';
import IconEnglish from '~/resources/icons/languages/IconEnglish';
import IconGermany from '~/resources/icons/languages/IconGermany';
import IconHindi from '~/resources/icons/languages/IconHindi';
import IconIndonesian from '~/resources/icons/languages/IconIndonesian';
import IconJapanese from '~/resources/icons/languages/IconJapanese';
import IconKorean from '~/resources/icons/languages/IconKorean';
import IconPortuguese from '~/resources/icons/languages/IconPortuguese';
import IconSpanish from '~/resources/icons/languages/IconSpanish';

export const langList: t_LangObject[] = [
  {id: 'en', name: 'English', image: <IconEnglish />},
  {id: 'hi', name: 'Hindi', image: <IconHindi />},
  {id: 'ja', name: 'Japanese', image: <IconJapanese />},
  {id: 'de', name: 'Germany', image: <IconGermany />},
  {id: 'id', name: 'Indonesian', image: <IconIndonesian />},
  {id: 'pt', name: 'Portuguese', image: <IconPortuguese />},
  {id: 'ko', name: 'Korean', image: <IconKorean />},
  {id: 'es', name: 'Spanish', image: <IconSpanish />},
];
