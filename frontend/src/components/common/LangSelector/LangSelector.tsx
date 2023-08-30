import { useCallback, useEffect, useRef, useState } from 'react';
import { IonIcon, IonItem, IonLabel, IonModal } from '@ionic/react';

import tags from 'language-tags';

import { langInfo2tag, sortTagInfosFn } from '../../../common/langUtils';

import AppTypeahead from './TypeAhead';

import {
  DESCRIPTIONS_JOINER,
  LOADING_TAG_PLACEHOLDER,
  NOT_DEFINED_PLACEHOLDER,
} from '../../../const/langConst';
import { styled } from 'styled-components';
import { removeCircleOutline } from 'ionicons/icons';

export type LangSelectorProps = {
  title?: string;
  langSelectorId: string;
  selected: LanguageInfo | undefined;
  onChange(langTag: string | null, selected: LanguageInfo): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setLoadingState?(isLoading: boolean): any;
  onClearClick?: () => void;
  enabledTags?: string[];
};

type LangsRegistry = {
  langs: Array<TLang>;
  dialects: Array<TDialect>;
  regions: Array<TRegion>;
};

const emptyLangsRegistry: LangsRegistry = {
  langs: [LOADING_TAG_PLACEHOLDER],
  dialects: [LOADING_TAG_PLACEHOLDER],
  regions: [LOADING_TAG_PLACEHOLDER],
};

enum TagTypes {
  LANGUAGE = 'language',
  REGION = 'region',
  DIALECT = 'variant',
}
enum TagSpecialDescriptions {
  PRIVATE_USE = 'Private use',
}

// make it async to test and prepare for possible language library change to async
const getLangsRegistry = async (
  enabledTags?: string[],
): Promise<LangsRegistry> => {
  return new Promise((resolve) => {
    const allTags = tags.search(/.*/);
    const langs: Array<TLang> = [];
    const dialects: Array<TDialect> = [
      { tag: null, descriptions: [NOT_DEFINED_PLACEHOLDER] },
    ];
    const regions: Array<TRegion> = [
      { tag: null, descriptions: [NOT_DEFINED_PLACEHOLDER] },
    ];

    const strEnabledTags = enabledTags ? enabledTags.join(',') : null;

    for (const currTag of allTags) {
      if (
        strEnabledTags !== null &&
        !strEnabledTags.includes(currTag.format())
      ) {
        continue;
      }

      if (
        currTag.deprecated() ||
        currTag.descriptions().includes(TagSpecialDescriptions.PRIVATE_USE)
      ) {
        continue;
      }

      if (currTag.type() === TagTypes.LANGUAGE) {
        langs.push({
          tag: currTag.format(),
          descriptions: currTag.descriptions(),
        });
      }
      if (currTag.type() === TagTypes.REGION) {
        regions.push({
          tag: currTag.format(),
          descriptions: currTag.descriptions(),
        });
      }
      if (currTag.type() === TagTypes.DIALECT) {
        dialects.push({
          tag: currTag.format(),
          descriptions: currTag.descriptions(),
        });
      }
    }
    langs.sort(sortTagInfosFn);
    dialects.sort(sortTagInfosFn);
    regions.sort(sortTagInfosFn);

    resolve({
      langs,
      dialects,
      regions,
    });
  });
};

export function LangSelector({
  title = 'Select language',
  langSelectorId,
  selected,
  onChange,
  setLoadingState,
  onClearClick,
  enabledTags,
}: LangSelectorProps) {
  const [langsRegistry, setLangsRegistry] =
    useState<LangsRegistry>(emptyLangsRegistry);

  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    if (setLoadingState) {
      setLoadingState(true);
    }

    getLangsRegistry(enabledTags).then((lr) => {
      setLangsRegistry(lr);
      if (setLoadingState) {
        setLoadingState(false);
      }
    });
  }, [setLoadingState, enabledTags]);

  const handleSetLanguage = useCallback(
    (tag: string | undefined) => {
      if (!tag) return;
      const lang = langsRegistry.langs.find((lr) => lr.tag === tag);
      if (!lang) return;

      const langTag = lang.tag;

      const langTagFormatted = tags(langTag).format();

      if (langInfo2tag(selected) === langTagFormatted) return;

      onChange(langTagFormatted, {
        lang: lang,
        dialect: undefined,
        region: undefined,
      });

      modal.current?.dismiss();
    },
    [langsRegistry.langs, onChange, selected],
  );

  const selectedLangValue =
    selected?.lang?.descriptions?.join(DESCRIPTIONS_JOINER) || title;

  return (
    <>
      <StSelectorDiv>
        <StIonItem button={true} detail={false} id={langSelectorId}>
          <IonLabel>{selectedLangValue}</IonLabel>
        </StIonItem>
        {onClearClick && selectedLangValue !== title && (
          <StIonIcon
            icon={removeCircleOutline}
            onClick={() => {
              onClearClick();
            }}
          />
        )}
      </StSelectorDiv>
      <IonModal trigger={langSelectorId} ref={modal}>
        <AppTypeahead
          title={title}
          items={langsRegistry.langs.map((l) => ({
            text: l.descriptions
              ? l.descriptions.join(DESCRIPTIONS_JOINER)
              : l.tag,
            value: l.tag,
          }))}
          selectedItem={selected?.lang?.tag ? selected?.lang?.tag : undefined}
          onSelectionCancel={() => modal.current?.dismiss()}
          onSelectionChange={(tag) => handleSetLanguage(tag)}
        />
      </IonModal>
    </>
  );
}

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
  fontSize: '30px',
}));

const StSelectorDiv = styled('div')(() => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
}));

const StIonItem = styled(IonItem)(() => ({
  '--padding-start': '0px',
  width: '100%',
}));
