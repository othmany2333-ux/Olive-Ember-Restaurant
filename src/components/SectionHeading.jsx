import { Typography, Box } from '@mui/material';

export default function SectionHeading({ eyebrow, title, description, center = false }) {
  return (
    <Box sx={{ textAlign: center ? 'center' : 'left', maxWidth: center ? 650 : 640, mx: center ? 'auto' : 0, mb: 4 }}>
      {eyebrow && <Typography className="eyebrow">{eyebrow}</Typography>}
      <Typography variant="h2" className="section-title">{title}</Typography>
      {description && <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.85 }}>{description}</Typography>}
    </Box>
  );
}
