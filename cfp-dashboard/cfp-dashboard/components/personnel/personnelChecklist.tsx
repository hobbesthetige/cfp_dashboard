import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Personnel } from "@/app/types/personnel";
import { Add, Edit } from "@mui/icons-material";

interface PersonnelChecklistDialogProps {
  personnel: Personnel[];
  selectedIDs: string[];
  addID: (id: string) => void;
  removeID: (id: string) => void;
}

const PersonnelChecklistDialog: React.FC<PersonnelChecklistDialogProps> = ({
  personnel,
  selectedIDs,
  addID,
  removeID,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleSelection = (id: string) => {
    if (selectedIDs.includes(id)) {
      removeID(id);
    } else {
      addID(id);
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Add />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Personnel Location</DialogTitle>
        <DialogContent>
          <Typography>Select personnel to track location:</Typography>
          <List>
            {personnel.map((person) => (
              <ListItem disableGutters key={person.id}>
                <ListItemButton
                  role={undefined}
                  onClick={() => toggleSelection(person.id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedIDs.includes(person.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${person.rank}. ${person.lastName}, ${person.firstName}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PersonnelChecklistDialog;
