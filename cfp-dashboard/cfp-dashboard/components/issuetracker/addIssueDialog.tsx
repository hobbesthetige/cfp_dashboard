import React, { ReactNode, useEffect, useState } from "react";
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
} from "@mui/material";
import { Issue, IssueNote } from "../../app/types/issue";
import { KeyboardArrowUp, KeyboardDoubleArrowUp } from "@mui/icons-material";

interface AddIssueDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (issue: Issue) => void;
}

const descriptionTemplate = `Problem Type:
  - Hardware/Software/Personnel/Other: 

Detailed Issue Description:
  - 

Error Codes:
  - Error Code:
  - Error Message: 

Plan of Action:
  - 
`;

const AddIssueDialog: React.FC<AddIssueDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const createNewIssue = () => {
    return {
      id: new Date().toUTCString(),
      category: "",
      title: "",
      description: descriptionTemplate,
      department: "",
      notes: [],
      createdAt: new Date().toUTCString(),
      lastUpdated: new Date().toUTCString(),
      status: "Backlog",
      priority: 3,
    };
  };

  const [issue, setIssue] = useState<Issue>(createNewIssue());
  const [errors, setErrors] = useState({ title: "", description: "" });

  useEffect(() => {
    setIssue(createNewIssue());
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

  const handleAddIssue = () => {
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
    onAdd(issue);
    onClose();
  };

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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Issue</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddIssue}>Add</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIssueDialog;
