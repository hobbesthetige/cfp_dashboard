import {
  EquipmentGroup,
  EquipmentService,
  makeEquipmentServiceWithName,
} from "@/app/types/equipment";
import { Add } from "@mui/icons-material";
import {
  Card,
  Stack,
  Typography,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import AddServiceDialog from "../addServiceDialog";
import EditServiceDialog from "../editServiceDialog";

interface ServicesListProps {
  equipmentGroup: EquipmentGroup;
  setEditingEquipmentGroup: (equipmentGroup: EquipmentGroup) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  equipmentGroup,
  setEditingEquipmentGroup,
}) => {
  const [editingService, setEditingService] =
    useState<EquipmentService | null>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [openAddService, setOpenAddService] = useState(false);

  const handleServiceClick = (service: EquipmentService) => {
    setEditingService(service);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddService = (service: EquipmentService) => {
    const updatedEquipmentGroup = {
      ...equipmentGroup,
      services: [...equipmentGroup.services, service],
    };
    setEditingEquipmentGroup(updatedEquipmentGroup);
    setOpenAddService(false);
  };

  const addEnclaveServices = (enclave: string) => {
    const services = [
      makeEquipmentServiceWithName("Data", enclave),
      makeEquipmentServiceWithName("Voice", enclave),
    ];
    const updatedEquipmentGroup = {
      ...equipmentGroup,
      services: [...equipmentGroup.services, ...services],
    };
    handleMenuClose();
  };

  return (
    <Stack spacing={2}>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="h5">Services</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleMenuClick}>
          <Add />
        </IconButton>
        <AddServiceDialog
          open={openAddService}
          handleClose={() => {
            setOpenAddService(false);
          }}
          handleAdd={handleAddService}
        />
      </Stack>
      <List>
        {equipmentGroup.services.length === 0 && (
          <Typography>No services.</Typography>
        )}
        {equipmentGroup.services.map((service) => (
          <Box key={service.id}>
            <ListItemButton onClick={() => handleServiceClick(service)}>
              <ListItemText
                primary={
                  service.enclave
                    ? `${service.enclave} ${service.serviceName}`
                    : service.serviceName
                }
                secondary={service.notes}
              />
            </ListItemButton>
            {equipmentGroup.services.length - 1 !==
              equipmentGroup.services.indexOf(service) && <Divider />}
            <EditServiceDialog
              service={service}
              open={editingService === service}
              handleClose={() => setEditingService(null)}
              handleUpdate={(service) => {
                const updatedServices = equipmentGroup.services.map((s) =>
                  s.id === service.id ? service : s
                );
                setEditingService(null);
                const updatedEquipmentGroup = {
                  ...equipmentGroup,
                  services: updatedServices,
                };
                setEditingEquipmentGroup(updatedEquipmentGroup);
              }}
              handleDelete={(service) => {
                const updatedServices = equipmentGroup.services.filter(
                  (s) => s.id !== service.id
                );
                const updatedEquipmentGroup = {
                  ...equipmentGroup,
                  services: updatedServices,
                };
                setEditingEquipmentGroup(updatedEquipmentGroup);
                setEditingService(null);
              }}
            />
          </Box>
        ))}
      </List>
      <Menu
        id="prefilled-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => addEnclaveServices("NIPR")}>
          NIPR Data & Voice
        </MenuItem>
        <MenuItem onClick={() => addEnclaveServices("SIPR")}>
          SIPR Data & Voice
        </MenuItem>
        <MenuItem
          onClick={() => {
            addEnclaveServices("NIPR");
            addEnclaveServices("SIPR");
          }}
        >
          NIPR & SIPR Data & Voice
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setOpenAddService(true);
          }}
        >
          Custom Service
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default ServicesList;
