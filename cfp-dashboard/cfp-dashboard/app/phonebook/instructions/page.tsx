"use client";

import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState, useEffect, useCallback, useMemo, useRef, use } from "react";
import {
  PhoneBook,
  PhoneBookInstruction,
  PhoneNumberType,
  PhoneNumberTypeAny,
} from "../../types/phonebook";
import { useTitle } from "@/contexts/titleProvider";
import withAuth from "@/components/withAuth";
import useAxios from "@/contexts/useAxios";
import { Axios } from "axios";
import { Delete, Edit, NavigateNext, Phone } from "@mui/icons-material";
import Markdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import EasyMDE, { Options } from "easymde";
import { on } from "events";

const getPhoneBook = async (axios: Axios): Promise<PhoneBook> => {
  const response = await axios.get("/phonebook");
  return response.data;
};

const savePhoneBookInstructions = async (
  axios: Axios,
  instructions: PhoneBookInstruction[]
): Promise<void> => {
  await axios.put("/phonebook/instructions", instructions);
};

const PhoneBookInstructionsComponent: React.FC = () => {
  const { setTitle } = useTitle();
  const axios = useAxios();
  const [phoneBook, setPhoneBook] = useState<PhoneBook | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    setTitle("Dialing Instructions");
    getPhoneBook(axios).then((data) => setPhoneBook(data));
  }, []);

  const onAddInstruction = (instruction: PhoneBookInstruction) => {
    if (phoneBook) {
      const updatedInstructions = [instruction, ...phoneBook.instructions];
      setPhoneBook({ ...phoneBook, instructions: updatedInstructions });
      savePhoneBookInstructions(axios, updatedInstructions);
    }
  };

  const onEditInstruction = (instruction: PhoneBookInstruction) => {
    if (phoneBook) {
      const updatedInstructions = phoneBook.instructions.map((i) =>
        i.id === instruction.id ? instruction : i
      );
      setPhoneBook({ ...phoneBook, instructions: updatedInstructions });
      savePhoneBookInstructions(axios, updatedInstructions);
    }
  };

  const onRemoveInstruction = (instruction: PhoneBookInstruction) => {
    if (phoneBook) {
      const updatedInstructions = phoneBook.instructions.filter(
        (i) => i.id !== instruction.id
      );
      setPhoneBook({ ...phoneBook, instructions: updatedInstructions });
      savePhoneBookInstructions(axios, updatedInstructions);
    }
  };

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  return (
    <Box>
      <BreadcrumbsComponent />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">Dialing Instructions</Typography>
        {phoneBook && phoneBook.instructions.length > 0 && (
          <Button onClick={handleAddClick}>Add Instruction Set</Button>
        )}
      </Stack>
      <Stack direction="column">
        {(!phoneBook || phoneBook.instructions.length === 0) && !isAddOpen && (
          <NoInstrutionsComponent handleAddClick={handleAddClick} />
        )}
        {((phoneBook && phoneBook.instructions.length > 0) || isAddOpen) && (
          <InstructionsComponent
            instructions={phoneBook?.instructions || []}
            onRemoveInstruction={onRemoveInstruction}
            onEditInstruction={onEditInstruction}
            onAddInstruction={onAddInstruction}
            isAddOpen={isAddOpen}
            setIsAddOpen={setIsAddOpen}
          />
        )}
      </Stack>
    </Box>
  );
};

const NoInstrutionsComponent: React.FC<{ handleAddClick: () => void }> = ({
  handleAddClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: 2,
      }}
    >
      <Phone sx={{ fontSize: 80, marginBottom: 2 }} color="primary" />
      <Typography variant="h5" component="h1" gutterBottom>
        No dialing instructions
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Add dialing instructions to provide users support when calling between
        DSN, commercial, and XComm numbers.
      </Typography>
      <Button onClick={handleAddClick}>Add Instruction Set</Button>
    </Box>
  );
};

const InstructionsComponent: React.FC<{
  instructions: PhoneBookInstruction[];
  onRemoveInstruction: (instruction: PhoneBookInstruction) => void;
  onEditInstruction: (instruction: PhoneBookInstruction) => void;
  onAddInstruction: (instruction: PhoneBookInstruction) => void;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
}> = ({
  instructions,
  onRemoveInstruction,
  onEditInstruction,
  onAddInstruction,
  isAddOpen,
  setIsAddOpen,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5">Instructions</Typography>
      <AddInstructionComponent
        open={isAddOpen}
        setOpen={setIsAddOpen}
        onAddInstruction={onAddInstruction}
      />
      <Box>
        {instructions.map((instruction, index) => (
          <InstructionComponent
            key={index}
            instruction={instruction}
            onRemoveInstruction={onRemoveInstruction}
            onEditInstruction={onEditInstruction}
          />
        ))}
      </Box>
    </Box>
  );
};

