import { IonList, useIonRouter } from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback, useEffect, useState } from 'react';
import { useMapTranslationTools } from '../hooks/useMapTranslationTools';
import { useGetAllMapsListLazyQuery } from '../../../generated/graphql';
import { RouteComponentProps } from 'react-router';
import { styled } from 'styled-components';
import { LangSelector } from '../../common/LangSelector/LangSelector';
interface MapListProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export const MapList = ({ match }: MapListProps) => {
  const router = useIonRouter();
  const { sendMapFile } = useMapTranslationTools();
  const [getAllMapsList, { data: allMapsQuery }] = useGetAllMapsListLazyQuery();
  const [mapListLang, setMapListLang] = useState<LanguageInfo>();

  useEffect(() => {
    const variables = mapListLang?.lang
      ? {
          lang: {
            language_code: mapListLang.lang.tag,
            dialect_code: mapListLang?.dialect?.tag,
            geo_code: mapListLang?.region?.tag,
          },
        }
      : undefined;

    getAllMapsList({ variables });
  }, [getAllMapsList, mapListLang]);

  const handleAddMap = useCallback(
    (file: File) => {
      if (!file) return;

      sendMapFile(
        file,
        async ({ id, fileName }) => {
          console.log(`uploaded id ${id} filename ${fileName}`);
          await getAllMapsList();
        },
        (err) => {
          console.log(`upload error  ${err}`);
        },
      );
    },
    [getAllMapsList, sendMapFile],
  );

  return (
    <>
      <Caption>Maps</Caption>

      <LangSelectorBox>
        <LangSelector
          title="Select language"
          langSelectorId="mapsListLangSelector"
          selected={mapListLang}
          onChange={(mapListLangTag, mapListLangInfo) => {
            setMapListLang(mapListLangInfo);
          }}
        ></LangSelector>
      </LangSelectorBox>
      <MapTools
        onFilterClick={() => {
          alert('click on filter mock');
        }}
        onTranslationsClick={() => {
          router.push(
            `/${match.params.nation_id}/${match.params.language_id}/1/maps/translation`,
          );
        }}
        onAddClick={handleAddMap}
      />
      <IonList lines="none">
        {allMapsQuery?.getAllMapsList.allMapsList?.length ? (
          allMapsQuery?.getAllMapsList.allMapsList?.map((m, i) => (
            <MapItem mapItem={m} key={i}></MapItem>
          ))
        ) : (
          <div> No maps found </div>
        )}
      </IonList>
    </>
  );
};

const LangSelectorBox = styled.div`
  margin-top: 10px;
`;
