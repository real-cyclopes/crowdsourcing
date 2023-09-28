import { Field, ID, Int, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput, TableNameType } from 'src/common/types';
import { DocumentWordEntry } from 'src/components/documents/types';

@ObjectType()
export class QuestionItem {
  @Field(() => ID) question_item_id: string;
  @Field(() => String) item: string;
}

@ObjectType()
export class Question {
  @Field(() => ID) question_id: string;
  @Field(() => TableNameType) parent_table: TableNameType;
  @Field(() => String) parent_id: string;
  @Field(() => Boolean) question_type_is_multiselect: boolean;
  @Field(() => String) question: string;
  @Field(() => [QuestionItem]) question_items: QuestionItem[];
  @Field(() => Date) created_at: Date;
  @Field(() => String) created_by: string;
}

@ObjectType()
export class QuestionOnWordRange extends Question {
  @Field(() => DocumentWordEntry) begin: DocumentWordEntry;
  @Field(() => DocumentWordEntry) end: DocumentWordEntry;
}

@ObjectType()
export class Answer {
  @Field(() => ID) answer_id: string;
  @Field(() => String) question_id: string;
  @Field(() => String, { nullable: true }) answer: string | null;
  @Field(() => [QuestionItem]) question_items: QuestionItem[];
  @Field(() => Date) created_at: Date;
  @Field(() => String) created_by: string;
}

@ObjectType()
export class QuestionItemsOutput extends GenericOutput {
  @Field(() => [QuestionItem], { nullable: true })
  question_items: (QuestionItem | null)[];
}

@ObjectType()
export class QuestionsOutput extends GenericOutput {
  @Field(() => [Question], { nullable: 'items' })
  questions: (Question | null)[];
}

@ObjectType()
export class QuestionOnWordRangesOutput extends GenericOutput {
  @Field(() => [QuestionOnWordRange], { nullable: 'items' })
  questions: (QuestionOnWordRange | null)[];
}

@ObjectType()
export class AnswersOutput extends GenericOutput {
  @Field(() => [Answer], { nullable: 'items' })
  answers: (Answer | null)[];
}

@InputType()
export class QuestionUpsertInput {
  @Field(() => TableNameType) parent_table: TableNameType;
  @Field(() => Int) parent_id: string;
  @Field(() => Boolean) question_type_is_multiselect: boolean;
  @Field(() => String) question: string;
  @Field(() => [String]) question_items: string[];
}

@InputType()
export class CreateQuestionOnWordRangeUpsertInput {
  @Field(() => ID) begin_document_word_entry_id: string;
  @Field(() => ID) end_document_word_entry_id: string;
  @Field(() => Boolean) question_type_is_multiselect: boolean;
  @Field(() => String) question: string;
  @Field(() => [String]) question_items: string[];
}

@InputType()
export class AnswerUpsertInput {
  @Field(() => ID) question_id: string;
  @Field(() => String) answer: string;
  @Field(() => [String]) question_item_ids: string[];
}