const editorOptions: EasyMDE.Options = {
  autofocus: true,
  spellChecker: true,
  uploadImage: false,
  hideIcons: ["guide", "image", "link", "fullscreen"],
  showIcons: [
    "table",
    "horizontal-rule",
    "heading",
    "unordered-list",
    "ordered-list",
    "preview",
    "side-by-side",
  ],
};

const InstructionComponent: React.FC<{
  instruction: PhoneBookInstruction;
  onRemoveInstruction: (instruction: PhoneBookInstruction) => void;
  onEditInstruction: (instruction: PhoneBookInstruction) => void;
}> = ({ instruction, onRemoveInstruction, onEditInstruction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [fromNumberType, setFromNumberType] = useState<PhoneNumberTypeAny>(
    instruction.fromNumberType
  );
  const [toNumberType, setToNumberType] = useState<PhoneNumberTypeAny>(
    instruction.toNumberType
  );
  const [value, setValue] = useState(instruction.instruction);

  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  const insertPlaceholder = (placeholder: string) => {
    setValue(`${value}${placeholder}`);
  };

  const handleDelete = () => {
    setIsDeleteAlertOpen(false);
    onRemoveInstruction(instruction);
  };

  const handleSave = () => {
    setIsEditing(false);
    const updatedInstruction: PhoneBookInstruction = {
      ...instruction,
      fromNumberType,
      toNumberType,
      instruction: value,
    };
    onEditInstruction(updatedInstruction);
  };

  return (
    <Card sx={{ mt: 2, p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          {isEditing ? (
            <Box>
              <EditPhoneNumberTypesComponent
                fromNumberType={fromNumberType}
                toNumberType={toNumberType}
                setFromNumberType={setFromNumberType}
                setToNumberType={setToNumberType}
                insertPlaceholder={insertPlaceholder}
              />
              <Paper variant="outlined" sx={{ width: "100%", mt: 2 }}>
                <SimpleMDE
                  value={value}
                  onChange={onChange}
                  options={editorOptions}
                />
              </Paper>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">
                {instruction.fromNumberType} → {instruction.toNumberType}
              </Typography>
              <div className="markdown">
                <Markdown>{instruction.instruction}</Markdown>
              </div>
            </Box>
          )}
          {isEditing && (
            <Box sx={{ mt: 2, marginLeft: "auto" }}>
              <Button color="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </Box>
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          {!isEditing && (
            <Box>
              <IconButton onClick={() => setIsEditing(true)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => setIsDeleteAlertOpen(true)}>
                <Delete />
              </IconButton>
            </Box>
          )}
        </Stack>
      </Stack>
      <DeleteConfirmationDialog
        open={isDeleteAlertOpen}
        setOpen={setIsDeleteAlertOpen}
        handleDelete={handleDelete}
      />
    </Card>
  );
};

const AddInstructionComponent: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddInstruction: (instruction: PhoneBookInstruction) => void;
}> = ({ open, setOpen, onAddInstruction }) => {
  const [fromNumberType, setFromNumberType] = useState<PhoneNumberTypeAny>(
    PhoneNumberType.DSN
  );
  const [toNumberType, setToNumberType] = useState<PhoneNumberTypeAny>(
    PhoneNumberType.DSN
  );
  const [value, setValue] = useState("");
  const simpleMdeRef = useRef<EasyMDE>();

  useEffect(() => {
    if (simpleMdeRef.current) {
      simpleMdeRef.current.codemirror.focus();
    }
    setValue("");
    setFromNumberType(PhoneNumberType.DSN);
    setToNumberType(PhoneNumberType.DSN);
  }, [open]);

  const insertPlaceholder = (placeholder: string) => {
    if (simpleMdeRef.current) {
      const cm = simpleMdeRef.current.codemirror;
      const doc = cm.getDoc();
      const cursor = doc.getCursor();
      doc.replaceRange(placeholder, cursor);
    }
  };

  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  const handleSave = () => {
    const updatedInstruction: PhoneBookInstruction = {
      id: new Date().toUTCString(),
      fromNumberType,
      toNumberType,
      instruction: value,
    };
    onAddInstruction(updatedInstruction);
    setOpen(false);
  };

  return (
    open && (
      <Card sx={{ mt: 2, p: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="column" sx={{ flexGrow: 1 }}>
            <Box>
              <EditPhoneNumberTypesComponent
                fromNumberType={fromNumberType}
                toNumberType={toNumberType}
                setFromNumberType={setFromNumberType}
                setToNumberType={setToNumberType}
                insertPlaceholder={insertPlaceholder}
              />
              <Paper variant="outlined" sx={{ width: "100%", mt: 2 }}>
                <SimpleMDE
                  value={value}
                  onChange={onChange}
                  options={editorOptions}
                  getMdeInstance={(instance) =>
                    (simpleMdeRef.current = instance)
                  }
                />
              </Paper>
            </Box>
            <Box sx={{ mt: 2, marginLeft: "auto" }}>
              <Button color="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Add</Button>
            </Box>
          </Stack>
        </Stack>
      </Card>
    )
  );
};

const EditPhoneNumberTypesComponent: React.FC<{
  fromNumberType: PhoneNumberTypeAny;
  toNumberType: PhoneNumberTypeAny;
  setFromNumberType: (type: PhoneNumberTypeAny) => void;
  setToNumberType: (type: PhoneNumberTypeAny) => void;
  insertPlaceholder: (placeholder: string) => void;
}> = ({
  fromNumberType,
  toNumberType,
  setFromNumberType,
  setToNumberType,
  insertPlaceholder,
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Select
        value={fromNumberType}
        onChange={(e) =>
          setFromNumberType(e.target.value as PhoneNumberTypeAny)
        }
      >
        {Object.values(PhoneNumberType).map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
        <MenuItem value="Any">Any</MenuItem>
      </Select>
      <Typography variant="h6"> → </Typography>
      <Select
        value={toNumberType}
        onChange={(e) => setToNumberType(e.target.value as PhoneNumberTypeAny)}
      >
        {Object.values(PhoneNumberType).map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
        <MenuItem value="Any">Any</MenuItem>
      </Select>
      <Typography variant="caption" color="text.secondary">
        <ul>
          <li>
            <Link onClick={() => insertPlaceholder("<#Country-Code#>")}>
              {"Country Code"}
            </Link>{" "}
            for international country code
          </li>
          <li>
            <Link onClick={() => insertPlaceholder("<#Area-Code#>")}>
              {"Area Code"}
            </Link>{" "}
            for three digit area code
          </li>
          <li>
            <Link onClick={() => insertPlaceholder("<#Last-Four#>")}>
              {"Last Four"}
            </Link>{" "}
            last 4 digits of phone number{" "}
          </li>
          <li>
            <Link onClick={() => insertPlaceholder("<#Last-Four#>")}>
              {"Local Number"}
            </Link>{" "}
            for 7 digit phone number (U.S. example: XXX-XXXX){" "}
          </li>
          <li>
            <Link onClick={() => insertPlaceholder("<#Full-Number#>")}>
              {"National Number"}
            </Link>{" "}
            for 10 digit phone number (U.S. Example (XXX) XXX-XXXX){" "}
          </li>
          <li>
            <Link onClick={() => insertPlaceholder("<#International#>")}>
              {"International Number"}
            </Link>{" "}
            for international phone number including country code (U.S. Example
            +1 (XXX) XXX-XXXX)
          </li>
        </ul>
      </Typography>
    </Stack>
  );
};

const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDelete: () => void;
}> = ({ open, setOpen, handleDelete }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Delete Instruction</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this instruction?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BreadcrumbsComponent: React.FC = () => {
  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link
        underline="hover"
        color="inherit"
        sx={{ display: "flex", alignItems: "center" }}
        href="/"
      >
        Dashboard
      </Link>
      <Link
        underline="hover"
        color="inherit"
        sx={{ display: "flex", alignItems: "center" }}
        href="/phonebook"
      >
        Phonebook
      </Link>
      <Typography
        sx={{ display: "flex", alignItems: "center" }}
        color="text.primary"
      >
        Dialing Instructions
      </Typography>
    </Breadcrumbs>
  );
};

export default withAuth(PhoneBookInstructionsComponent);
