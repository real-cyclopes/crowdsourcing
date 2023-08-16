import { MouseEventHandler, useRef } from 'react';
import { IonBadge, IonItem, IonIcon } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import { styled } from 'styled-components';

import {
  MapFileOutput,
  useGetOrigMapContentLazyQuery,
  useGetTranslatedMapContentLazyQuery,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromSrc } from '../../../common/utility';
import { useAppContext } from '../../../hooks/useAppContext';

export type TMapItemProps = React.HTMLAttributes<HTMLIonItemElement> & {
  mapItem: MapFileOutput;
};

const NotStyledMapItem = ({ mapItem, ...rest }: TMapItemProps) => {
  const {
    states: {
      global: {
        langauges: { appLanguage },
      },
    },
  } = useAppContext();
  const downloadFlagRef = useRef<'original' | 'translated' | null>(null);

  const [getOrigMapContent, origMapContent] = useGetOrigMapContentLazyQuery({
    fetchPolicy: 'no-cache',
  });
  const [getTranslatedMapContent, translatedMapContent] =
    useGetTranslatedMapContentLazyQuery({ fetchPolicy: 'no-cache' });

  const routerLink =
    mapItem.is_original || !mapItem.translated_map_id
      ? `/US/${appLanguage.lang.tag}/1/maps/details-original/${mapItem.original_map_id}`
      : `/US/${appLanguage.lang.tag}/1/maps/details-translated/${mapItem.translated_map_id}`;

  const langInfo = subTags2LangInfo({
    lang: mapItem.language.language_code,
    dialect: mapItem.language.dialect_code || undefined,
    region: mapItem.language.geo_code || undefined,
  });

  const handleDownloadSvg: MouseEventHandler<HTMLIonIconElement> = (e) => {
    if (mapItem.is_original || !mapItem.translated_map_id) {
      downloadFlagRef.current = 'original';
      getOrigMapContent({
        variables: {
          id: mapItem.original_map_id,
        },
      });
    } else {
      downloadFlagRef.current = 'translated';
      getTranslatedMapContent({
        variables: {
          id: mapItem.translated_map_id,
        },
      });
    }

    e.preventDefault();
    e.stopPropagation();
  };

  if (
    origMapContent.data &&
    !origMapContent.error &&
    !origMapContent.loading &&
    downloadFlagRef.current === 'original'
  ) {
    downloadFromSrc(
      origMapContent.data.getOrigMapContent.map_file_name,
      `data:image/svg+xml;utf8,${encodeURIComponent(
        origMapContent.data.getOrigMapContent.content,
      )}`,
    );
    downloadFlagRef.current = null;
  }

  if (
    translatedMapContent.data &&
    !translatedMapContent.error &&
    !translatedMapContent.loading &&
    downloadFlagRef.current === 'translated'
  ) {
    downloadFromSrc(
      translatedMapContent.data.getTranslatedMapContent.map_file_name,
      `data:image/svg+xml;utf8,${encodeURIComponent(
        translatedMapContent.data.getTranslatedMapContent.content,
      )}`,
    );
    downloadFlagRef.current = null;
  }

  return (
    <IonItem {...rest} routerLink={routerLink}>
      <StItem>
        <FileName>{mapItem.map_file_name}</FileName>
        <div>
          {mapItem.is_original ? (
            <OrigBadge>Original</OrigBadge>
          ) : (
            <IonBadge>{langInfo2String(langInfo)}</IonBadge>
          )}
          <IonIcon
            icon={downloadOutline}
            onClick={handleDownloadSvg}
            size="large"
            color="primary"
            className="clickable theme-icon"
          />
        </div>
      </StItem>
    </IonItem>
  );
};

export const MapItem = styled(NotStyledMapItem)(() => ({
  border: 'solid 1px #cfcfcf',
  marginTop: '20px',
}));

const FileName = styled.div`
  margin-top: 7px;
`;

const StItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const OrigBadge = styled(IonBadge)(() => ({
  background: 'purple',
}));
