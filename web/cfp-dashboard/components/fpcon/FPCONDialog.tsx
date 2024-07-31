import React from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import useAxios from "@/contexts/useAxios";
import { FPCON, FPCONState, FPCONName, fpcons } from "@/app/types/fpcon";

interface FPCONDialogProps {}

const FPCONDialog: React.FC<FPCONDialogProps> = ({}) => {
  const [open, setOpen] = React.useState(false);
  const [fpconState, setFpconState] = React.useState<FPCONState>({
    currentState: fpcons[0],
    lastUpdated: new Date().toISOString(),
    history: [],
  });
  const axios = useAxios();

  const getFPCON = () => {
    axios.get("/fpcon").then((response) => {
      setFpconState(response.data);
    });
  };

  const toggleDialog = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Button onClick={toggleDialog}>Open FPCON Dialog</Button>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>FPCON Dialog</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FPCONDialog;
