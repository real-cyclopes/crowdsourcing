import { useIonToast } from '@ionic/react';

import { useCreateThreadMutation as useGeneratedThreadCreateMutation } from '../generated/graphql';
import { useUpdateThreadMutation as useGeneratedThreadUpdateMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import {
  updateCacheWithCreateThread,
  updateCacheWithUpdateThread,
} from '../cacheUpdators/upsertThread';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useThreadUpdateMutation(folder_id: string) {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedThreadUpdateMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.threadUpsert.thread &&
        data.threadUpsert.error === ErrorType.NoError
      ) {
        const updatedThread = data.threadUpsert.thread;

        updateCacheWithUpdateThread(cache, updatedThread, folder_id);

        present({
          message: tr('Success at updating thread!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useThreadUpdateMutation: ', errors);
        console.log(data?.threadUpsert.error);

        present({
          message: `${tr('Failed at updating thread!')} [${data?.threadUpsert
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.threadUpsert.error);
      }
    },
  });
}

export function useThreadCreateMutation(folder_id: string) {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedThreadCreateMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.threadUpsert.thread &&
        data.threadUpsert.error === ErrorType.NoError
      ) {
        const newThread = data.threadUpsert.thread;

        updateCacheWithCreateThread(cache, newThread, folder_id);

        present({
          message: tr('Success at creating new thread!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useThreadUpsertMutation: ', errors);
        console.log(data?.threadUpsert.error);

        present({
          message: `${tr('Failed at creating new thread!')} [${data
            ?.threadUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.threadUpsert.error);
      }
    },
  });
}
