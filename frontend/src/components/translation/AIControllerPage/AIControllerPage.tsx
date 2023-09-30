import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  IonButton,
  useIonLoading,
  useIonToast,
  IonSpinner,
  IonToggle,
  IonLabel,
  IonTitle,
} from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { LangSelector } from '../../common/LangSelector/LangSelector';

import { FilterContainer, CaptionContainer } from '../../common/styled';
import {
  ResultBoard,
  LoadingBoard,
  Stack,
  LanguageSectionContainer,
  LanguageSelectorContainer,
  AIContainer,
  AIActionsContainer,
} from './styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import {
  useLanguagesForGoogleTranslateQuery,
  useTranslateWordsAndPhrasesByGoogleMutation,
  useTranslateAllWordsAndPhrasesByGoogleMutation,
  useStopGoogleTranslationMutation,
  useSubscribeToTranslationReportSubscription,
  TranslateAllWordsAndPhrasesByGoogleResult,
  useMapsReTranslateMutation,
  useGetTranslationLanguageInfoLazyQuery,
} from '../../../generated/graphql';

import { langInfo2String, langInfo2tag } from '../../../common/langUtils';

function messageHTML({
  total,
  completed,
  message,
}: {
  total: number;
  completed: number;
  message: string;
}) {
  return `
    <div>
      <h5>${total} / ${completed}</h5>
      <span>${message}</span>
    </div>
  `;
}

