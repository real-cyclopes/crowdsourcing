import { LanguageInput } from '../common/types';

export type PericopeTanslationsIdsWithVotesSqlR = {
  pericope_translation_id: string;
  upvotes: number;
  downvotes: number;
};
export function getPericopeTanslationsIdsWithVotesSql({
  pericopeId,
  targetLang: { language_code, dialect_code, geo_code },
}: {
  pericopeId: string;
  targetLang: LanguageInput;
}): [string, [string, string, string?, string?]] {
  const params: [string, string, string?, string?] = [
    pericopeId,
    language_code,
  ];
  let langRestrictionClause = ` and pt.language_code = $${params.length}`;

  if (dialect_code) {
    params.push(dialect_code);
    langRestrictionClause += ` and pt.dialect_code = $${params.length}`;
  }
  if (geo_code) {
    params.push(geo_code);
    langRestrictionClause += ` and pt.geo_code = $${params.length}`;
  }
  return [
    `
    with votes as (	
          select 
            v.pericope_translation_id as pericope_translation_id,  
            count(
              case when v.vote = true then 1 else null end
            ) as upvotes, 
            count(
              case when v.vote = false then 1 else null end
            ) as downvotes
          from 
            pericope_translations_votes AS v 
          group BY 
            v.pericope_translation_id 
          )
    select pt.pericope_translation_id, upvotes, downvotes from pericope_translations pt
          left join votes on pt.pericope_translation_id = votes.pericope_translation_id
          where pt.pericope_id = $1
          ${langRestrictionClause}
    `,
    params,
  ];
}

export type GetPericopeTranslationSqlR = {
  pericope_translation_id: string;
  pericope_id: string;
  translation: string;
  language_code: string;
  dialect_code: string;
  geo_code: string;
  created_at: string;
  created_by: string;
};
export function getPericopeTranslationSql({
  translationIds,
}: {
  translationIds: string[];
}): [string, [string[]]] {
  return [
    `
      select 
        pt.pericope_translation_id, 
        pt.pericope_id,
        pt.translation,
        pt.language_code,
        pt.dialect_code,
        pt.geo_code,
        pt.created_at,
        pt.created_by
      from pericope_translations pt where 
        pericope_translation_id = any($1)
    `,
    [translationIds],
  ];
}
