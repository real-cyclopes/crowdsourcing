import { useEffect, useMemo, useState } from 'react';
import { RouteComponentProps, useLocation } from 'react-router';
import { IonBadge, IonIcon, useIonToast } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import styled from 'styled-components';

import { Caption } from '../../common/Caption/Caption';

import { ErrorType, useGetMapContentQuery } from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromUrl } from '../../../common/utility';

import { useTr } from '../../../hooks/useTr';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { OrigBadge } from '../MapList/styled';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const MapDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  const { tr } = useTr();
  const [present] = useIonToast();
  const { search } = useLocation();
  const isOriginal = useMemo(() => {
    return new URLSearchParams(search).get('is_original') === 'true';
  }, [search]);

  const currentMapWithContent = useGetMapContentQuery({
    variables: { id: match.params.id, is_original: isOriginal },
    fetchPolicy: 'no-cache',
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const currMapContent = currentMapWithContent?.data?.getMapContent;

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (currMapContent?.error && currMapContent?.error !== ErrorType.NoError) {
      present({
        message: currMapContent.error,
        position: 'top',
        color: 'danger',
        duration: 2000,
      });
    }
  }, [currMapContent?.error, present]);

  const handleDownloadSvg = () => {
    if (currMapContent?.mapFileInfo) {
      downloadFromUrl(
        currMapContent?.mapFileInfo.map_file_name_with_langs,
        currMapContent?.mapFileInfo.content_file_url,
      );
    }
  };

  const langInfo = useMemo(() => {
    if (!currMapContent?.mapFileInfo?.language.language_code) {
      return undefined;
    }
    return currentMapWithContent
      ? subTags2LangInfo({
          lang: currMapContent.mapFileInfo.language.language_code,
          dialect:
            currMapContent.mapFileInfo.language.dialect_code || undefined,
          region: currMapContent.mapFileInfo.language.geo_code || undefined,
        })
      : undefined;
  }, [
    currMapContent?.mapFileInfo?.language.dialect_code,
    currMapContent?.mapFileInfo?.language.geo_code,
    currMapContent?.mapFileInfo?.language.language_code,
    currentMapWithContent,
  ]);

  return (
    <>
      <Caption>
        <>
          {tr('Map')} - {currMapContent?.mapFileInfo?.map_file_name_with_langs}
          {currMapContent?.mapFileInfo?.is_original ? (
            <OrigBadge>{tr('original')}</OrigBadge>
          ) : (
            <IonBadge>
              {tr('translated to')} {langInfo2String(langInfo)}
              {currMapContent?.mapFileInfo?.translated_percent
                ? ` [${currMapContent.mapFileInfo.translated_percent}%]`
                : ''}
            </IonBadge>
          )}
          <IonIcon
            icon={downloadOutline}
            onClick={handleDownloadSvg}
            size="large"
            color="primary"
            className="clickable theme-icon"
          />
        </>
      </Caption>

      <StyledMapImg>
        {currMapContent?.mapFileInfo && (
          <TransformWrapper>
            <TransformComponent>
              <img
                width={`${windowWidth - 10}px`}
                height={'auto'}
                src={currMapContent.mapFileInfo.content_file_url}
                alt="Translated map"
              />
            </TransformComponent>
          </TransformWrapper>
        )}
      </StyledMapImg>
    </>
  );
};

const StyledMapImg = styled.div`
  margin-top: 10px;
  border: solid 1px gray;
`;
