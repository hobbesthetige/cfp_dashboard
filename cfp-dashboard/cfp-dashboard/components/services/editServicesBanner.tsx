import { EquipmentGroup, EquipmentService } from "@/app/types/equipment";
import useAxios from "@/contexts/useAxios";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { on } from "events";
import React, { useEffect, useCallback, useState } from "react";

interface EditServicesBannerProps {
  groups: EquipmentGroup[];
  onUpdate: () => void;
}

const EditServicesBanner: React.FC<EditServicesBannerProps> = (props) => {
  const [groups, setGroups] = useState<EquipmentGroup[]>(props.groups);
  const [open, setOpen] = useState(false);
  const axios = useAxios();

  const toggleDialog = () => setOpen(!open);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setGroups(props.groups);
  }, [props]);

  const toggleService = async (
    group: EquipmentGroup,
    service: EquipmentService
  ) => {
    service.isVisible = !service.isVisible;
    await axios.patch(
      `equipmentGroups/${group.id}/services/${service.id}`,
      service
    );
    props.onUpdate();
  };

  return (
    <Box>
      <IconButton onClick={toggleDialog}>
        <Add />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Equipment Services</DialogTitle>
        <DialogContent>
          <Box>
            <List>
              {groups.map((group) => (
                <Box key={group.id}>
                  <ListItem disableGutters>
                    <Typography variant="h6">{group.name}</Typography>
                  </ListItem>
                  {group.services.map((service, index) => (
                    <ListItem disableGutters key={index}>
                      <ListItemButton
                        role={undefined}
                        onClick={() => toggleService(group, service)}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={service.isVisible}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${service.enclave} ${service.serviceName}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {/* {index !== equipmentGroups.length - 1 && <Divider />} */}
                </Box>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditServicesBanner;
