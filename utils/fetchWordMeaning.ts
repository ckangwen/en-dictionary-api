import { load } from "cheerio";

export type WordMeaning = Record<string, Array<{ en: string; cn: string }>>;

interface Phonetic {
  region: string;
  pron: string;
  audio: string;
}
interface Explanation {
  partOfSpeech: string;
  meaning: string;
}

export const fetchWordMeaning = async (
  word: string,
): Promise<{
  word: string;
  cambridgeUrl: string;
  phonetics: Phonetic[];
  explanations: Explanation[];
} | null> => {
  const cambridgeUrl = `https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%AE%80%E4%BD%93/${word}`;
  const html = await fetch(cambridgeUrl).then((res) => res.text());

  const $ = load(html);

  if (!$(".di-title")) {
    return null;
  }

  const phonetics: Phonetic[] = [];
  const explanations: Explanation[] = [];
  const basePartOfSpeech = $(".pos-header .dpos").text();

  $(".dpron-i").each(function (this: any) {
    const region = $(this).find(".region.dreg").text();
    const pron = $(this).find(".pron.dpron").text();
    const audio = $("audio source").attr("src");
    if (!phonetics.find((t) => t.region === region)) {
      phonetics.push({
        region,
        pron,
        audio: `https://dictionary.cambridge.org${audio}`,
      });
    }
  });

  $(".entry-body__el .dsense").each(function (this: any) {
    const partOfSpeech = $(this).find(".dsense_h > .dsense_pos").text();

    $(this)
      .find(".sense-body > .def-block")
      .each(function (this: any) {
        const meaning = $(this).find(".def-body > .trans.dtrans.dtrans-se").text();
        explanations.push({
          partOfSpeech: partOfSpeech || basePartOfSpeech,
          meaning,
        });
      });
  });

  return {
    word,
    cambridgeUrl,
    phonetics,
    explanations,
  };
};
