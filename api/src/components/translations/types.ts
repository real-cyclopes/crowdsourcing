import { Args, Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

import { GenericOutput } from 'src/common/types';

import { WordDefinition } from 'src/components/definitions/types';
import { PhraseDefinition } from 'src/components/definitions/types';
import { WordUpsertInput } from '../words/types';

@ObjectType()
export class WordToWordTranslation {
  @Field(() => ID) word_to_word_translation_id: string;
  @Field(() => WordDefinition) from_word_definition: WordDefinition;
  @Field(() => WordDefinition) to_word_definition: WordDefinition;
}

@ObjectType()
export class WordToPhraseTranslation {
  @Field(() => ID) word_to_phrase_translation_id: string;
  @Field(() => WordDefinition) from_word_definition: WordDefinition;
  @Field(() => PhraseDefinition) to_phrase_definition: PhraseDefinition;
}

@ObjectType()
export class PhraseToPhraseTranslation {
  @Field(() => ID) phrase_to_phrase_translation_id: string;
  @Field(() => PhraseDefinition) from_phrase_definition: PhraseDefinition;
  @Field(() => PhraseDefinition) to_phrase_definition: PhraseDefinition;
}

@InputType()
export class WordToWordTranslationUpsertInput {
  @Field(() => ID) from_word_definition_id: string;
  @Field(() => ID) to_word_definition_id: string;
}

@InputType()
export class WordToPhraseTranslationUpsertInput {
  @Field(() => ID) from_word_definition_id: string;
  @Field(() => ID) to_phrase_definition_id: string;
}

@InputType()
export class PhraseToPhraseTranslationUpsertInput {
  @Field(() => ID) from_phrase_definition_id: string;
  @Field(() => ID) to_phrase_definition_id: string;
}

@ObjectType()
export class WordToWordTranslationUpsertOutput extends GenericOutput {
  @Field(() => WordToWordTranslation, { nullable: true })
  word_to_word_translation: WordToWordTranslation | null;
}

@ObjectType()
export class WordToPhraseTranslationUpsertOutput extends GenericOutput {
  @Field(() => WordToPhraseTranslation, { nullable: true })
  word_to_phrase_translation: WordToPhraseTranslation | null;
}

@ObjectType()
export class PhraseToPhraseTranslationUpsertOutput extends GenericOutput {
  @Field(() => PhraseToPhraseTranslation, { nullable: true })
  phrase_to_phrase_translation: PhraseToPhraseTranslation | null;
}

@ObjectType()
export class WordToWordTranslationReadOutput extends GenericOutput {
  @Field(() => WordToWordTranslation, { nullable: true })
  word_to_word_translation: WordToWordTranslation | null;
}

@ObjectType()
export class WordToPhraseTranslationReadOutput extends GenericOutput {
  @Field(() => WordToPhraseTranslation, { nullable: true })
  word_to_phrase_translation: WordToPhraseTranslation | null;
}

@ObjectType()
export class PhraseToPhraseTranslationReadOutput extends GenericOutput {
  @Field(() => PhraseToPhraseTranslation, { nullable: true })
  phrase_to_phrase_translation: PhraseToPhraseTranslation | null;
}

@InputType()
export class AddWordAsTranslationForWordInput {
  @Field(() => String) originalDefinitionId: string;
  @Field(() => WordUpsertInput) translationWord: WordUpsertInput;
  @Field(() => String) translationDefinition: string;
}

@ObjectType()
export class AddWordAsTranslationForWordOutput extends GenericOutput {
  @Field(() => String) wordTranslationId: string;
}

@ObjectType()
export class WordTrVoteStatus {
  @Field(() => String) word_to_word_translation_id: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@InputType()
export class WordTrVoteStatusInput extends GenericOutput {
  @Field(() => ID) word_to_word_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}
@ObjectType()
export class WordTrVoteStatusOutputRow extends GenericOutput {
  @Field(() => WordTrVoteStatus, { nullable: true })
  vote_status: WordTrVoteStatus;
}
