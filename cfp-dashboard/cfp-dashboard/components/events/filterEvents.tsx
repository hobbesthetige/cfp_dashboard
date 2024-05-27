import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button, IconButton, ListItemIcon, Menu } from "@mui/material";
import { Check, Filter, Filter1, FilterList } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export interface EventsFilterSelectProps {
  categories: string[];
  handleCategoriesChange: (categories: string[]) => void;
}

export default function EventsFilterSelect(props: EventsFilterSelectProps) {
  const { categories } = props;
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (value: string) => {
    setPersonName((prevNames) => {
      if (prevNames.includes(value)) {
        return prevNames.filter((name) => name !== value);
      } else {
        return [...prevNames, value];
      }
    });
  };

  const handleClear = () => {
    setPersonName([]);
  };

  React.useEffect(() => {
    props.handleCategoriesChange(personName);
  }, [props, personName]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="filter-events-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FilterList />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {categories.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, personName, theme)}
            onClick={() => handleChange(name)}
          >
            {personName.includes(name) && (
              <ListItemIcon>
                <Check />
              </ListItemIcon>
            )}
            {name}
          </MenuItem>
        ))}
        <MenuItem key={"none"} value={"None"} onClick={() => handleClear()}>
          {personName.length == 0 && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          )}
          None
        </MenuItem>
      </Menu>
    </div>
  );
}
