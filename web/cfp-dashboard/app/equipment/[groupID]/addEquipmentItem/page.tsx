"use client";
import { Equipment, makeEquipment } from "@/app/types/equipment";
import useAxios from "@/contexts/useAxios";
import { NavigateNext } from "@mui/icons-material";
import { Link, Breadcrumbs, Typography, Box, Container } from "@mui/material";
import { useState } from "react";
import EquipmentPropertiesList from "../[equipmentID]/propertiesList";
import { useRouter } from "next/navigation";

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
        Add Equipment Item
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

const AddEquipmentItemComponent: React.FC<EquipmentComponentProps> = ({
  params,
}) => {
  const axios = useAxios();
  const router = useRouter();

  const { groupID } = params;
  const [equipment, setEquipment] = useState<Equipment>(makeEquipment(groupID));

  const handleSave = async (e: Equipment) => {
    e.groupID = groupID;
    const endpoint = `/equipmentGroups/equipment`;
    await axios.post(endpoint, e);
    router.push(`/equipment/${groupID}`);
  };

  return (
    <Box>
      <BreadcrumbsComponent groupID={groupID} />
      {equipment && (
        <Container maxWidth="md">
          <EquipmentPropertiesList
            groupID={groupID}
            equipment={equipment}
            handleSave={handleSave}
          />
        </Container>
      )}
    </Box>
  );
};

export default AddEquipmentItemComponent;
