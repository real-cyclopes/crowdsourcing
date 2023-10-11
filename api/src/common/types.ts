import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class GenericOutput {
  @Field(() => ErrorType) readonly error: ErrorType;
}

export enum BotType {
  Google = 'Google',
  Lilt = 'Lilt',
  Smartcat = 'Smartcat',
}

export enum ErrorType {
  AvatarUnavailable = 'AvatarUnavailable',
  AvatarNotFound = 'AvatarNotFound',
  AvatarTooShort = 'AvatarTooShort',
  AvatarTooLong = 'AvatarTooLong',

  CandidateNotFound = 'CandidateNotFound',
  CandidateNotFoundInBallot = 'CandidateNotFoundInBallot',

  ElectionNotFound = 'ElectionNotFound',

  EmailNotFound = 'EmailNotFound',
  EmailTooLong = 'EmailTooLong',
  EmailTooShort = 'EmailTooShort',
  EmailInvalid = 'EmailInvalid',
  EmailIsBlocked = 'EmailIsBlocked',
  EmailUnavailable = 'EmailUnavailable',

  ForumUpsertFailed = 'ForumUpsertFailed',
  ForumDeleteFailed = 'ForumDeleteFailed',

  FileNotExists = 'FileNotExists',
  FileSaveFailed = 'FileSaveFailed',
  FileDeleteFailed = 'FileDeleteFailed',
  FileWithFilenameAlreadyExists = 'FileWithFilenameAlreadyExists',
  FolderIdNotDefined = 'FolderIdNotDefined',
  FolderForThreadNotExists = 'FolderForThreadNotExists',
  ForumForFolderNotExists = 'ForumForFolderNotExists',
  ForumFolderUpsertFailed = 'ForumFolderUpsertFailed',
  ForumFolderDeleteFailed = 'ForumFolderDeleteFailed',

  InvalidEmailOrPassword = 'InvalidEmailOrPassword',
  InvalidInputs = 'InvalidInputs',
  LimitInvalid = 'LimitInvalid',
  NoError = 'NoError',
  OffsetInvalid = 'OffsetInvalid',

  NotificationDeleteFailed = 'NotificationDeleteFailed',
  NotificationInsertFailed = 'NotificationInsertFailed',

  ParentElectionNotFound = 'ParentElectionNotFound',

  PasswordTooLong = 'PasswordTooLong',
  PasswordTooShort = 'PasswordTooShort',
  PasswordInvalid = 'PasswordInvalid',

  PositionInvalid = 'PositionInvalid',
  PostCreateFailed = 'PostCreateFailed',

  PrefixInvalid = 'PrefixInvalid',
  PrefixTooLong = 'PrefixTooLong',
  PrefixTooShort = 'PrefixTooShort',

  RankInvalid = 'RankInvalid',
  RankUnchanged = 'RankUnchanged',

  ThreadUpsertFailed = 'ThreadUpsertFailed',

  TokenInvalid = 'TokenInvalid',

  WordInsertFailed = 'WordInsertFailed',
  WordLikeStringInsertFailed = 'WordLikeStringInsertFailed',

  WordNotFound = 'WordNotFound',

  WordVoteNotFound = 'WordVoteNotFound',

  WordDefinitionNotFound = 'WordDefinitionNotFound',
  WordDefinitionAlreadyExists = 'WordDefinitionAlreadyExists',
  WordDefinitionVoteNotFound = 'WordDefinitionVoteNotFound',

  PhraseDefinitionNotFound = 'PhraseDefinitionNotFound',
  PhraseDefinitionAlreadyExists = 'PhraseDefinitionAlreadyExists',
  PhraseDefinitionVoteNotFound = 'PhraseDefinitionVoteNotFound',

  PhraseNotFound = 'PhraseNotFound',
  PhraseVoteNotFound = 'PhraseVoteNotFound',

  PhraseToPhraseTranslationNotFound = 'PhraseToPhraseTranslationNotFound',
  WordToWordTranslationNotFound = 'WordToWordTranslationNotFound',
  WordToPhraseTranslationNotFound = 'WordToPhraseTranslationNotFound',
  PhraseToWordTranslationNotFound = 'PhraseToWordTranslationNotFound',

  SiteTextWordDefinitionAlreadyExists = 'SiteTextWordDefinitionAlreadyExists',
  SiteTextWordDefinitionNotFound = 'SiteTextWordDefinitionNotFound',
  SiteTextPhraseDefinitionAlreadyExists = 'SiteTextPhraseDefinitionAlreadyExists',
  SiteTextPhraseDefinitionNotFound = 'SiteTextPhraseDefinitionNotFound',

  MapFilenameAlreadyExists = 'MapFilenameAlreadyExists',
  MapInsertFailed = 'MapInsertFailed',
  MapDeletionError = 'MapDeletionError',
  MapNotFound = 'MapNotFound',
  MapVoteNotFound = 'MapVoteNotFound',

  DocumentIdNotProvided = 'DocumentIdNotProvided',
  DocumentNotFound = 'DocumentNotFound',

  PostNotFound = 'PostNotFound',

  Unauthorized = 'Unauthorized',
  UnknownError = 'UnknownError',
  ProvidedIdIsMalformed = 'ProvidedIdIsMalformed',
  PaginationError = 'PaginationError',

  DocumentEntryReadError = 'DocumentEntryReadError',
  DocumentWordEntryInsertFailed = 'DocumentWordEntryInsertFailed',
  DocumentWordEntryAlreadyExists = 'DocumentWordEntryAlreadyExists',
  DocumentWordEntryNotFound = 'DocumentWordEntryNotFound',
  WordRangeInsertFailed = 'WordRangeInsertFailed',

  QuestionItemInsertFailed = 'QuestionItemInsertFailed',
  QuestionInsertFailed = 'QuestionInsertFailed',
  AnswerInsertFailed = 'AnswerInsertFailed',

  PericopeInsertFailed = 'PericopeInsertFailed',
  PericopeNotFound = 'PericopeNotFound',
  PericopeVoteToggleFailed = 'PericopeVoteToggleFailed',

  BotTranslationBotNotFound = 'BotTranslationBotNotFound',
  BotTranslationLanguagesListError = 'BotTranslationLanguagesListError',
}

registerEnumType(ErrorType, {
  name: 'ErrorType',
});

export enum FlagType {
  FastTranslation = 'FastTranslation',
}

registerEnumType(FlagType, {
  name: 'FlagType',
});

export enum TableNameType {
  word_definitions = 'word_definitions',
  phrase_definitions = 'phrase_definitions',

  words = 'words',
  phrases = 'phrases',

  documents = 'documents',
  document_word_entries = 'document_word_entries',
  word_ranges = 'word_ranges',
  original_maps = 'original_maps',
  translated_maps = 'translated_maps',
  pericopies = 'pericopies',
}

registerEnumType(TableNameType, {
  name: 'TableNameType',
});

export interface ITagInfo {
  tag: string | null;
  descriptions?: Array<string>;
}

export type TLang = Omit<ITagInfo, 'tag'> & { tag: string }; // make tag mandatory for Lang tag
export type TRegion = ITagInfo;
export type TDialect = ITagInfo;

export type LanguageInfo = {
  lang: TLang;
  dialect?: TDialect | undefined;
  region?: TRegion | undefined;
};

export type TLangCodes = {
  language_code: string;
  dialect_code?: string | null | undefined;
  geo_code?: string | null | undefined;
};
