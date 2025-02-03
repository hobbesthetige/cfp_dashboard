import { PhoneBookInstruction, PhoneNumberType } from "@/app/types/phonebook";
import { Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

interface PhoneBookInstructionsDialogProps {
  instructions: PhoneBookInstruction[];
  onAddInstruction: (instruction: PhoneBookInstruction) => void;
  onRemoveInstruction: (instruction: PhoneBookInstruction) => void;
  onEditInstruction: (instruction: PhoneBookInstruction) => void;
  open: boolean;
  onClose: () => void;
}

const defaultInstruction: PhoneBookInstruction = {
  id: uuidv4(),
  fromNumberType: PhoneNumberType.Commercial,
  toNumberType: PhoneNumberType.DSN,
  instruction: "",
};

const PhoneBookInstructionsDialog: React.FC<
  PhoneBookInstructionsDialogProps
> = ({
  open,
  onClose,
  instructions,
  onAddInstruction,
  onEditInstruction,
  onRemoveInstruction,
}) => {
  const [editingInstruction, setEditingInstruction] =
    useState<PhoneBookInstruction>(defaultInstruction);

  const handleAddInstruction = () => {
    onAddInstruction(editingInstruction);
    setEditingInstruction(defaultInstruction);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingInstruction((prevInstruction) => ({
      ...prevInstruction,
      [name]: value,
    }));
  };

  const handleAutocompleteChange = (
    name: string,
    e: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    setEditingInstruction((prevInstruction) => ({
      ...prevInstruction,
      [name]: (value as PhoneNumberType) || "",
    }));
  };

  const insertPlaceholder = (placeholder: string) => {
    setEditingInstruction((prevInstruction) => ({
      ...prevInstruction,
      instruction: `${prevInstruction.instruction}${placeholder}`,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Phone Book Instructions</DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="caption">
            Add instructions for how to dialing from one number type to another.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Autocomplete
            disablePortal
            options={[...Object.values(PhoneNumberType), "Any"]}
            sx={{ width: "50%", minWidth: 200 }}
            value={editingInstruction.fromNumberType}
            renderInput={(params) => (
              <TextField {...params} label="From Type" />
            )}
            onChange={(e, value) =>
              handleAutocompleteChange("fromNumberType", e, value)
            }
          />
          <Autocomplete
            disablePortal
            options={[...Object.values(PhoneNumberType), "Any"]}
            sx={{ width: "50%", minWidth: 200 }}
            value={editingInstruction.toNumberType}
            renderInput={(params) => <TextField {...params} label="To Type" />}
            onChange={(e, value) =>
              handleAutocompleteChange("toNumberType", e, value)
            }
          />
        </Stack>
        <TextField
          label="Instructions"
          value={editingInstruction.instruction}
          name="instruction"
          onChange={handleTextFieldChange}
          variant="outlined"
          margin="normal"
          component="span"
          fullWidth
          multiline
          rows={4}
        />
        <Typography
          variant="caption"
          color="InactiveCaptionText"
          component="div"
        >
          Placeholders:
        </Typography>
        <Typography
          variant="caption"
          color="InactiveCaptionText"
          component="div"
        >
          <Link onClick={() => insertPlaceholder("<#Full-Number#>")}>
            {"<#Full-Number#>"}
          </Link>{" "}
          (will display the phone number with area code in the final message)
        </Typography>
        <Typography
          variant="caption"
          color="InactiveCaptionText"
          component="div"
        >
          <Link onClick={() => insertPlaceholder("<#Area-Code#>")}>
            {"<#Area-Code#>"}
          </Link>{" "}
          (will display the area code in the final message)
        </Typography>
        <Typography
          variant="caption"
          color="InactiveCaptionText"
          component="div"
        >
          <Link onClick={() => insertPlaceholder("<#Local-Number#>")}>
            {"<#Local-Number#>"}
          </Link>{" "}
          (will display the local number in the final message)
        </Typography>
        <Button onClick={handleAddInstruction} sx={{ flexGrow: 1, mt: 2 }}>
          Add Instructions
        </Button>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <List dense>
          {instructions.map((instruction, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <Stack direction="column" spacing={1} sx={{ width: "100%" }}>
                  <ListItemText
                    primary={`${instruction.fromNumberType} → ${instruction.toNumberType}`}
                  />
                  <div className="markdown">
                    <Markdown>{instruction.instruction}</Markdown>
                  </div>
                </Stack>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onRemoveInstruction(instruction)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index !== instructions.length - 1 && (
                <Divider sx={{ mt: 1, mb: 1 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhoneBookInstructionsDialog;
