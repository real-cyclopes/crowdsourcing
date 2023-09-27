type TMap = {
  id: string;
  name: string;
  createdAt: string;
  createdByUserId?: string;
  languageCode: string;
  dialectCode?: string;
  geoCode?: string;
};

type TMapWithContent = TMap & {
  content: string;
};

type TMapsList = TMap[];
type TMapWithContentList = TMapWithContent[];

// got from graphql autogenerated types
type TTranslationAnyToAny =
  | {
      __typename?: 'PhraseToPhraseTranslationWithVote';
      phrase_to_phrase_translation_id: string;
      downvotes: number;
      upvotes: number;
      from_phrase_definition: {
        __typename?: 'PhraseDefinition';
        phrase_definition_id: string;
        definition: string;
        created_at: string;
        phrase: {
          __typename?: 'Phrase';
          phrase_id: string;
          phrase: string;
          language_code: string;
          dialect_code?: string | null;
          geo_code?: string | null;
        };
      };
      to_phrase_definition: {
        __typename?: 'PhraseDefinition';
        phrase_definition_id: string;
        definition: string;
        created_at: string;
        phrase: {
          __typename?: 'Phrase';
          phrase_id: string;
          phrase: string;
          language_code: string;
          dialect_code?: string | null;
          geo_code?: string | null;
        };
      };
    }
  | {
      __typename?: 'PhraseToWordTranslationWithVote';
      phrase_to_word_translation_id: string;
      downvotes: number;
      upvotes: number;
      from_phrase_definition: {
        __typename?: 'PhraseDefinition';
        phrase_definition_id: string;
        definition: string;
        created_at: string;
        phrase: {
          __typename?: 'Phrase';
          phrase_id: string;
          phrase: string;
          language_code: string;
          dialect_code?: string | null;
          geo_code?: string | null;
        };
      };
      to_word_definition: {
        __typename?: 'WordDefinition';
        word_definition_id: string;
        definition: string;
        created_at: string;
        word: {
          __typename?: 'Word';
          word_id: string;
          word: string;
          language_code: string;
          dialect_code?: string | null;
          geo_code?: string | null;
        };
      };
    }
  | {
      __typename?: 'WordToPhraseTranslationWithVote';
      word_to_phrase_translation_id: string;
      downvotes: number;
      upvotes: number;
      from_word_definition: {
        __typename?: 'WordDefinition';
        word_definition_id: string;
        definition: string;
        created_at: string;
        word: {
          __typename?: 'Word';
          word_id: string;
          word: string;
          language_code: string;
          dialect_code?: string | null;
          geo_code?: string | null;
        };
      };
      to_phrase_definition: {
        __typename?: 'PhraseDefinition';
        phrase_definition_id: string;
        definition: string;
        created_at: string;
        phrase: {
          __typename?: 'Phrase';
          phrase_id: string;
          phrase: string;
          language_code: string;
          dialect_code?: string | null;
          geo_code?: string | null;
        };
      };
    }
  | {
      __typename?: 'WordToWordTranslationWithVote';
      word_to_word_translation_id: string;
      downvotes: number;
      upvotes: number;
      from_word_definition: {
        __typename?: 'WordDefinition';
        word_definition_id: string;
        definition: string;
        created_at: string;
        word: {
          __typename?: 'Word';
          word_id: string;
          word: string;
          language_code: string;
          dialect_code?: string | null;
          geo_code?: string | null;
        };
      };
      to_word_definition: {
        __typename?: 'WordDefinition';
        word_definition_id: string;
        definition: string;
        created_at: string;
        word: {
          __typename?: 'Word';
          word_id: string;
          word: string;
          language_code: string;
          dialect_code?: string | null;
          geo_code?: string | null;
        };
      };
    }
  | null;
