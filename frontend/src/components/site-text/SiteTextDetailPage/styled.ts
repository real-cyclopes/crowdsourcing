import { IonInput, IonTextarea } from '@ionic/react';
import { styled } from 'styled-components';

export const CaptainContainer = styled.div`
  height: 50px;
`;

export const CardListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const CardContainer = styled.div`
  width: 100%;
  padding: 8px 0;
`;

export const Input = styled(IonInput)(() => ({
  '--background': '#eee',
  '--padding-start': '16px',
  '--padding-end': '16px',
  '--border-radius': '16px',
}));

export const Textarea = styled(IonTextarea)(() => ({
  '--background': '#eee',
  '--padding-start': '16px',
  '--padding-end': '16px',
  '--border-radius': '16px',
}));
