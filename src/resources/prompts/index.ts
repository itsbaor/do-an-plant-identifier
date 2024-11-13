import {t_Lang} from '~/@types/language';
import {LANG_MAP_VALUE} from '~/screens/LanguageScreen';

export const PROMPT_CHECK_IS_PLANT = `
I have a picture, please return me only "true" or "false":
Response data when the image is a clear plant: 
  "true"

Response data when the image does not contain any plant or the plant image is not clear: 
  "false"
`;

export const getPromtDetailPlant = (langId: t_Lang) => {
  const lang: string = LANG_MAP_VALUE[langId as keyof typeof LANG_MAP_VALUE];
  return `
I give you a plant name.
    Please return only the JSON format
    If there is any field that you not sure then let the value is null
    Response data follow this example: 
      {
         "description": Description of the plant in ${lang},
         "family": family name of the plant,
         "origin": Array of the origin country that the plant appear in ${lang},
         "type": type of the plant(Perennial or Annuals or Biennials) in ${lang},
         "flower": Array of plant's flower color in ${lang},
         "branches": one word of plant's branch color in ${lang},
         "twigs": One word of plant's twigs color in ${lang},
         "leafs": One word of plant's leaf color in ${lang},
         "propagation": Array of propagation ways of the plant in ${lang},
         "watering": Array of water needing to grow the plant in (Frequent / Average / Minimal) in ${lang},
         "sunlight": Array of sunlight needed to grow the plant in (Full Sun / Part Shade / Full Shade / Sun-Part Shade) in ${lang},
         "height": Plant's average height in feet,
      }
`;
};

export const getPromtIdentifyPremium = (langId: t_Lang) => {
  const lang: string = LANG_MAP_VALUE[langId as keyof typeof LANG_MAP_VALUE];
  return `
I have JSON data is an Array. Each element is in this format {"name": string, "image": string}. Field "name" is the name of a plant in English 
    Please return only the JSON format
    If there is any field that you not sure then let the value is null
    Each response data in the array follow this example:
       {
          "name": value of the given "name" field,
          "image": value of the given "image" field,
          "other_name": According to the "name" field, give the correct common name of the plant,
	      "life_span": According to the "name" field, give the lifespan of the that plant (Perennial/Annuals/Biennials) in ${lang},
      	  "watering": According to the "name" field, give the water needed to grow plant (Frequent / Average / Minimal) in ${lang},
          "sunlight": According to the "name" field, give the sunlight needed to grow the plant (Full Sun / Part Shade / Full Shade / Sun-Part Shade) in ${lang},
       }
`;
};

export const getPromtIdentify = (langId: t_Lang) => {
  const lang: string = LANG_MAP_VALUE[langId as keyof typeof LANG_MAP_VALUE];
  return `
  Please help detect the following information and return only the JSON format:
{
  "name": "provide the correct scientific name of the plant, including the genus and species (e.g., Rosa rubiginosa)",
  "other_name": "list any common names or regional names the plant is known by (e.g., Sweet Briar Rose, Eglantine)",
  "life_span": "indicate the lifespan of the plant (Perennial/Annual/Biennial)" in ${lang},
  "watering": "water requirement, specify the water needs to grow the plant (Frequent / Average / Minimal)" in ${lang},
  "sunlight": "sunlight requirement, describe the sunlight requirements for the plant (Full Sun / Part Shade / Full Shade / Sun-Part Shade) in ${lang}"
}

If you are uncertain about any field, please leave the value as null.

Make sure to analyze the image closely to provide the most accurate scientific and common names, along with the other details. Your response should focus on identifying the plant accurately based on the provided image
`;
};

export const getPromtDiagnose = () => {
  return `
  Please help detect the plant disease in the following information and return only the JSON format:
{
  "isPlantImage": return true if the image contains plant, otherwise false,
  "isHealthy": return true if the plant in image is healthy, otherwise false,
  "name": "provide the name of the disease (e.g., Black spot)",
  "probability": "The probability (2 to 100) in Integer that the disease is occuring",
}
If you are uncertain about any field, please leave the value as null.

Make sure to analyze the image closely to provide the most accurate scientific name, along with the other details. Your response should focus on diagnose the disease accurately based on the provided image
`;
};

export const getPromtAi = (langId: t_Lang) => {
  const lang: string = LANG_MAP_VALUE[langId as keyof typeof LANG_MAP_VALUE];
  return `
  I have a question, if the question is not about plant or anything related to plant please just say: "*!*Sorry! I don't have an answer for this question" in ${lang}. If it does, answer the question in ${lang}.
`;
};

export const getPromtDetailProblem = (langId: t_Lang) => {
  const lang: string = LANG_MAP_VALUE[langId as keyof typeof LANG_MAP_VALUE];
  return `
   I have a name of a disease on plant.
    Please return only the JSON format
    If there is any field that you not sure then let the value is "No Information"
    Response data follow this example:
       {
          "definition": Give me the definition of the disease in 1 paragraph in ${lang},
	        "reason": Give me the reason why the disease happen in 1 paragraph in ${lang},
      	  "symptoms": Give me an array of symptoms and each element in the array has this format{
                        "symptom_name": name of the symptom in ${lang},
                        "detail": short paragarph about that symptom in ${lang}
                      },
          "solution": Solutions to cure the plant that have that disease in 1 paragraph in ${lang},
       }
`;
};

export const getPromtDetailCareGuide = (langId: t_Lang) => {
  const lang: string = LANG_MAP_VALUE[langId as keyof typeof LANG_MAP_VALUE];
  return `
I give you a plant name.
    Please return only the JSON format
    If there is any field that you not sure then let the value is "No Information" in ${lang}
    Response data follow this example: 
      {
         "otherName": give me the other name of the plant,
         "lifeSpan": give the lifespan of the that plant (Perennial or Annual or Biennial) in ${lang},
         "watering": Water needed to grow the plant (Frequent or Average or Minimal) in ${lang},
         "sunlight": Sunlight needed to grow the plant (Full Shade or Part Shade or Sun-Part Shade or Full Sun) in ${lang},
         "waterDetail": A paragraph about how to watering the plant in ${lang},
         "sunlightDetail": A paragraph about the sunlight needed for the plant in ${lang},
         "pruning": A paragraph about how to pruning the plant in ${lang},
      }
`;
};
