import React, { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  Stack,
  Typography,
  DialogProps,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { Issue, IssueNote } from "../../app/types/issue";
import {
  DeleteOutline,
  KeyboardArrowUp,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";

interface EditIssueDialogProps {
  open: boolean;
  issue: Issue;
  onClose: () => void;
  onUpdate: (issue: Issue) => void;
}

const AddIssueDialog: React.FC<EditIssueDialogProps> = ({
  open,
  onClose,
  onUpdate,
  issue: originalIssue,
}) => {
  const [issue, setIssue] = useState<Issue>(originalIssue);
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [note, setNote] = useState("");

  useEffect(() => {
    setErrors({ title: "", description: "" });
  }, [open]);

  const validate = (name: string, value: string) => {
    switch (name) {
      case "title":
        return value.trim() === "" ? "Title is required" : "";
      case "description":
        return value.trim() === "" ? "Description is required" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIssue((prevIssue) => ({
      ...prevIssue,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validate(name, value),
    }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNote(value);
  };

  const handleEditIssue = () => {
    const titleError = validate("title", issue.title);
    const descriptionError = validate("description", issue.description);

    if (titleError || descriptionError) {
      setErrors({
        title: titleError,
        description: descriptionError,
      });
      return;
    }

    setErrors({ title: "", description: "" });
    onUpdate(issue);
    onClose();
  };

  const deleteIssueNote = (index: number) => {
    setIssue((prevIssue) => ({
      ...prevIssue,
      notes: prevIssue.notes.filter((_, i) => i !== index),
    }));
  };

  function NoteListItem(note: IssueNote, index: number) {
    const localDate = new Date(note.timestamp).toLocaleString();
    const zuluTime =
      new Date(note.timestamp).toISOString().slice(11, 16) + " Zulu";

    const combinedText = `${localDate} | ${zuluTime}`;

    return (
      <ListItem
        key={index}
        disableGutters
        secondaryAction={
          <IconButton onClick={() => deleteIssueNote(index)}>
            <DeleteOutline />
          </IconButton>
        }
      >
        <ListItemText primary={note.note} secondary={combinedText} />
      </ListItem>
    );
  }

  function handleChange(
    event: SelectChangeEvent<number>,
    child: ReactNode
  ): void {
    const priority = Number(event.target.value);
    setIssue((prevIssue) => ({
      ...prevIssue,
      priority: isNaN(priority) ? 0 : priority,
    }));
  }

  function handleStatusChange(
    event: SelectChangeEvent<string>,
    child: ReactNode
  ): void {
    const { value } = event.target;
    setIssue((prevIssue) => ({
      ...prevIssue,
      status: value,
    }));
  }

  const sortedNotes = useCallback(() => {
    return issue.notes.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [issue.notes]);

  const AddNote = () => {
    return (
      <Stack direction={"row"} spacing={2} sx={{ mt: 1 }}>
        <TextField
          label="Add Note"
          name="note"
          value={note}
          onChange={handleNoteChange}
          fullWidth
          margin="normal"
        />
        <Button
          onClick={() => {
            setIssue((prevIssue) => ({
              ...prevIssue,
              notes: [
                ...prevIssue.notes,
                {
                  note: note,
                  author: "User",
                  timestamp: new Date().toISOString(),
                },
              ],
            }));
            setNote("");
          }}
        >
          Add
        </Button>
      </Stack>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} scroll={scroll}>
      <DialogTitle>Edit Issue</DialogTitle>
      <DialogContent dividers={scroll === "paper"}>
        <FormControl margin="normal" fullWidth>
          <InputLabel id="issue-status-label">Status</InputLabel>
          <Select
            labelId="issue-status-label"
            id="issue-status-select"
            value={issue.status}
            label="Status"
            onChange={handleStatusChange}
            autoWidth
          >
            <MenuItem value={"Backlog"}>Backlog</MenuItem>
            <MenuItem value={"In Progress"}>In Progress</MenuItem>
            <MenuItem value={"Blocked"}>Blocked</MenuItem>
            <MenuItem value={"Resolved"}>Resolved</MenuItem>
            <MenuItem value={"Canceled"}>Canceled</MenuItem>
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2} margin="normal" sx={{ mt: 1 }}>
          <FormControl margin="normal" sx={{ minWidth: 120 }}>
            <InputLabel id="issue-priority-label">Priority</InputLabel>
            <Select
              labelId="issue-priority-label"
              id="issue-priority-select"
              value={issue.priority}
              label="Priority"
              onChange={handleChange}
              autoWidth
            >
              <MenuItem value={0}>
                <Stack direction="row" alignItems="center">
                  <KeyboardDoubleArrowUp color="error" />
                  <Typography color="error" fontWeight={800}>
                    Urgent
                  </Typography>
                </Stack>
              </MenuItem>
              <MenuItem value={1}>
                <Stack direction="row" alignItems="center">
                  <KeyboardArrowUp color="error" />
                  <Typography color="error">High</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value={2}>
                <Typography fontWeight={400}>Medium</Typography>
              </MenuItem>
              <MenuItem value={3}>Low</MenuItem>
              <MenuItem value={999}>
                <em>None</em>
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Title"
            name="title"
            value={issue.title}
            onChange={handleInputChange}
            required
            error={errors.title !== ""}
            helperText={errors.title}
            fullWidth
            margin="normal"
          />
        </Stack>
        <TextField
          label="Description"
          name="description"
          value={issue.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          required
          error={errors.description !== ""}
          helperText={errors.description}
          rows={10}
        />
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Department"
            name="department"
            placeholder="Optional"
            value={issue.department}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Assigned to"
            name="personnelResponsible"
            placeholder="Optional"
            value={issue.personnelResponsible}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Stack>
        <TextField
          label="Ticket #"
          name="ticketNumber"
          placeholder="Optional DISA Ticket #"
          value={issue.ticketNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography variant="h6">Notes</Typography>
        {AddNote()}
        <List dense>
          {sortedNotes().map((note: IssueNote, index: number) =>
            NoteListItem(note, index)
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditIssue}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIssueDialog;
