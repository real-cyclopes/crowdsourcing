import {
  MapPhraseTranslations,
  MapWordTranslations,
} from '../../../generated/graphql';
import { useMapTranslationTools } from '../../map/hooks/useMapTranslationTools';
import { WordOrPhraseCard } from '../WordCard/WordOrPhraseCard';
import { styled } from 'styled-components';
import { TableNameType } from '../../../generated/graphql';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

export type TWordTranslationCardProps = {
  wordTranslated: MapWordTranslations | MapPhraseTranslations;
  routerLink?: string;
  onClick?: () => void;
};

export const TranslatedCards = ({
  wordTranslated: wordOrPhraseTranslated,
  routerLink,
  onClick,
}: TWordTranslationCardProps) => {
  const { chooseBestTranslation } = useMapTranslationTools();

  const wordBestTranslation = chooseBestTranslation(wordOrPhraseTranslated);

  let textOriginal = '';
  let textTranslated = '';
  if (wordOrPhraseTranslated.__typename === 'MapWordTranslations') {
    textOriginal = wordOrPhraseTranslated.word;
  } else if (wordOrPhraseTranslated.__typename === 'MapPhraseTranslations') {
    textOriginal = wordOrPhraseTranslated.phrase;
  }

  if (wordBestTranslation.__typename === 'MapWordWithVotes') {
    textTranslated = wordBestTranslation.word;
  } else if (wordBestTranslation.__typename === 'MapPhraseWithVotes') {
    textTranslated = wordBestTranslation.phrase;
  }

  return (
    <StCards>
      <StCard>
        <WordOrPhraseCard
          value={textOriginal}
          definition={wordOrPhraseTranslated.definition}
          onClick={onClick}
          routerLink={routerLink}
          flags={{
            parent_table:
              wordOrPhraseTranslated.__typename === 'MapWordTranslations'
                ? TableNameType.WordDefinitions
                : TableNameType.Phrases,
            parent_id: wordOrPhraseTranslated.definition_id!,
            flag_names: WORD_AND_PHRASE_FLAGS,
          }}
        />
      </StCard>
      <StCard>
        <WordOrPhraseCard
          value={textTranslated}
          definition={wordBestTranslation?.definition || ''}
          onClick={onClick}
          routerLink={routerLink}
        />
      </StCard>
    </StCards>
  );
};

const StCards = styled.div`
  display: flex;
  flex-direction: row;
`;

const StCard = styled.div`
  width: 50%;
  & > * {
    cursor: pointer;
  }
`;
