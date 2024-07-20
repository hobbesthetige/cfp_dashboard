import React, { use, useEffect, useState } from "react";
import PhoneFormatter from "react-headless-phone-input/lazy";
import TinyFlagReact from "react-flagkit";
import { Box, Typography } from "@mui/material";
import { PhoneNumberType } from "@/app/types/phonebook";
import {
  PhoneNumber,
  parsePhoneNumberFromString,
  CountryCode,
} from "libphonenumber-js";

interface PhoneNumberDisplayProps {
  type: PhoneNumberType;
  value: string;
}

const PhoneNumberDisplay: React.FC<PhoneNumberDisplayProps> = ({
  type,
  value,
  ...rest
}) => {
  const [phoneString, setPhoneString] = useState<string>();

  useEffect(() => {
    const number = parsePhoneNumberFromString(value);
    if (number) {
      console.log(type);
      if (type === PhoneNumberType.Commercial && number.country !== "US") {
        setPhoneString(number.formatInternational());
      } else {
        setPhoneString(number.formatNational());
      }
    } else {
      setPhoneString("");
    }
  }, [value, type]);

  return <Typography>{phoneString && phoneString}</Typography>;
};

export default PhoneNumberDisplay;
