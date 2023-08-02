import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useRef } from 'react';
import { styled } from 'styled-components';

export type FileUploadProps = {
  accept: string;
  onSelect: (file: File) => void;
};

export const FileUploadBtn = ({ accept, onSelect }: FileUploadProps) => {
  const fileInput = useRef<HTMLInputElement | null>(null);

  // const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  //   console.log('file: ', e.target.value);
  // };

  return (
    <>
      <input
        ref={fileInput}
        hidden
        type="file"
        accept={accept}
        onChange={(e) => {
          e.target?.files && onSelect(e.target.files[0]);
        }}
        onClick={() => {
          console.log('onClick');
        }}
      />
      <StIonIcon
        icon={add}
        onClick={() => {
          fileInput?.current?.click();
        }}
      />
    </>
  );
};

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
}));