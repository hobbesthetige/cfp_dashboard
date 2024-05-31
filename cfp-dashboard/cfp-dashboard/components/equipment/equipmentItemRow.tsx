import { EquipmentGroup, Equipment } from "@/app/types/equipment";
import { Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import EditEquipmentItemDialog from "./equipmentLineItem/editEquipmentItemDialog";

const EquipmentListItem = ({
  group,
  equipment,
}: {
  group: EquipmentGroup;
  equipment: Equipment;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ListItem key={equipment.id} onClick={() => setIsEditing(true)}>
      <ListItemText
        primary={`${equipment.quantity > 1 ? `${equipment.quantity}x: ` : ""}${
          equipment.name
        }`}
        secondary={`${equipment.category} - ${equipment.department} Department${
          equipment.serialNumber ? ` - Serial #${equipment.serialNumber}` : ""
        }`}
      />
    </ListItem>
  );
};

export const ListOfEquipment = ({
  group,
  handleEditEquipmentItem,
  handleDeleteEquipmentItem,
}: {
  group: EquipmentGroup;
  handleEditEquipmentItem: (
    equipment: Equipment,
    group: EquipmentGroup
  ) => void;
  handleDeleteEquipmentItem: (
    equipment: Equipment,
    group: EquipmentGroup
  ) => void;
}) => {
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>();

  return (
    <List sx={{ paddingLeft: 6 }}>
      {group.equipment.map((equipment, index) => (
        <Box key={equipment.id} onClick={() => setEditingEquipment(equipment)}>
          <EquipmentListItem group={group} equipment={equipment} />
          {index !== group.equipment.length - 1 && (
            <Divider sx={{ ml: 2 }} component="li" />
          )}
        </Box>
      ))}
      {editingEquipment && (
        <EditEquipmentItemDialog
          group={group}
          equipment={editingEquipment}
          open={true}
          onClose={() => setEditingEquipment(null)}
          onEditEquipment={handleEditEquipmentItem}
          onDeleteEquipment={handleDeleteEquipmentItem}
        />
      )}
    </List>
  );
};
