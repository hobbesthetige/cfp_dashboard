import { Equipment, EquipmentGroup } from "@/app/types/equipment";
import useAxios from "@/contexts/useAxios";
import { Add } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface EquipmentListProps {
  equipmentGroup: EquipmentGroup;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipmentGroup }) => {
  const router = useRouter();
  const axios = useAxios();

  const [equipmentItems, setEquipmentItems] = useState<Equipment[]>([]);

  useEffect(() => {
    const endpoint = `/equipmentGroups/${equipmentGroup.id}/equipment`;
    axios.get(endpoint).then((response) => {
      setEquipmentItems(response.data);
    });
  }, [axios, equipmentGroup]);

  return (
    <Stack spacing={2}>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="h5">Equipment</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={() =>
            router.push(`/equipment/${equipmentGroup.id}/addEquipmentItem`)
          }
        >
          <Add />
        </IconButton>
      </Stack>
      {equipmentItems.length === 0 && (
        <Typography>No equipment items.</Typography>
      )}
      <List>
        {equipmentItems.map((equipment) => (
          <Stack>
            <ListItemButton
              key={equipment.id}
              onClick={() =>
                router.push(`/equipment/${equipmentGroup.id}/${equipment.id}`)
              }
            >
              <ListItemText primary={equipment.name} />
            </ListItemButton>
            {equipmentItems.length - 1 !==
              equipmentItems.indexOf(equipment) && <Divider />}
          </Stack>
        ))}
      </List>
    </Stack>
  );
};

export default EquipmentList;
