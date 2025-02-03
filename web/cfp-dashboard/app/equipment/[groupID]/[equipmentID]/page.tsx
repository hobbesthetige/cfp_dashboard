"use client";
import { Equipment } from "@/app/types/equipment";
import useAxios from "@/contexts/useAxios";
import { NavigateNext } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EquipmentJCNList from "./jcnList";
import EquipmentPropertiesList from "./propertiesList";

const BreadcrumbsComponent: React.FC<{ groupID: string }> = ({ groupID }) => {
  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link
        underline="hover"
        color="inherit"
        sx={{ display: "flex", alignItems: "center" }}
        href="/"
      >
        Dashboard
      </Link>
      <Link
        underline="hover"
        color="inherit"
        sx={{ display: "flex", alignItems: "center" }}
        href={`/equipment`}
      >
        Equipment
      </Link>
      <Link
        underline="hover"
        color="inherit"
        sx={{ display: "flex", alignItems: "center" }}
        href={`/equipment/${groupID}`}
      >
        Equipment Group
      </Link>
      <Typography
        sx={{ display: "flex", alignItems: "center" }}
        color="text.primary"
      >
        Edit Equipment Item
      </Typography>
    </Breadcrumbs>
  );
};

interface EquipmentComponentProps {
  params: {
    groupID: string;
    equipmentID: string;
  };
}

const EquipmentComponent: React.FC<EquipmentComponentProps> = ({ params }) => {
  const axios = useAxios();
  const router = useRouter();
  const { groupID, equipmentID } = params;
  const [equipment, setEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    const endpoint = `/equipmentGroups/${groupID}/equipment/${equipmentID}`;
    axios.get(endpoint).then((response) => {
      setEquipment(response.data);
    });
  }, [axios]);

  const handleSave = (e: Equipment) => {
    axios
      .put(`/equipmentGroups/${groupID}/equipment/${e.id}`, e)
      .then((response) => {
        setEquipment(response.data);
      });
  };

  const navigateBack = () => {
    router.push(`/equipment/${groupID}`);
  };

  const handleDelete = () => {
    axios.delete(`/equipmentGroups/${groupID}/equipment/${equipmentID}`);
    router.push(`/equipment/${groupID}`);
  };

  return (
    <Box>
      <BreadcrumbsComponent groupID={groupID} />
      {equipment && (
        <Container maxWidth="md">
          <Stack spacing={2}>
            <EquipmentPropertiesList
              groupID={groupID}
              equipment={equipment}
              handleSave={() => {
                handleSave(equipment);
                navigateBack();
              }}
              handleDelete={handleDelete}
            />
            <EquipmentJCNList equipment={equipment} handleSave={handleSave} />
          </Stack>
        </Container>
      )}
    </Box>
  );
};

export default EquipmentComponent;
