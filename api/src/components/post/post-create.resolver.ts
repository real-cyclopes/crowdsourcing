import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ErrorType } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { PostReadResolver } from './post-read.resolver';
import { Post, PostCreateInput, PostCreateOutput } from './types';

@Resolver(Post)
export class PostCreateResolver {
  constructor(
    private pg: PostgresService,
    private postRead: PostReadResolver,
  ) {}
  @Mutation(() => PostCreateOutput)
  async postCreateResolver(
    @Args('input') input: PostCreateInput,
    @Context() req: any,
  ): Promise<PostCreateOutput> {
    console.log('post create resolver');
    try {
      const bearer = getBearer(req);

      try {
        const res = await this.pg.pool.query(
          `
          call post_create($1, $2, $3, $4, 0, 0, 0, false, 0, null, 0, 0, 0, '');
        `,
          [],
        );

        const error = res.rows[0].p_error_type;
        const post_id = res.rows[0].p_post_id;
        const candidate = res.rows[0].p_candidate;
        const rank = res.rows[0].p_rank;
        const tie = res.rows[0].p_tie;
        const discussion_election = res.rows[0].p_discussion_election;
        const created_at = res.rows[0].p_created_at;
        const user_id = res.rows[0].p_user_id;
        const part_id = res.rows[0].p_part_id;
        const version_id = res.rows[0].p_version_id;

        if (error !== ErrorType.NoError || !post_id) {
          return {
            error,
            post: null,
          };
        }

        const post_read = await this.postRead.postReadResolver(
          { post_id: post_id },
          req,
        );

        return {
          error,
          post: post_read.post,
        };

        // return {
        //   error,
        //   post: {
        //     candidate,
        //     created_by: {
        //       i: user_id,
        //       c: 1,
        //     },
        //     created_at,
        //     discussion_election,
        //     discussion_max_vote_rank: 0,
        //     discussion_posts_count: 0,
        //     parent_election: input.parent_election,
        //     post_id,
        //     rank,
        //     tie,
        //     zero_based_position: -1,
        //     vote: null,
        //     parts: [
        //       {
        //         part_id,
        //         post_id,
        //         rank: 1,
        //         versions: [],
        //         current_version: {
        //           version_id,
        //           part_id,
        //           content_type: 1,
        //           created_at,
        //           content: input.parts[0],
        //         },
        //         content_type: parts[0].content_type,
        //       },
        //     ],
        //   },
        // }
      } catch (e) {
        console.error(e);
        console.log(`failed to parse json from parts[0]`, input.content);
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      post: null,
    };
  }
}
