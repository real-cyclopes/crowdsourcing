import {
  useMemo,
  memo,
  useEffect,
  useCallback,
  useState,
  ReactNode,
  MouseEvent,
} from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Stack } from '@mui/material';
import { Word, Dot } from './styled';
import { SkeletonPage } from './SkeletonPage';

import { useGetDocumentWordEntriesByDocumentIdLazyQuery } from '../../../generated/graphql';

export type TempPage = {
  id: string;
  first: number;
  after: number;
};

export type ViewMode = 'edit' | 'view';

export type Range = {
  beginEntry?: string;
  endEntry?: string;
};

export type WordlikeString = {
  id: string;
  wordlike_string: string;
};

export type WordEntry = {
  id: string;
  wordlike_string: WordlikeString;
  parent_id?: string;
};

export type DocumentViewerProps = {
  mode: ViewMode;
  range: Range;
  dots: {
    entryId: string;
    component?: ReactNode;
  }[];
  onClickWord(entryId: string, index: number, e?: unknown): void;
  documentId: string;
  onChangeRange(sentence: string): void;
};

export const DocumentViewer = memo(function DocumentViewerPure({
  documentId,
  mode,
  range,
  dots,
  onClickWord,
  onChangeRange,
}: DocumentViewerProps) {
  const [getDocumentWordEntriesByDocumentId] =
    useGetDocumentWordEntriesByDocumentIdLazyQuery();

  const [entriesData, setEntriesData] = useState<(TempPage | WordEntry[])[]>(
    [],
  );
  const [rowWidth, setRowWidth] = useState<number>(0);
  const [requiredPage, setRequiredPage] = useState<TempPage | null>(null);

  useEffect(() => {
    window.addEventListener(
      'resize',
      function () {
        setRowWidth(Math.min(window.screen.width - 32, 777 - 32));
      },
      true,
    );

    setTimeout(() => {
      setRowWidth(window.screen.width - 50);
    }, 2000);
  }, []);

  useEffect(() => {
    (async () => {
      const firstPage = await getDocumentWordEntriesByDocumentId({
        variables: {
          document_id: documentId,
          first: 1,
          after: null,
        },
      });

      const totalPages =
        firstPage.data?.getDocumentWordEntriesByDocumentId.pageInfo
          .totalEdges || 0;

      const pageEntriesData: TempPage[] = [];

      for (let i = 0; i < totalPages; i++) {
        pageEntriesData.push({
          id: `page_${i + 1}`,
          after: i,
          first: 1,
        });
      }

      setEntriesData(pageEntriesData);
    })();
  }, [documentId, getDocumentWordEntriesByDocumentId]);

  const fetchMore = useCallback(
    async (page: TempPage) => {
      const { data } = await getDocumentWordEntriesByDocumentId({
        variables: {
          document_id: documentId,
          first: page.first,
          after: page.after + '',
        },
      });

      if (!data) {
        return;
      }

      const word_entries: WordEntry[] = [];
      data.getDocumentWordEntriesByDocumentId.edges.forEach((edge) => {
        edge.node.forEach((item) =>
          word_entries.push({
            id: item.document_word_entry_id,
            wordlike_string: {
              id: item.wordlike_string.wordlike_string_id,
              wordlike_string: item.wordlike_string.wordlike_string,
            },
            parent_id: item.parent_document_word_entry_id || undefined,
          }),
        );
      });

      const entriesMap = new Map<string, WordEntry>();
      const childrenMap = new Map<string, string>();
      const rootIds: string[] = [];

      for (const word_entry of word_entries) {
        entriesMap.set(word_entry.id, word_entry);

        if (word_entry.parent_id) {
          childrenMap.set(word_entry.parent_id, word_entry.id);
        } else {
          rootIds.push(word_entry.id);
        }
      }

      for (const parentId of childrenMap.keys()) {
        if (entriesMap.get(parentId)) {
          continue;
        }

        rootIds.push(childrenMap.get(parentId)!);
      }

      const sortedEntries: WordEntry[][] = [];

      for (const root of rootIds) {
        const tempEntries: WordEntry[] = [];

        let cur: string | undefined = root;

        while (cur) {
          tempEntries.push(entriesMap.get(cur)!);
          cur = childrenMap.get(cur);
        }

        sortedEntries.push(tempEntries);
      }

      if (sortedEntries.length !== 1) {
        alert('Error at fetching');
      }

      setEntriesData((data) => {
        const refactoredData: (WordEntry[] | TempPage)[] = [];

        data
          .map((item) => {
            if (
              !Array.isArray(item) &&
              item.after === page.after &&
              item.first === page.first
            ) {
              return sortedEntries[0];
            } else {
              return item;
            }
          })
          .forEach((item) => {
            if (refactoredData.length === 0) {
              refactoredData.push(item);
              return;
            }

            const lastItem = refactoredData[refactoredData.length - 1];

            if (!Array.isArray(item) || !Array.isArray(lastItem)) {
              refactoredData.push(item);
              return;
            }

            lastItem.push(...item);

            return;
          }, []);

        return refactoredData;
      });
    },
    [documentId, getDocumentWordEntriesByDocumentId],
  );

  useEffect(() => {
    let sentence: string = '';
    let start = false;

    if (range.beginEntry && range.endEntry && entriesData.length > 0) {
      for (const data of entriesData) {
        if (!Array.isArray(data)) {
          if (start) {
            sentence = `${sentence} ... `;
          }
          continue;
        }

        for (let i = 0; i < data.length; i++) {
          if (data[i].id === range.beginEntry) {
            start = true;
          }

          if (start) {
            sentence = `${sentence} ${data[i].wordlike_string.wordlike_string}`;
          }

          if (data[i].id === range.endEntry) {
            start = false;
            onChangeRange(sentence);
            return;
          }
        }
      }
    }
  }, [entriesData, onChangeRange, range.beginEntry, range.endEntry]);

  useEffect(() => {
    if (!requiredPage) {
      return;
    }

    const timer = setTimeout(() => fetchMore(requiredPage), 1000);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [fetchMore, requiredPage]);

  const handleLoading = useCallback((tempPage: TempPage) => {
    setRequiredPage(tempPage);
  }, []);

  const rows = useMemo(() => {
    const rows: JSX.Element[] = [];
    const tempRow: {
      cols: JSX.Element[];
      width: number;
    } = {
      cols: [],
      width: 0,
    };

    const dotsMap = new Map<
      string,
      {
        entryId: string;
        component?: ReactNode;
      }
    >();

    dots.forEach((dot) => dotsMap.set(dot.entryId, dot));

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context || rowWidth === 0) {
      return rows;
    }

    const fontSize = 14;
    const fontWeight = 400;
    const fontFamily = 'Poppins';
    const padding = 6;
    const letterSpacing = -0.28;

    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    let begin = false;
    let end = false;

    for (const data of entriesData) {
      if (!Array.isArray(data)) {
        const skeletonCom = (
          <SkeletonPage
            tempPage={data}
            onLoading={handleLoading}
            height={1400}
          />
        );

        rows.push(skeletonCom);
        continue;
      }

      const entries: WordEntry[] = data;

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (entry.id === range.beginEntry) {
          begin = true;
        }

        const dot = dotsMap.get(entry.id) || null;
        const isDot = dot ? true : false;
        const dotCom = dot ? dot.component : null;

        let classStr = `${mode} `;
        classStr +=
          (begin && !end && range.endEntry) ||
          entry.id === range.beginEntry ||
          entry.id === range.endEntry
            ? 'selected'
            : '';
        classStr += ` ${entry.id === range.beginEntry ? 'left-boundary' : ''}`;
        classStr += ` ${entry.id === range.endEntry ? 'right-boundary' : ''}`;

        const cursor = isDot ? 'pointer' : 'default';

        if (entry.id === range.endEntry) {
          end = true;
        }

        const handleClick = (e: MouseEvent<HTMLDivElement>) => {
          if (mode === 'view' && !isDot) {
            return;
          }

          onClickWord(entry.id, i, e);
        };

        const wordlikeString = entry.wordlike_string.wordlike_string;

        const wordCom = (
          <Word
            key={entry.id}
            className={classStr}
            onClick={handleClick}
            style={{ cursor }}
          >
            {wordlikeString}
            {isDot ? dotCom || <Dot /> : null}
          </Word>
        );

        const wordWidth = Math.ceil(
          context.measureText(wordlikeString).width +
            letterSpacing * (wordlikeString.length - 1) +
            padding,
        );

        if (tempRow.width + wordWidth < rowWidth) {
          tempRow.cols.push(wordCom);
          tempRow.width = tempRow.width + wordWidth;
        } else {
          const rowCom = (
            <Stack
              direction="row"
              justifyContent="flex-start"
              sx={(theme) => ({
                color: theme.palette.text.gray,
              })}
            >
              {tempRow.cols}
            </Stack>
          );
          rows.push(rowCom);
          tempRow.cols = [wordCom];
          tempRow.width = wordWidth;
        }
      }
    }

    if (tempRow.cols.length) {
      const rowCom = (
        <Stack
          direction="row"
          justifyContent="flex-start"
          sx={(theme) => ({
            color: theme.palette.text.gray,
          })}
        >
          {tempRow.cols}
        </Stack>
      );
      rows.push(rowCom);
    }

    return rows;
  }, [
    dots,
    entriesData,
    handleLoading,
    mode,
    onClickWord,
    range.beginEntry,
    range.endEntry,
    rowWidth,
  ]);

  return (
    <Virtuoso
      style={{ height: 'calc(100vh - 160px)' }}
      data={rows}
      itemContent={(_index, row) => row}
    />
  );
});
