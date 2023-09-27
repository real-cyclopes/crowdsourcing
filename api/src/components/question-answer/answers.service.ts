import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { AnswersOutput, AnswerUpsertInput, QuestionItem } from './types';

import {
  callAnswerUpsertsProcedure,
  AnswerUpsertsProcedureOutput,
  getAnswersObjByIds,
  GetAnswersObjectByIds,
} from './sql-string';
import { QuestionItemsService } from './question-items.service';

@Injectable()
export class AnswersService {
  constructor(
    private pg: PostgresService,
    private questionItemService: QuestionItemsService,
  ) {}

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<AnswersOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAnswersObjectByIds>(...getAnswersObjByIds(ids));

      const answersMap = new Map<string, GetAnswersObjectByIds>();

      const questionItemIds: number[] = [];

      res.rows.forEach((row) => {
        answersMap.set(row.question_id, row);
        row.question_items.forEach((item) => questionItemIds.push(+item));
      });

      const { error: questionItemError, question_items } =
        await this.questionItemService.reads(questionItemIds, pgClient);

      if (questionItemError !== ErrorType.NoError) {
        return {
          error: questionItemError,
          answers: [],
        };
      }

      const questionItemsMap = new Map<string, QuestionItem>();

      question_items.forEach((question_item) =>
        question_item
          ? questionItemsMap.set(question_item.question_item_id, question_item)
          : null,
      );

      return {
        error: ErrorType.NoError,
        answers: ids.map((id) => {
          const answerObj = answersMap.get(id + '');

          if (!answerObj) {
            return null;
          }

          const questionItems = answerObj.question_items
            .map(
              (question_item_id) =>
                questionItemsMap.get(question_item_id) || null,
            )
            .filter((questionItem) => questionItem) as QuestionItem[];

          return {
            ...answerObj,
            question_items: questionItems,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      answers: [],
    };
  }

  async upserts(
    input: AnswerUpsertInput[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<AnswersOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        answers: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<AnswerUpsertsProcedureOutput>(
        ...callAnswerUpsertsProcedure({
          question_ids: input.map((item) => +item.question_id),
          answers: input.map((item) => item.answer),
          question_items_list: input.map((item) =>
            item.question_items.map((id) => +id),
          ),
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const answer_ids = res.rows[0].p_answer_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          answers: [],
        };
      }

      return this.reads(
        answer_ids.map((id) => +id),
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      answers: [],
    };
  }
}
