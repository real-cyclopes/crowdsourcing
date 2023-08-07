import { useState, useEffect, useMemo, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonPage,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  useIonToast,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import {
  useGetPhraseDefinitionsByPhraseIdQuery,
  useGetPhraseWithVoteByIdQuery,
  useTogglePhraseVoteStatusMutation,
  usePhraseDefinitionUpsertMutation,
  useTogglePhraseDefinitionVoteStatusMutation,
} from '../../../generated/graphql';

import {
  PhraseDefinitionWithVoteListOutput,
  PhraseWithDefinitionlikeStrings,
  PhraseDefinitionWithVote,
  PhraseWithVoteOutput,
  PhraseWithVote,
  ErrorType,
  Phrase,
} from '../../../generated/graphql';

import {
  PhraseWithVoteFragmentFragmentDoc,
  GetPhraseDefinitionsByPhraseIdDocument,
  PhraseDefinitionWithVoteFragmentFragmentDoc,
  PhraseWithDefinitionlikeStringsFragmentFragmentDoc,
} from '../../../generated/graphql';

import { CaptainContainer, CardListContainer, CardContainer } from './styled';
import { Textarea } from '../../common/styled';

import { useTr } from '../../../hooks/useTr';

interface PhraseDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    phrase_id: string;
  }> {}

