import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import {
  MenuItem,
  IconButton,
  ListItemIcon,
  Menu,
  Divider,
} from "@mui/material";
import { Check, FilterList } from "@mui/icons-material";
import { EventLogLevel } from "./eventsList";

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

function getStyles(name: string, checkedCategories: string[], theme: Theme) {
  return {
    fontWeight:
      checkedCategories.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export interface EventsFilterSelectProps {
  categories: string[];
  logLevels: EventLogLevel[];
  handleCategoriesChange: (categories: string[]) => void;
  handleLogLevelsChange: (logLevels: EventLogLevel[]) => void;
}

export default function EventsFilterSelect(props: EventsFilterSelectProps) {
  const {
    categories,
    handleCategoriesChange,
    logLevels,
    handleLogLevelsChange,
  } = props;
  const theme = useTheme();
  const [checkedCategories, setCheckedCategories] = React.useState<string[]>(
    []
  );
  const [checkedLogLevels, setCheckedLogLevels] = React.useState<
    EventLogLevel[]
  >([]);

  const handleCategoryChange = (value: string) => {
    setCheckedCategories((prevValues) => {
      if (prevValues.includes(value)) {
        return prevValues.filter((category) => category !== value);
      } else {
        return [...prevValues, value];
      }
    });
  };

  const handleLogLevelChange = (value: EventLogLevel) => {
    setCheckedLogLevels((prevValues) => {
      if (prevValues.includes(value)) {
        return prevValues.filter((level) => level !== value);
      } else {
        return [...prevValues, value];
      }
    });
  };

  const handleClearCategories = () => {
    setCheckedCategories([]);
  };

  React.useEffect(() => {
    handleCategoriesChange(checkedCategories);
  }, [handleCategoriesChange, checkedCategories]);

  React.useEffect(() => {
    handleLogLevelsChange(checkedLogLevels);
  }, [handleLogLevelsChange, checkedLogLevels]);

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
            style={getStyles(name, checkedCategories, theme)}
            onClick={() => handleCategoryChange(name)}
          >
            {checkedCategories.includes(name) && (
              <ListItemIcon>
                <Check />
              </ListItemIcon>
            )}
            {name}
          </MenuItem>
        ))}
        <MenuItem key={"none"} value={"None"} onClick={handleClearCategories}>
          {checkedCategories.length === 0 && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          )}
          None
        </MenuItem>
        <Divider />
        {logLevels.map((level) => (
          <MenuItem
            key={level}
            value={level}
            onClick={() => handleLogLevelChange(level)}
          >
            {checkedLogLevels.includes(level) && (
              <ListItemIcon>
                <Check />
              </ListItemIcon>
            )}
            {level}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
