"use client";
import { EquipmentGroup } from "@/app/types/equipment";
import withAuth from "@/components/withAuth";
import { useTitle } from "@/contexts/titleProvider";
import useAxios from "@/contexts/useAxios";
import { NavigateNext } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Card,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import DeleteList from "./components/deleteList";
import EquipmentList from "./components/equipmentList";
import PropertiesList from "./components/propertiesList";
import ServicesList from "./components/servicesList";

const BreadcrumbsComponent: React.FC = () => {
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
        href="/equipment"
      >
        Equipment
      </Link>
      <Typography
        sx={{ display: "flex", alignItems: "center" }}
        color="text.primary"
      >
        Equipment Group
      </Typography>
    </Breadcrumbs>
  );
};

interface EquipmentGroupListProps {
  equipmentGroup: EquipmentGroup;
}
const EquipmentGroupList: React.FC<EquipmentGroupListProps> = ({
  equipmentGroup,
}) => {
  const [editingEquipmentGroup, setEditingEquipmentGroup] =
    useState<EquipmentGroup>(equipmentGroup);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingEquipmentGroup((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
    setHasChanges(true);
  };

  const handleUpdate = (e: EquipmentGroup) => {
    setEditingEquipmentGroup(e);
    setHasChanges(true);
  };

  const handleDelete = (e: EquipmentGroup) => {
    axios.delete(`equipmentGroups/${e.id}`);
    router.back();
  };

  const axios = useAxios();

  useEffect(() => {
    if (hasChanges) {
      axios.put(`equipmentGroups/${editingEquipmentGroup.id}`, {
        ...editingEquipmentGroup,
      });
      setHasChanges(false);
    }
  }, [axios, hasChanges, editingEquipmentGroup]);

  return (
    <Box>
      <Container maxWidth={"md"}>
        <Card sx={{ p: 4, mt: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h5">Equipment</Typography>
            <PropertiesList
              equipmentGroup={editingEquipmentGroup}
              setEditingEquipmentGroup={handleUpdate}
              handleInputChange={handleInputChange}
            />
            <Divider />
            <ServicesList
              equipmentGroup={editingEquipmentGroup}
              setEditingEquipmentGroup={handleUpdate}
            />
            <Divider />
            <EquipmentList equipmentGroup={editingEquipmentGroup} />
            <Divider />
            <DeleteList
              handleDelete={() => handleDelete(editingEquipmentGroup)}
            />
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export interface EquipmentPageProps {
  params: {
    groupID: string;
  };
}

const EquipmentGroupComponent: FC<EquipmentPageProps> = ({ params }) => {
  const { groupID } = params;
  const { setTitle } = useTitle();
  const axios = useAxios();
  const [equipmentGroup, setEquipmentGroup] = useState<EquipmentGroup | null>(
    null
  );
  useEffect(() => {
    let endpoint = `equipmentGroups/${encodeURIComponent(groupID)}`;
    axios.get(endpoint).then((response) => {
      setEquipmentGroup(response.data);
    });
  }, [axios, groupID]);

  useEffect(() => {
    setTitle("Equipment Group");
  }, [setTitle]);

  if (!equipmentGroup) {
    return <Typography>Equipment Group not found</Typography>;
  }

  return (
    <Box>
      <BreadcrumbsComponent />
      <EquipmentGroupList equipmentGroup={equipmentGroup} />
    </Box>
  );
};

export default withAuth(EquipmentGroupComponent);
