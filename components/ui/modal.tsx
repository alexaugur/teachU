import React from 'react';
import { Modal as MuiModal, Box, Button, Typography, ThemeProvider, createTheme, TextField, Grid } from '@mui/material';

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  criteria: string;
  setCriteria: (criteria: string) => void;
  score: number;
  setScore: (score: number) => void;
  handleSave: () => void;
}

const muiTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '20px',
          borderRadius: '8px',
        }
      }
    }
  }
});

const Modal: React.FC<ModalProps> = ({ open, handleClose, criteria, setCriteria, score, setScore, handleSave }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <MuiModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Rubric
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Grading Criteria"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              fullWidth
            />
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Typography>Out of</Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  value={score}
                  onChange={(e) => setScore(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item>
                <Typography>points</Typography>
              </Grid>
            </Grid>
            <Button onClick={handleSave} sx={{ mt: 2, mr: 1 }}>
              Save
            </Button>
            <Button onClick={handleClose} sx={{ mt: 2 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </MuiModal>
    </ThemeProvider>
  );
};

export { Modal };
