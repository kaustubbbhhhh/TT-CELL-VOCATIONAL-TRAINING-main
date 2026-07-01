import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ApplicationModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Apply for Internship</DialogTitle>
      <DialogContent>
        <Typography>
          The application form will be available soon. Please check back later!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#4B5D3A' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
