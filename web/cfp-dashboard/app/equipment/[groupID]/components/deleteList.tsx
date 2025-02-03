import {
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface DeleteListProps {
  handleDelete: () => void;
}
const DeleteList: React.FC<DeleteListProps> = ({ handleDelete }) => {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  return (
    <Stack direction="row" sx={{ mt: 2 }}>
      <Button
        variant="outlined"
        color="error"
        sx={{ mt: 2 }}
        onClick={() => setOpenDeleteConfirmation(true)}
      >
        Delete Group
      </Button>
      <DeleteConfirmationDialog
        open={openDeleteConfirmation}
        handleClose={() => setOpenDeleteConfirmation(false)}
        handleDelete={handleDelete}
      />
    </Stack>
  );
};

const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}> = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Equipment Group</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this equipment group?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteList;
