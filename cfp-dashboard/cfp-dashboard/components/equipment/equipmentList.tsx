import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  Box,
  IconButton,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import AddEquipmentGroupDialog from "./equipmentGroup/addEquipmentGroupDialog";
import { EquipmentGroup, Equipment } from "@/app/types/equipment";
import EquipmentGroupRow from "./equipmentGroupRow";

const EquipmentList: React.FC = () => {
  const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroup[]>([]);
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
  const [addOpen, setAddOpen] = useState(false);

  const handleToggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddEquipmentGroup = (equipmentGroup: EquipmentGroup) => {
    setEquipmentGroups([...equipmentGroups, equipmentGroup]);
  };

  const handleEditEquipmentGroup = (equipmentGroup: EquipmentGroup) => {
    setEquipmentGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((group) =>
        group.id === equipmentGroup.id ? equipmentGroup : group
      );
      return updatedGroups;
    });
  };

  const handleDeleteEquipmentGroup = (equipmentGroup: EquipmentGroup) => {
    setEquipmentGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== equipmentGroup.id)
    );
  };

  const handleAddEquipmentItem = (
    equipment: Equipment,
    group: EquipmentGroup
  ) => {
    setEquipmentGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((g) =>
        g.id === group.id ? { ...g, equipment: [...g.equipment, equipment] } : g
      );
      return updatedGroups;
    });
  };

  const handleEditEquipmentItem = (
    equipment: Equipment,
    group: EquipmentGroup
  ) => {
    setEquipmentGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((g) =>
        g.id === group.id
          ? {
              ...g,
              equipment: g.equipment.map((e) =>
                e.id === equipment.id ? equipment : e
              ),
            }
          : g
      );
      return updatedGroups;
    });
  };

  const handleDeleteEquipmentItem = (
    equipment: Equipment,
    group: EquipmentGroup
  ) => {
    setEquipmentGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((g) =>
        g.id === group.id
          ? {
              ...g,
              equipment: g.equipment.filter((e) => e.id !== equipment.id),
            }
          : g
      );
      return updatedGroups;
    });
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="trailing"
        justifyContent="space-between"
      >
        <Typography variant="h6" component="div">
          Equipment
        </Typography>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={() => setAddOpen(true)}>
            <Add />
          </IconButton>
        </Stack>
      </Stack>
      {equipmentGroups.length > 0 ? (
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableBody>
              {equipmentGroups.map((row) => (
                <EquipmentGroupRow
                  key={row.id}
                  row={row}
                  open={!!openRows[row.id]}
                  onToggle={() => handleToggleRow(row.id)}
                  handleEditEquipmentGroup={handleEditEquipmentGroup}
                  handleDeleteEquipmentGroup={handleDeleteEquipmentGroup}
                  handleAddEquipmentItem={handleAddEquipmentItem}
                  handleEditEquipmentItem={handleEditEquipmentItem}
                  handleDeleteEquipmentItem={handleDeleteEquipmentItem}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box textAlign="center" sx={{ m: 2 }}>
          <Typography component="div">No equipment added</Typography>
        </Box>
      )}
      <AddEquipmentGroupDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddEquipmentGroup}
      />
    </Box>
  );
};

export default EquipmentList;
