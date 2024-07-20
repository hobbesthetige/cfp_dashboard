"use client";

import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  PhoneBook,
  PhoneBookEntry,
  PhoneBookInstruction,
} from "../types/phonebook";
import { useTitle } from "@/contexts/titleProvider";
import PhoneBookEntriesList from "@/components/phonebook/phonebookEntriesList";
import withAuth from "@/components/withAuth";
import useAxios from "@/contexts/useAxios";
import { Axios } from "axios";
import {
  Add,
  ContactPhoneOutlined,
  Home,
  NavigateNext,
  Phone,
} from "@mui/icons-material";
import AddPhonebookEntryDialog from "@/components/phonebook/addPhonebookEntryDialog";
import PhoneBookInstructionsDialog from "@/components/phonebook/phonebookInstructionsDialog";
import { useRouter } from "next/navigation";
import { Link } from "@mui/material";

const getPhoneBook = async (axios: Axios): Promise<PhoneBook> => {
  const response = await axios.get("/phonebook");
  return response.data;
};

const savePhoneBookEntries = async (
  axios: Axios,
  entries: PhoneBookEntry[]
): Promise<void> => {
  await axios.put("/phonebook/entries", entries);
};

const savePhoneBookInstructions = async (
  axios: Axios,
  instructions: PhoneBookInstruction[]
): Promise<void> => {
  await axios.put("/phonebook/instructions", instructions);
};

const PhoneBookComponent: React.FC = () => {
  const { setTitle } = useTitle();
  const axios = useAxios();
  const [phoneBook, setPhoneBook] = useState<PhoneBook | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTitle("Phonebook");
    getPhoneBook(axios).then((data) => setPhoneBook(data));
  }, []);

  const onAddEntry = (entry: PhoneBookEntry) => {
    if (phoneBook) {
      const newEntries = [...phoneBook.entries, entry];
      setPhoneBook({
        ...phoneBook,
        entries: newEntries,
      });
      savePhoneBookEntries(axios, newEntries);
    }
  };

  const onEditEntry = (entry: PhoneBookEntry) => {
    if (phoneBook) {
      const updatedEntries = phoneBook.entries.map((e) =>
        e.id === entry.id ? entry : e
      );
      setPhoneBook({ ...phoneBook, entries: updatedEntries });
      savePhoneBookEntries(axios, updatedEntries);
    }
  };

  const onRemoveEntry = (entry: PhoneBookEntry) => {
    if (phoneBook) {
      const updatedEntries = phoneBook.entries.filter((e) => e.id !== entry.id);
      setPhoneBook({ ...phoneBook, entries: updatedEntries });
      savePhoneBookEntries(axios, updatedEntries);
    }
  };

  const onAddInstruction = (instruction: PhoneBookInstruction) => {
    if (phoneBook) {
      const updatedInstructions = [...phoneBook.instructions, instruction];
      setPhoneBook({ ...phoneBook, instructions: updatedInstructions });
      savePhoneBookInstructions(axios, updatedInstructions);
    }
  };

  const onEditInstruction = (instruction: PhoneBookInstruction) => {
    if (phoneBook) {
      const updatedInstructions = phoneBook.instructions.map((i) =>
        i.fromNumberType === instruction.fromNumberType &&
        i.toNumberType === instruction.toNumberType
          ? instruction
          : i
      );
      setPhoneBook({ ...phoneBook, instructions: updatedInstructions });
      savePhoneBookInstructions(axios, updatedInstructions);
    }
  };

  const onRemoveInstruction = (instruction: PhoneBookInstruction) => {
    if (phoneBook) {
      const updatedInstructions = phoneBook.instructions.filter(
        (i) =>
          i.fromNumberType === instruction.fromNumberType &&
          i.toNumberType === instruction.toNumberType
      );
      setPhoneBook({ ...phoneBook, instructions: updatedInstructions });
      savePhoneBookInstructions(axios, updatedInstructions);
    }
  };

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  const handleInstructionsClick = () => {
    router.push("/phonebook/instructions");
  };

  return (
    <Box>
      <BreadcrumbsComponent />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">Phonebook</Typography>
        {phoneBook && phoneBook.entries.length > 0 && (
          <Button onClick={handleAddClick}>Add Entry</Button>
        )}
      </Stack>
      <Box sx={{ mt: 2 }}>
        {phoneBook && phoneBook.entries.length === 0 && (
          <NoEntriesComponent handleAddClick={handleAddClick} />
        )}
        {phoneBook && phoneBook.entries.length > 0 && (
          <PhoneBookEntriesList phonebook={phoneBook} onEdit={onEditEntry} />
        )}
        {phoneBook && phoneBook.entries.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Button onClick={handleInstructionsClick}>
              Setup dialing instructions
            </Button>
            {isInstructionsOpen && (
              <PhoneBookInstructionsDialog
                open={isInstructionsOpen}
                onClose={() => setIsInstructionsOpen(false)}
                onAddInstruction={onAddInstruction}
                onEditInstruction={onEditInstruction}
                onRemoveInstruction={onRemoveInstruction}
                instructions={phoneBook.instructions}
              />
            )}
          </Box>
        )}
      </Box>
      <AddPhonebookEntryDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddEntry={onAddEntry}
      />
    </Box>
  );
};

const NoEntriesComponent: React.FC<{ handleAddClick: () => void }> = ({
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
        No phonebook entries
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Use the phonebook to keep track of phonenumbers and dialing instructions
        to call between DSN, commercial, and XComm numbers.
      </Typography>
      <Button onClick={handleAddClick}>Add Entry</Button>
    </Box>
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
      <Typography
        sx={{ display: "flex", alignItems: "center" }}
        color="text.primary"
      >
        Phonebook
      </Typography>
    </Breadcrumbs>
  );
};

export default withAuth(PhoneBookComponent);