export function PhraseDetailPage({ match }: PhraseDetailPageProps) {
  const [present] = useIonToast();
  const { tr } = useTr();

  const [allDefinitions, setAllDefinitions] =
    useState<PhraseDefinitionWithVoteListOutput>();
  const [phraseWithVote, setPhraseWithVote] = useState<PhraseWithVoteOutput>();

  const modal = useRef<HTMLIonModalElement>(null);
  const textarea = useRef<HTMLIonTextareaElement>(null);

  const {
    data: definitionData,
    error: definitionError,
    loading: definitionLoading,
    called: definitionCalled,
  } = useGetPhraseDefinitionsByPhraseIdQuery({
    variables: {
      phrase_id: match.params.phrase_id,
    },
  });
  const {
    data: phraseData,
    error: phraseError,
    loading: phraseLoading,
    called: phraseCalled,
  } = useGetPhraseWithVoteByIdQuery({
    variables: {
      phrase_id: match.params.phrase_id,
    },
  });

  const [togglePhraseVoteStatus] = useTogglePhraseVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.togglePhraseVoteStatus.error === ErrorType.NoError &&
        data.togglePhraseVoteStatus.vote_status &&
        phraseData &&
        phraseData.getPhraseWithVoteById.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.togglePhraseVoteStatus.vote_status;

        cache.updateFragment<PhraseWithDefinitionlikeStrings>(
          {
            id: cache.identify({
              __typename: 'PhraseWithDefinitionlikeStrings',
              phrase_id: newVoteStatus.phrase_id,
            }),
            fragment: PhraseWithDefinitionlikeStringsFragmentFragmentDoc,
            fragmentName: 'PhraseWithDefinitionlikeStringsFragment',
          },
          (data) => {
            if (data) {
              return {
                ...data,
                upvotes: newVoteStatus.upvotes,
                downvotes: newVoteStatus.downvotes,
              };
            } else {
              return data;
            }
          },
        );

        cache.updateFragment<PhraseWithVote>(
          {
            id: cache.identify({
              __typename: 'PhraseWithVote',
              phrase_id: newVoteStatus.phrase_id,
            }),
            fragment: PhraseWithVoteFragmentFragmentDoc,
            fragmentName: 'PhraseWithVoteFragment',
          },
          (data) => {
            if (data) {
              return {
                ...data,
                upvotes: newVoteStatus.upvotes,
                downvotes: newVoteStatus.downvotes,
              };
            } else {
              return data;
            }
          },
        );
      } else {
        console.log('useTogglePhraseVoteStatusMutation: ', errors);
        console.log(data?.togglePhraseVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data?.togglePhraseVoteStatus
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
  const [togglePhraseDefinitionVoteStatus] =
    useTogglePhraseDefinitionVoteStatusMutation({
      update(cache, { data, errors }) {
        if (
          !errors &&
          data &&
          data.togglePhraseDefinitionVoteStatus.error === ErrorType.NoError &&
          data.togglePhraseDefinitionVoteStatus.vote_status
        ) {
          const newVoteStatus =
            data.togglePhraseDefinitionVoteStatus.vote_status;

          cache.updateFragment<PhraseDefinitionWithVote>(
            {
              id: cache.identify({
                __typename: 'PhraseDefinitionWithVote',
                phrase_definition_id: newVoteStatus.definition_id,
              }),
              fragment: PhraseDefinitionWithVoteFragmentFragmentDoc,
              fragmentName: 'PhraseDefinitionWithVoteFragment',
            },
            (data) => {
              if (data) {
                return {
                  ...data,
                  upvotes: newVoteStatus.upvotes,
                  downvotes: newVoteStatus.downvotes,
                };
              } else {
                return data;
              }
            },
          );
        } else {
          console.log('useTogglePhraseDefinitionVoteStatusMutation: ', errors);
          console.log(data?.togglePhraseDefinitionVoteStatus.error);

          present({
            message: `${tr('Failed at voting!')} [${data
              ?.togglePhraseDefinitionVoteStatus.error}]`,
            duration: 1500,
            position: 'top',
            color: 'danger',
          });
        }
      },
    });
  const [upsertPhraseDefinition] = usePhraseDefinitionUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.phraseDefinitionUpsert.phrase_definition &&
        data.phraseDefinitionUpsert.error === ErrorType.NoError &&
        definitionData &&
        definitionData.getPhraseDefinitionsByPhraseId.error ===
          ErrorType.NoError
      ) {
        const newDefinition = data.phraseDefinitionUpsert.phrase_definition;

        cache.writeQuery({
          query: GetPhraseDefinitionsByPhraseIdDocument,
          data: {
            ...definitionData,
            getPhraseDefinitionsByPhraseId: {
              ...definitionData.getPhraseDefinitionsByPhraseId,
              phrase_definition_list: [
                ...definitionData.getPhraseDefinitionsByPhraseId
                  .phrase_definition_list,
                {
                  ...newDefinition,
                  __typename: 'PhraseDefinitionWithVote',
                  upvotes: 0,
                  downvotes: 0,
                  created_at: new Date().toISOString(),
                },
              ],
            },
          },
          variables: {
            phrase_id: match.params.phrase_id,
          },
        });

        present({
          message: tr('Success at creating new definition!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });

        modal.current?.dismiss();
      } else {
        console.log('usePhraseDefinitionUpsertMutation: ', errors);
        console.log(data?.phraseDefinitionUpsert.error);

        present({
          message: `${tr('Failed at creating new definition!')} [${data
            ?.phraseDefinitionUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });

  useEffect(() => {
    if (definitionError) {
      return;
    }

    if (definitionLoading || !definitionCalled) {
      return;
    }

    if (definitionData) {
      if (
        definitionData.getPhraseDefinitionsByPhraseId.error !==
        ErrorType.NoError
      ) {
        return;
      }

      setAllDefinitions(definitionData.getPhraseDefinitionsByPhraseId);
    }
  }, [definitionData, definitionError, definitionLoading, definitionCalled]);

  useEffect(() => {
    if (phraseError) {
      return;
    }

    if (phraseLoading || !phraseCalled) {
      return;
    }

    if (phraseData) {
      if (phraseData.getPhraseWithVoteById.error !== ErrorType.NoError) {
        return;
      }

      setPhraseWithVote(phraseData.getPhraseWithVoteById);
    }
  }, [phraseData, phraseError, phraseLoading, phraseCalled]);

  const handleSaveNewDefinition = () => {
    const textareaEl = textarea.current;
    if (!textareaEl) {
      present({
        message: tr('Input or Textarea not exists!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    const textareaVal = (textareaEl.value + '').trim();

    if (textareaVal.length === 0) {
      present({
        message: tr('Definition cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertPhraseDefinition({
      variables: {
        phrase_id: match.params.phrase_id,
        definition: textareaVal,
      },
    });
  };

  const definitions = useMemo(() => {
    const tempDefinitions: {
      phrase_definition_id: string;
      definition: string;
      phrase: Phrase;
      upvotes: number;
      downvotes: number;
      created_at: Date;
    }[] = [];

    if (!allDefinitions) {
      return tempDefinitions;
    }

    for (const definition of allDefinitions.phrase_definition_list) {
      if (definition) {
        tempDefinitions.push({
          phrase_definition_id: definition.phrase_definition_id,
          definition: definition.definition,
          phrase: definition.phrase,
          upvotes: definition.upvotes,
          downvotes: definition.downvotes,
          created_at: new Date(definition.created_at),
        });
      }
    }

    return tempDefinitions;
  }, [allDefinitions]);

  const phraseCom =
    !!phraseWithVote && !!phraseWithVote.phrase_with_vote ? (
      <Card
        content={phraseWithVote.phrase_with_vote.phrase}
        vote={{
          upVotes: phraseWithVote.phrase_with_vote.upvotes,
          downVotes: phraseWithVote.phrase_with_vote.downvotes,
          onVoteUpClick: () => {
            togglePhraseVoteStatus({
              variables: {
                phrase_id: phraseWithVote!.phrase_with_vote!.phrase_id,
                vote: true,
              },
            });
          },
          onVoteDownClick: () => {
            togglePhraseVoteStatus({
              variables: {
                phrase_id: phraseWithVote!.phrase_with_vote!.phrase_id,
                vote: false,
              },
            });
          },
        }}
        voteFor="content"
      />
    ) : null;

  const definitionsCom = definitions
    ? definitions.map((definition) => (
        <Card
          key={definition.phrase_definition_id}
          description={definition.definition}
          vote={{
            upVotes: definition.upvotes,
            downVotes: definition.downvotes,
            onVoteUpClick: () => {
              togglePhraseDefinitionVoteStatus({
                variables: {
                  phrase_definition_id: definition.phrase_definition_id,
                  vote: true,
                },
              });
            },
            onVoteDownClick: () => {
              togglePhraseDefinitionVoteStatus({
                variables: {
                  phrase_definition_id: definition.phrase_definition_id,
                  vote: false,
                },
              });
            },
          }}
          voteFor="description"
        />
      ))
    : null;

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <CaptainContainer>
              <Caption>{tr('Phrase Book')}</Caption>
            </CaptainContainer>

            <CardContainer>{phraseCom}</CardContainer>

            <hr />

            <p style={{ padding: '0 16px', fontSize: 16 }}>
              {tr('Definitions')}
            </p>

            <IonButton id="open-phrase-definition-modal" expand="block">
              + {tr('Add More Definitions')}
            </IonButton>

            <CardListContainer>{definitionsCom}</CardListContainer>

            <IonModal ref={modal} trigger="open-phrase-definition-modal">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modal.current?.dismiss()}>
                      {tr('Cancel')}
                    </IonButton>
                  </IonButtons>
                  <IonTitle>{tr('Phrase Book')}</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <Textarea
                    ref={textarea}
                    labelPlacement="floating"
                    fill="solid"
                    label={tr('Input New Definition')}
                  />
                  <IonButton onClick={handleSaveNewDefinition}>
                    {tr('Save')}
                  </IonButton>
                </div>
              </IonContent>
            </IonModal>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
