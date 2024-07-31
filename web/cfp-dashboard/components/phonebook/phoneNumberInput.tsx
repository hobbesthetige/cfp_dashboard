import React from "react";
import PhoneFormatter from "react-headless-phone-input/lazy";
import TextField from "@mui/material/TextField";
import TinyFlagReact from "react-flagkit";
import { Box, Typography } from "@mui/material";
import { PhoneNumberType } from "@/app/types/phonebook";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";

interface PhoneNumberTextFieldProps {
  type: PhoneNumberType;
  value: string;
  onChange: (value: string) => void;
}

const dsnAreaCodes = ["318", "312", "314", "315", "316", "317", "319"];

const PhoneNumberTextField: React.FC<PhoneNumberTextFieldProps> = ({
  type,
  value,
  onChange,
  ...rest
}) => {
  const getCountryFlag = (phone: string, country?: string) => {
    const defaultCountry: CountryCode = (country as CountryCode) || "US";
    const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry);
    if (phoneNumber) {
      const areaCode = phoneNumber.nationalNumber.slice(0, 3);
      if (dsnAreaCodes.includes(areaCode)) {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "black",
              p: "2px",
              border: "1px solid black",
              borderRadius: "4px",
            }}
          >
            DSN
          </Typography>
        );
      }
    }
    return country ? (
      <TinyFlagReact country={country} alt={`${country} flag`} />
    ) : (
      <>🏳️</>
    );
  };

  return (
    <PhoneFormatter defaultCountry="US" value={value} onChange={onChange}>
      {({ country, impossible, onBlur, onInputChange, inputValue }) => {
        return (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "24px",
                  marginRight: "8px",
                }}
              >
                {type === PhoneNumberType.DSN ? (
                  getCountryFlag(inputValue, country)
                ) : country ? (
                  <TinyFlagReact country={country} alt={`${country} flag`} />
                ) : (
                  <>🏳️</>
                )}
              </span>
              <TextField
                type="tel"
                value={inputValue}
                onBlur={onBlur}
                onChange={(e) => onInputChange(e.target.value)}
                {...rest}
              />
            </div>
            {impossible && (
              <div style={{ color: "red" }}>Impossible phone number</div>
            )}
          </>
        );
      }}
    </PhoneFormatter>
  );
};

export default PhoneNumberTextField;
