import { Equipment, JobControlNumber } from "@/app/types/equipment";
import { EventLogLevel } from "@/components/events/eventsList";
import { useEventsSocket } from "@/contexts/eventsSocketContext";
import { CancelOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddJCNDialog from "./addJCNDialog";

interface EquipmentJCNListProps {
  equipment: Equipment;
  handleSave: (e: Equipment) => void;
}

const makeTimestampString = (createdAt: string) => {
  const localDate = new Date(createdAt).toLocaleString();
  const zuluTime = new Date(createdAt).toISOString().slice(11, 16) + " Zulu";

  const combinedText = `${localDate} | ${zuluTime}`;
  return combinedText;
};

const EquipmentJCNList: React.FC<EquipmentJCNListProps> = ({
  equipment,
  handleSave,
}) => {
  const { eventsSocket } = useEventsSocket();

  const emitNewEventItem = (jcn: JobControlNumber) => {
    eventsSocket?.emit("newEventItem", {
      id: uuidv4(),
      level: EventLogLevel.Info,
      category: "CFP",
      title: `JCN added`,
      message: `* JCN: ${jcn.number}
* Type: ${jcn.type}
* Equipment: ${equipment.name}
* Department: ${equipment.department}
`,
      author: "System",
      isUserGenerated: false,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Card sx={{ p: 4, mt: 4 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">JCNs</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <AddJCNDialog
            groupID={equipment.groupID}
            handleAdd={(jcn) => {
              equipment.jobControlNumbers.push(jcn);
              emitNewEventItem(jcn);
              handleSave(equipment);
            }}
          />
        </Stack>
        {equipment.jobControlNumbers.length === 0 && (
          <Typography variant="body1">
            No JCNs have been recorded yet.
          </Typography>
        )}
        <List>
          {equipment.jobControlNumbers.map((jcn) => (
            <ListItem disablePadding key={jcn.timestamp} sx={{ width: "100%" }}>
              <Stack sx={{ width: "100%" }}>
                <Stack
                  direction="row"
                  alignItems={"center"}
                  sx={{ width: "100%" }}
                >
                  <ListItemText
                    primary={`${jcn.type} #${jcn.number}`}
                    secondary={`Recorded on ${makeTimestampString(
                      jcn.timestamp
                    )}`}
                  />
                  <Box sx={{ flexGrow: 1 }} />
                  <DeleteConfirmationDialog
                    handleDelete={() => {
                      equipment.jobControlNumbers =
                        equipment.jobControlNumbers.filter(
                          (j) => j.id !== jcn.id
                        );
                      handleSave(equipment);
                    }}
                  />
                </Stack>
                {equipment.jobControlNumbers.indexOf(jcn) !==
                  equipment.jobControlNumbers.length - 1 && <Divider />}
              </Stack>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Card>
  );
};

const DeleteConfirmationDialog: React.FC<{ handleDelete: () => void }> = ({
  handleDelete,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <CancelOutlined />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Are you sure you want to delete this Job Control Number?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleDelete();
              handleClose();
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentJCNList;
