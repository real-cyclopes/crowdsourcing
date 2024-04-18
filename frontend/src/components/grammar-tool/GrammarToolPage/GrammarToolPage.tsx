import { useRef, useState, ChangeEventHandler } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { useIonToast } from '@ionic/react';
import mermaid from '@eten-lab/mermaid';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

mermaid.initialize({ startOnLoad: false });

export function GrammarToolPage() {
  const [present] = useIonToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState<string>('');

  const handleDrawSvg = async () => {
    if (!containerRef.current) {
      return;
    }

    try {
      const { svg, bindFunctions } = await mermaid.render(
        'graphDiv',
        `SimpleGrammar\n${text}`,
      );
      containerRef.current.innerHTML = svg;

      const svgElement = containerRef.current.getElementsByTagName('svg');
      if (svgElement.length > 0) {
        const rect = svgElement[0].getBBox();
        containerRef.current.style.width = `${rect.width}px`;
      }
      bindFunctions?.(containerRef.current);
    } catch (err) {
      present({
        message: err as string,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  };

  const handleChangeText: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setText(event.currentTarget.value);
  };

  return (
    <PageLayout>
      <Caption>Grammar Tool</Caption>

      <Stack gap="10px">
        <Button variant="contained" onClick={handleDrawSvg}>
          Draw Svg
        </Button>
        <Typography>Please Input Simple Grammar</Typography>
        <textarea
          value={text}
          onChange={handleChangeText}
          style={{ border: `1px solid #60a5fa`, minHeight: 500 }}
        />
      </Stack>

      <Stack
        sx={{
          overflow: 'auto',
          maxHeight: '700px',
          border: '1px solid #38bdf8',
        }}
      >
        <Stack
          ref={containerRef}
          alignItems="flex-end"
          justifyContent="flex-end"
          sx={{ transform: 'translateX(200px)' }}
        />
      </Stack>
    </PageLayout>
  );
}