export function AIControllerPage() {
  const { tr } = useTr();
  const [presentToast] = useIonToast();
  const [presentLoading, dismiss] = useIonLoading();
  const [selectTarget, setSelectTarget] = useState<boolean>(true);

  const {
    states: {
      global: {
        langauges: {
          translationPage: { source, target },
        },
      },
    },
    actions: {
      changeTranslationSourceLanguage,
      changeTranslationTargetLanguage,
    },
  } = useAppContext();

  const {
    data: languagesData,
    error: languagesError,
    loading: languagesLoading,
  } = useLanguagesForGoogleTranslateQuery();
  const [translateWordsAndPhrasesByGoogle] =
    useTranslateWordsAndPhrasesByGoogleMutation();
  const [translateAllWordsAndPhrasesByGoogle] =
    useTranslateAllWordsAndPhrasesByGoogleMutation();
  const { data: translationResult } =
    useSubscribeToTranslationReportSubscription();

  const [getLangInfo, { data: languageData }] =
    useGetTranslationLanguageInfoLazyQuery();

  const [mapsReTranslate] = useMapsReTranslateMutation();
  const [stopGoogleTranslation] = useStopGoogleTranslationMutation();

  const batchTranslatingRef = useRef<boolean>(false);
  const [batchTranslating, setBatchTranslating] = useState<boolean>(false);
  const [batchStatus, setBatchStatus] = useState<{
    completed: number;
    total: number;
    message: string;
  } | null>(null);
  const [result, setResult] =
    useState<TranslateAllWordsAndPhrasesByGoogleResult | null>(null);
  const [isStopPressed, setIsStopPressed] = useState<boolean>(false);

  useEffect(() => {
    if (source) {
      getLangInfo({
        variables: {
          from_language_code: source.lang.tag,
          to_language_code: target?.lang.tag,
        },
      });
    }
    return;
  }, [getLangInfo, source, target?.lang.tag]);

  useEffect(() => {
    if (translationResult && translationResult.TranslationReport) {
      const report = translationResult.TranslationReport;

      if (report.message) {
        setBatchStatus({
          completed: report.completed || 0,
          total: report.total || 0,
          message: report.message || '',
        });
      }

      if (report.status !== 'Progressing') {
        setBatchStatus(null);
        setBatchTranslating(false);
        batchTranslatingRef.current = false;
      } else {
        setBatchTranslating(true);
        setIsStopPressed(false);
        batchTranslatingRef.current = true;
      }

      setResult(report);
    }
  }, [translationResult]);

  const enabledTags = useMemo(() => {
    return !languagesError &&
      !languagesLoading &&
      languagesData &&
      languagesData.languagesForGoogleTranslate.languages
      ? languagesData.languagesForGoogleTranslate.languages.map(
          (language) => language.code,
        )
      : [];
  }, [languagesError, languagesLoading, languagesData]);

  const handleTranslate = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      handleTranslateToAllLangs();
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }
    presentLoading({
      message: messageHTML({
        total: 1,
        completed: 0,
        message: `${tr('Translate')} ${langInfo2String(source)} ${tr(
          'into',
        )} ${langInfo2String(target)} ...`,
      }),
    });

    const { data } = await translateWordsAndPhrasesByGoogle({
      variables: {
        from_language_code: source.lang.tag,
        from_dialect_code: source.dialect?.tag,
        from_geo_code: source.region?.tag,
        to_language_code: target.lang.tag,
        to_dialect_code: target.dialect?.tag,
        to_geo_code: target.region?.tag,
      },
    });

    dismiss();

    if (data && data.translateWordsAndPhrasesByGoogle.result) {
      setResult(data.translateWordsAndPhrasesByGoogle.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleTranslateToAllLangs = useCallback(async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
      });

      return;
    }

    setBatchTranslating(true);
    batchTranslatingRef.current = true;

    translateAllWordsAndPhrasesByGoogle({
      variables: {
        from_language_code: source.lang.tag,
        from_dialect_code: source.dialect?.tag,
        from_geo_code: source.region?.tag,
      },
    });
  }, [presentToast, source, tr, translateAllWordsAndPhrasesByGoogle]);

  const handleCancelTranslateAll = async () => {
    setIsStopPressed(true);
    await stopGoogleTranslation();
  };

  const resultCom = result ? (
    <ResultBoard>
      <span>{tr('Requested Total Charactors')}</span> :
      <span>{result.requestedCharactors}</span>
      <br />
      <span>{tr('Total Words')}</span> :<span>{result.totalWordCount}</span>
      <br />
      <span>{tr('Total Translation for Words')}</span> :
      <span>{result.translatedWordCount}</span>
      <br />
      <span>{tr('Total Phrases')}</span> :<span>{result.totalPhraseCount}</span>
      <br />
      <span>{tr('Total Translation for Phrases')}</span> :
      <span>{result.totalPhraseCount}</span>
      <br />
    </ResultBoard>
  ) : null;

  const loadingCom =
    batchTranslating && batchStatus ? (
      <LoadingBoard>
        <Stack>
          {batchTranslating ? <IonSpinner name="bubbles" /> : null}
          <h5>
            {tr('Progress')} : {batchStatus.completed} / {batchStatus.total}
          </h5>
          <IonButton
            color="danger"
            onClick={handleCancelTranslateAll}
            disabled={!batchTranslating || isStopPressed}
          >
            {isStopPressed ? `${tr('Canceling')}...` : tr('Cancel')}
          </IonButton>
        </Stack>

        <span>{batchStatus.message}</span>
      </LoadingBoard>
    ) : null;

  const disabled = batchTranslating;

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('AI Controller')}</Caption>
      </CaptionContainer>

      <FilterContainer>
        <LanguageSectionContainer>
          <LanguageSelectorContainer>
            <IonLabel>Source</IonLabel>
            <LangSelector
              title={tr('Source language')}
              langSelectorId="translation-g-source-langSelector"
              selected={source as LanguageInfo | undefined}
              onChange={(_sourceLangTag, sourceLangInfo) => {
                changeTranslationSourceLanguage(sourceLangInfo);
              }}
              onClearClick={() => changeTranslationSourceLanguage(null)}
              enabledTags={enabledTags}
              disabled={disabled}
            />
            <br />
            <IonLabel>
              Words: {languageData?.getLanguageTranslationInfo.totalWordCount}
            </IonLabel>
            <IonLabel>
              Phrases:{' '}
              {languageData?.getLanguageTranslationInfo.totalPhraseCount}
            </IonLabel>
          </LanguageSelectorContainer>
          <LanguageSelectorContainer>
            <div>
              <IonLabel>Target</IonLabel>
              <IonToggle
                checked={selectTarget}
                onIonChange={() => setSelectTarget(!selectTarget)}
                style={{ marginLeft: '10px' }}
              />
            </div>
            <LangSelector
              title={tr('Target language')}
              langSelectorId="translation-g-target-langSelector"
              selected={target as LanguageInfo | undefined}
              onChange={(_targetLangTag, targetLanguageInfo) => {
                changeTranslationTargetLanguage(targetLanguageInfo);
              }}
              onClearClick={() => changeTranslationTargetLanguage(null)}
              enabledTags={enabledTags}
              disabled={!selectTarget || batchTranslating}
            />
            <br />
            <IonLabel>
              Missing Words:{' '}
              {selectTarget
                ? languageData?.getLanguageTranslationInfo
                    .translatedMissingWordCount
                : '?'}
            </IonLabel>
            <IonLabel>
              Missing Phrases:{' '}
              {selectTarget
                ? languageData?.getLanguageTranslationInfo
                    .translatedMissingPhraseCount
                : '?'}
            </IonLabel>
          </LanguageSelectorContainer>
        </LanguageSectionContainer>
      </FilterContainer>
      <br />

      <AIContainer>
        <div style={{ display: 'flex' }}>
          <IonTitle>Google Translate</IonTitle>
          <IonLabel>
            {!selectTarget
              ? languageData?.getLanguageTranslationInfo
                  .googleTranslateTotalLangCount + ' languages'
              : '1 language'}
          </IonLabel>
        </div>

        <AIActionsContainer>
          <IonButton onClick={handleTranslate} disabled={disabled}>
            {tr('Translate All')}
          </IonButton>

          {/* <IonButton
            color="warning"
            onClick={handleTranslateAll}
            disabled={disabled}
          >
            {tr('Translate All Words and Phrases')}
          </IonButton> */}
        </AIActionsContainer>
      </AIContainer>

      {loadingCom}

      {resultCom}
    </PageLayout>
  );
}