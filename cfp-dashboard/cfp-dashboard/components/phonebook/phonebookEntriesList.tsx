import React, { useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  ListItemButton,
} from "@mui/material";
import {
  PhoneBook,
  PhoneBookEntry,
  PhoneNumber,
  PhoneNumberType,
} from "../../app/types/phonebook";
import PhoneNumberDisplay from "./phoneNumberDisplay";
import { Edit } from "@mui/icons-material";
import EditPhonebookEntryDialog from "./editPhonebookEntryDialog";
import DialingInstructionsDialog from "./dialingInstructionsDialog";

const PhoneBookEntriesList: React.FC<{
  phonebook: PhoneBook;
  onEdit: (entry: PhoneBookEntry) => void;
}> = ({ phonebook, onEdit }) => {
  const uniquePhoneTypes = useCallback(() => {
    const acc: PhoneNumberType[] = [];
    phonebook.entries.forEach((entry) => {
      entry.phoneNumbers.forEach((phoneNumber) => {
        if (!acc.includes(phoneNumber.type)) {
          acc.push(phoneNumber.type);
        }
      });
    });
    return acc;
  }, [phonebook.entries]);

  const [editingEntry, setEditingEntry] = useState<PhoneBookEntry>();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<{
    entry: PhoneBookEntry;
    phoneNumber: PhoneNumber;
  }>();

  const beginEdit = (entry: PhoneBookEntry) => {
    setEditingEntry(entry);
  };

  const handleOnEdit = (entry: PhoneBookEntry) => {
    onEdit(entry);
    setEditingEntry(undefined);
  };

  const showDialingInstructions = (
    entry: PhoneBookEntry,
    phoneNumber: PhoneNumber
  ) => {
    setSelectedPhoneNumber({ entry, phoneNumber });
  };

  const closeDialingInstructions = () => {
    setSelectedPhoneNumber(undefined);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            {uniquePhoneTypes().map((phoneType, index) => (
              <TableCell key={index}>{phoneType}</TableCell>
            ))}
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {phonebook.entries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell style={{ verticalAlign: "top" }}>
                {entry.name}
              </TableCell>
              <TableCell style={{ verticalAlign: "top" }}>
                {entry.location}
              </TableCell>
              {uniquePhoneTypes().map((phoneType, phoneIndex) => (
                <TableCell key={phoneIndex} style={{ verticalAlign: "top" }}>
                  {entry.phoneNumbers
                    .filter((phoneNumber) => phoneNumber.type === phoneType)
                    .map((phoneNumber, phoneNumberIndex) => (
                      <div key={phoneNumberIndex}>
                        <ListItemButton
                          onClick={() =>
                            showDialingInstructions(entry, phoneNumber)
                          }
                        >
                          <PhoneNumberDisplay
                            type={phoneNumber.type}
                            value={phoneNumber.number}
                          />
                        </ListItemButton>
                      </div>
                    ))}
                </TableCell>
              ))}
              <TableCell style={{ verticalAlign: "top" }}>
                {entry.email}
              </TableCell>
              <TableCell style={{ verticalAlign: "top" }}>
                <IconButton onClick={() => beginEdit(entry)}>
                  <Edit />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingEntry && (
        <EditPhonebookEntryDialog
          entry={editingEntry}
          onEditEntry={handleOnEdit}
          onClose={() => setEditingEntry(undefined)}
        />
      )}
      {selectedPhoneNumber && (
        <DialingInstructionsDialog
          selection={selectedPhoneNumber}
          instructions={phonebook.instructions}
          open={Boolean(selectedPhoneNumber)}
          onClose={closeDialingInstructions}
        />
      )}
    </TableContainer>
  );
};

export default PhoneBookEntriesList;
