"use client";

import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { PhoneBook, PhoneBookInstruction } from "../../types/phonebook";
import { useTitle } from "@/contexts/titleProvider";
import withAuth from "@/components/withAuth";
import useAxios from "@/contexts/useAxios";
import { Axios } from "axios";
import { NavigateNext } from "@mui/icons-material";
import InstructionsComponent from "./components/instructions";
import NoInstrutionsComponent from "./components/noInstructions";

const PhoneBookInstructionsComponent: React.FC = () => {
  const { setTitle } = useTitle();
  const axios = useAxios();
  const [phoneBook, setPhoneBook] = useState<PhoneBook | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    setTitle("Dialing Instructions");
    getPhoneBook(axios).then((data) => setPhoneBook(data));
  }, [axios, setTitle]);

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
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">Dialing Instructions</Typography>
          {phoneBook && phoneBook.instructions.length > 0 && (
            <Button onClick={handleAddClick}>Add Instruction Set</Button>
          )}
        </Stack>
        <Stack direction="column">
          {(!phoneBook || phoneBook.instructions.length === 0) &&
            !isAddOpen && (
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
      </Container>
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
