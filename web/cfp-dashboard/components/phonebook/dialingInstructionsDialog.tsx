import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  ClickAwayListener,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grow,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Select,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  PhoneBookEntry,
  PhoneBookInstruction,
  PhoneNumber,
  PhoneNumberType,
  PhoneNumberTypeAny,
} from "@/app/types/phonebook";
import PhoneNumberDisplay from "./phoneNumberDisplay";
import Markdown from "react-markdown";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
import {
  ArrowDownward,
  CopyAllOutlined,
  KeyboardArrowDown,
} from "@mui/icons-material";

interface DialingInstructionsDialogProps {
  selection: { entry: PhoneBookEntry; phoneNumber: PhoneNumber };
  instructions: PhoneBookInstruction[];
  open: boolean;
  onClose: () => void;
}

const formatPhoneNumber = (phoneNumber: PhoneNumber) => {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber.number);
  return parsedNumber?.formatNational() || phoneNumber.number;
};

const DialingInstructionsDialog: React.FC<DialingInstructionsDialogProps> = ({
  selection,
  instructions,
  open,
  onClose,
}) => {
  const { entry, phoneNumber } = selection;
  const { number, type } = phoneNumber;

  const [currentPhoneNumber, setCurrentPhoneNumber] =
    useState<PhoneNumber>(phoneNumber);

  const [fromNumberType, setFromNumberType] = useState<PhoneNumberTypeAny>(
    PhoneNumberType.DSN
  );

  const [instruction, setInstruction] = useState<PhoneBookInstruction>();

  const availableInstructions = instructions.filter(
    (i) => i.toNumberType === currentPhoneNumber.type
  );

  useEffect(() => {
    const fallbackInstruction =
      availableInstructions.length > 0 ? availableInstructions[0] : undefined;
    const instruction =
      instructions.find(
        (instruction) =>
          instruction.fromNumberType === fromNumberType &&
          instruction.toNumberType === phoneNumber.type
      ) || fallbackInstruction;
    console.log(
      "Instruction for FROM: ",
      fromNumberType,
      "TO: ",
      phoneNumber.type,
      ", is: ",
      instruction
    );
    setInstruction(instruction);
  }, [fromNumberType, phoneNumber.type, instructions, availableInstructions]);

  const availableInstructionFromTypes = Array.from(
    new Set(instructions.map((instruction) => instruction.fromNumberType))
  );

  useEffect(() => {
    console.log("Available instructions", availableInstructionFromTypes);
    if (availableInstructionFromTypes.includes(PhoneNumberType.DSN)) {
      setFromNumberType(PhoneNumberType.DSN);
    } else if (availableInstructionFromTypes.length > 0) {
      setFromNumberType(availableInstructionFromTypes[0]);
    } else {
      setFromNumberType("Any");
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setFromNumberType(newValue as PhoneNumberType);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{entry.name}</DialogTitle>
      <DialogContent>
        <Box>
          <CurrentPhoneNumberDisplay
            {...{
              currentPhoneNumber,
              setCurrentPhoneNumber,
              availablePhoneNumbers: entry.phoneNumbers,
            }}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Dialing instructions when calling from:
            </Typography>
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Tabs value={fromNumberType} onChange={handleTabChange}>
              {availableInstructions.map((instruction) => (
                <Tab
                  key={instruction.id}
                  value={instruction.fromNumberType}
                  label={instruction.fromNumberType}
                />
              ))}
            </Tabs>
          </Box>
          <InstructionDisplay
            instruction={instruction}
            phoneNumber={currentPhoneNumber}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const CurrentPhoneNumberDisplay: React.FC<{
  currentPhoneNumber: PhoneNumber;
  setCurrentPhoneNumber: (phoneNumber: PhoneNumber) => void;
  availablePhoneNumbers: PhoneNumber[];
}> = ({ currentPhoneNumber, setCurrentPhoneNumber, availablePhoneNumbers }) => {
  const [formattedNumber, setFormattedNumber] = useState<string>();
  const [anchorRef, setAnchorRef] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setFormattedNumber(formatPhoneNumber(currentPhoneNumber));
  }, [currentPhoneNumber]);

  const copyNumberToClipboard = () => {
    navigator.clipboard.writeText(currentPhoneNumber.number);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorRef(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorRef(null);
  };

  const handleMenuSelect = (value: PhoneNumber) => {
    setCurrentPhoneNumber(value);
    handleMenuClose();
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="center"
    >
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h3">{formattedNumber}</Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          {currentPhoneNumber.type}
        </Typography>
      </Paper>
      {availablePhoneNumbers.length > 1 && (
        <IconButton onClick={handleMenuOpen}>
          <KeyboardArrowDown />
        </IconButton>
      )}
      {anchorRef && (
        <ClickAwayListener onClickAway={handleMenuClose}>
          <Menu
            id="basic-menu"
            anchorEl={anchorRef}
            open={Boolean(anchorRef)}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {availablePhoneNumbers.map((phoneNumber) => (
              <MenuItem
                key={phoneNumber.number}
                value={phoneNumber.number}
                onClick={() => handleMenuSelect(phoneNumber)}
              >
                {phoneNumber.type}
                {" - "}
                {formatPhoneNumber(phoneNumber)}
              </MenuItem>
            ))}
          </Menu>
        </ClickAwayListener>
      )}
      {/* <IconButton onClick={copyNumberToClipboard}>
        <CopyAllOutlined />
      </IconButton> */}
    </Stack>
  );
};

const replacePlaceholder = (instruction: string, phoneNumber: PhoneNumber) => {
  const phone = parsePhoneNumberFromString(phoneNumber.number);
  const areaCode = phone?.formatNational().split(" ")[0];
  const sevenDigit = phone?.formatNational().split(" ")[1];
  const lastFour = phone?.formatNational().split(" ")[2];
  const fullNumber = phone?.formatNational();
  const international = phone?.formatInternational();
  return instruction
    .replaceAll("<#Area-Code#>", areaCode || "")
    .replaceAll("<#Last-Four#>", lastFour || "")
    .replaceAll("<#Local-Number#>", sevenDigit || "")
    .replaceAll("<#Full-Number#>", fullNumber || "")
    .replaceAll("<#International#>", international || "");
};

const InstructionDisplay: React.FC<{
  instruction: PhoneBookInstruction | undefined;
  phoneNumber: PhoneNumber;
}> = ({ instruction, phoneNumber }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Card variant="outlined" sx={{ p: 2, mt: 1 }}>
        {instruction && (
          <div className="markdown">
            <Markdown>
              {replacePlaceholder(instruction.instruction, phoneNumber)}
            </Markdown>
          </div>
        )}
        {!instruction && (
          <Typography variant="body1">
            No dialing instructions provided for this number.
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default DialingInstructionsDialog;
