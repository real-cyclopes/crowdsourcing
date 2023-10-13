import { Chip, ChipProps } from '@mui/material';

export function Tag(props: ChipProps) {
  return (
    <Chip
      {...props}
      sx={{
        display: 'flex',
        borderRadius: '9px',
        padding: '2px 8px',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '10px',
        fontWeight: 600,
        lineHeight: '18px',
        letterSpacing: '-0.2px',
        height: 'auto',
        ...props.sx,
      }}
    />
  );
}
