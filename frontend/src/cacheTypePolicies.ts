import { TypePolicies } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

export const typePolicies: TypePolicies = {
  Query: {
    fields: {
      getWordsByLanguage: relayStylePagination(['input']),
      getPhrasesByLanguage: relayStylePagination(['input']),
      getWordDefinitionsByFlag: relayStylePagination(['flag_name']),
      getPhraseDefinitionsByFlag: relayStylePagination(['flag_name']),
      getAllMapsList: relayStylePagination(['input']),
      getOrigMapWordsAndPhrases: relayStylePagination(['input']),
      getSingleMapWordsAndPhrases: relayStylePagination(['input']),
      getAllSiteTextDefinitions: relayStylePagination(['filters']),
      getForumsList: relayStylePagination(['filter']),
      getForumFoldersList: relayStylePagination(['forum_id', 'filter']),
      getThreadsList: relayStylePagination(['forum_folder_id', 'filter']),
    },
  },
  WordWithDefinitions: {
    keyFields: ['word_id'],
  },
  WordDefinitionWithVote: {
    keyFields: ['word_definition_id'],
  },
  WordWithVote: {
    keyFields: ['word_id'],
  },
  WordWithVoteListEdge: {
    keyFields: ['cursor'],
  },
  WordVoteStatus: {
    keyFields: ['word_id'],
  },
  PhraseWithDefinitions: {
    keyFields: ['phrase_id'],
  },
  PhraseDefinitionWithVote: {
    keyFields: ['phrase_definition_id'],
  },
  PhraseWithVote: {
    keyFields: ['phrase_id'],
  },
  PhraseWithVoteListEdge: {
    keyFields: ['cursor'],
  },
  PhraseVoteStatus: {
    keyFields: ['phrase_id'],
  },
  Phrase: {
    keyFields: ['phrase_id'],
  },
  Word: {
    keyFields: ['word_id'],
  },
  WordDefinition: {
    keyFields: ['word_definition_id'],
  },
  PhraseDefinition: {
    keyFields: ['phrase_definition_id'],
  },
  SiteTextPhraseDefinition: {
    keyFields: ['site_text_id'],
  },
  SiteTextWordDefinition: {
    keyFields: ['site_text_id'],
  },
  SiteTextWordDefinitionEdge: {
    keyFields: ['cursor'],
  },
  SiteTextPhraseDefinitionEdge: {
    keyFields: ['cursor'],
  },
  SiteTextDefinitionEdge: {
    keyFields: ['cursor'],
  },
  WordToWordTranslationWithVote: {
    keyFields: ['word_to_word_translation_id'],
  },
  WordToPhraseTranslationWithVote: {
    keyFields: ['word_to_phrase_translation_id'],
  },
  PhraseToWordTranslationWithVote: {
    keyFields: ['phrase_to_word_translation_id'],
  },
  PhraseToPhraseTranslationWithVote: {
    keyFields: ['phrase_to_phrase_translation_id'],
  },
  WordToWordTranslation: {
    keyFields: ['word_to_word_translation_id'],
  },
  WordToPhraseTranslation: {
    keyFields: ['word_to_phrase_translation_id'],
  },
  PhraseToWordTranslation: {
    keyFields: ['phrase_to_word_translation_id'],
  },
  PhraseToPhraseTranslation: {
    keyFields: ['phrase_to_phrase_translation_id'],
  },
  Post: {
    keyFields: ['post_id'],
  },
  Flag: {
    keyFields: ['flag_id'],
  },
  TextyDocument: {
    keyFields: ['document_id'],
  },
  MapFileOutputEdge: {
    keyFields: ['cursor'],
  },
  MapWordsAndPhrasesEdge: {
    keyFields: ['cursor'],
  },
  MapVoteStatus: {
    keyFields: ['map_id', 'is_original'],
  },
  Question: {
    keyFields: ['question_id'],
  },
  QuestionOnWordRange: {
    keyFields: ['question_id'],
  },
  Answer: {
    keyFields: ['answer_id'],
  },
  Pericope: {
    keyFields: ['pericope_id'],
  },
  PericopeVoteStatus: {
    keyFields: ['pericope_id'],
  },
  Forum: {
    keyFields: ['forum_id'],
  },
  ForumFolder: {
    keyFields: ['forum_folder_id'],
  },
  Thread: {
    keyFields: ['thread_id'],
  },
  ForumEdge: {
    keyFields: ['cursor'],
  },
  ForumFolderEdge: {
    keyFields: ['cursor'],
  },
  ThreadEdge: {
    keyFields: ['cursor'],
  },
};
