import React, { useEffect, useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";
import EditEquipmentGroupDialog from "./equipmentGroup/editEquipmentGroupDialog";
import AddEquipmentItemDialog from "./equipmentLineItem/addEquipmentItemDialog";
import {
  Equipment,
  EquipmentGroup,
  JobControlNumber,
} from "@/app/types/equipment";
import EditEquipmentItemDialog from "./equipmentLineItem/editEquipmentItemDialog";
import { ListOfEquipment } from "./equipmentItemRow";

interface EquipmentGroupRowProps {
  row: EquipmentGroup;
  open: boolean;
  onToggle: () => void;
  handleEditEquipmentGroup: (equipmentGroup: EquipmentGroup) => void;
  handleDeleteEquipmentGroup: (equipmentGroup: EquipmentGroup) => void;
  handleAddEquipmentItem: (equipment: Equipment, group: EquipmentGroup) => void;
  handleEditEquipmentItem: (
    equipment: Equipment,
    group: EquipmentGroup
  ) => void;
  handleDeleteEquipmentItem: (
    equipment: Equipment,
    group: EquipmentGroup
  ) => void;
}

function EmptyEquipment() {
  return (
    <Box textAlign="center" sx={{ m: 2 }}>
      <Typography component="div">No equipment added</Typography>
    </Box>
  );
}

const EquipmentGroupRow: React.FC<EquipmentGroupRowProps> = ({
  row,
  open,
  onToggle,
  handleEditEquipmentGroup,
  handleDeleteEquipmentGroup,
  handleAddEquipmentItem,
  handleEditEquipmentItem,
  handleDeleteEquipmentItem,
}) => {
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (addItemDialog && !open) {
      onToggle();
    }
  }, [addItemDialog, open, onToggle]);

  return (
    <React.Fragment>
      <EditEquipmentGroupDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEditEquipmentGroup}
        onDelete={handleDeleteEquipmentGroup}
        group={row}
      />
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell width={1}>
          <IconButton aria-label="expand row" size="small" onClick={onToggle}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <ListItemText
            primaryTypographyProps={{
              fontSize: 20,
              fontWeight: "medium",
              color: "primary",
              letterSpacing: 0,
            }}
            primary={row.name}
            secondary={`UTC:${row.utc} - ${row.jobControlNumbers
              .map((job: JobControlNumber) => `${job.type} JCN #${job.number}`)
              .join(", ")}`}
          />
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" onClick={() => setEditOpen(true)}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={() => setAddItemDialog(true)}>
            <Add />
          </IconButton>
        </TableCell>
        <AddEquipmentItemDialog
          group={row}
          open={addItemDialog}
          onAddEquipment={handleAddEquipmentItem}
          onClose={() => setAddItemDialog(false)}
        />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              {row.equipment.length > 0 ? (
                <ListOfEquipment
                  group={row}
                  handleEditEquipmentItem={handleEditEquipmentItem}
                  handleDeleteEquipmentItem={handleDeleteEquipmentItem}
                />
              ) : (
                <EmptyEquipment />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default EquipmentGroupRow;
