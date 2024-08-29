import React, {
  ChangeEvent,
  ReactNode,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Divider,
  Typography,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import {
  PhoneBookEntry,
  PhoneNumber,
  PhoneNumberType,
} from "@/app/types/phonebook";
import { Add, DeleteOutline, Phone } from "@mui/icons-material";
import PhoneNumberTextField from "./phoneNumberInput";
import PhoneNumberDisplay from "./phoneNumberDisplay";

interface EditPhonebookEntryDialogProps {
  entry: PhoneBookEntry;
  onClose: () => void;
  onEditEntry: (entry: PhoneBookEntry) => void;
}

const EditPhonebookEntryDialog: React.FC<EditPhonebookEntryDialogProps> = ({
  entry: defaultEntry,
  onClose,
  onEditEntry,
}) => {
  const [entry, setEntry] = useState(defaultEntry);
  const [type, setType] = useState(PhoneNumberType.DSN);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, [event.target.name]: event.target.value });
  };

  const handlePhoneNumberChange = useCallback((value: string | undefined) => {
    setPhoneNumber(value || "");
  }, []);

  const handleSave = () => {
    onEditEntry(entry);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setEntry(defaultEntry);
    resetPhoneNumber();
  };

  const resetPhoneNumber = () => {
    setType(PhoneNumberType.DSN);
    setPhoneNumber("");
  };

  function handleTypeChange(
    event: SelectChangeEvent<string>,
    child: ReactNode
  ): void {
    const { value } = event.target;
    setType(value as PhoneNumberType);
  }

  const handleSubmitPhoneNumber = () => {
    setEntry({
      ...entry,
      phoneNumbers: [...entry.phoneNumbers, { type, number: phoneNumber }],
    });
    resetPhoneNumber();
  };

  const handleDeletePhoneNumber = (phoneNumber: PhoneNumber) => {
    setEntry({
      ...entry,
      phoneNumbers: entry.phoneNumbers.filter(
        (p) => p.type !== phoneNumber.type && p.number !== phoneNumber.number
      ),
    });
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Phonebook Entry</DialogTitle>
      <DialogContent>
        <TextField
          id="name"
          name="name"
          value={entry.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="location"
          label="Location"
          name="location"
          value={entry.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="email"
          label="Email"
          name="email"
          value={entry.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Divider sx={{ mt: 2 }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Phone Numbers
        </Typography>
        <Stack direction="row" spacing={2} margin="normal" sx={{ mt: 2 }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="phonetype-select-label">Type</InputLabel>
            <Select
              labelId="phonetype-select-label"
              id="phonetype-select"
              value={type}
              label="Type"
              onChange={handleTypeChange}
            >
              {Object.values(PhoneNumberType).map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <PhoneNumberTextField
            type={type}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <Button onClick={handleSubmitPhoneNumber}>
            <Add />
          </Button>
        </Stack>
        <Box sx={{ mt: 2 }}>
          <PhoneNumbersList
            phoneNumbers={entry.phoneNumbers}
            onDelete={handleDeletePhoneNumber}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PhoneNumbersList: React.FC<{
  phoneNumbers: PhoneBookEntry["phoneNumbers"];
  onDelete: (phoneNumber: PhoneNumber) => void;
}> = ({ phoneNumbers, onDelete }) => {
  return (
    phoneNumbers.length > 0 && (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Number</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {phoneNumbers.map((phoneNumber, index) => (
              <TableRow key={index}>
                <TableCell>{phoneNumber.type}</TableCell>
                <TableCell>
                  <PhoneNumberDisplay
                    type={phoneNumber.type}
                    value={phoneNumber.number}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onDelete(phoneNumber)}>
                    <DeleteOutline />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
};

export default EditPhonebookEntryDialog;
