"use client";
import withAuth from "@/components/withAuth";
import { useTitle } from "@/contexts/titleProvider";
import useAxios from "@/contexts/useAxios";
import { Add, Inventory2, Label, NavigateNext } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Card,
  Container,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Equipment,
  EquipmentGroup,
  EquipmentGroupWithItems,
  makeEquipment,
  makeEquipmentGroup,
  makeEquipmentServiceWithName,
} from "../types/equipment";
import AddEquipmentGroupDialog from "./addEquipmentGroupDialog";

const MyComponent: React.FC = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Equipment");
  }, []);

  return (
    <Box>
      <BreadcrumbsComponent />
      <EquipmentGroupList />
    </Box>
  );
};

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
      <Typography
        sx={{ display: "flex", alignItems: "center" }}
        color="text.primary"
      >
        Equipment
      </Typography>
    </Breadcrumbs>
  );
};

const EquipmentGroupList: React.FC = () => {
  const axios = useAxios();
  const router = useRouter();

  const [equipmentGroups, setEquipmentGroups] = useState<
    EquipmentGroupWithItems[]
  >([]);

  const [allEquipmentItems, setAllEquipmentItems] = useState<Equipment[]>([]);

  const [openAddEquipmentGroup, setOpenAddEquipmentGroup] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const refreshEquipmentGroups = () => {
    const endpoint = "equipmentGroups";
    const query = { includeItems: true };
    axios.get(endpoint, { params: query }).then((response) => {
      setEquipmentGroups(response.data);
    });
    axios.get("equipmentGroups/equipment").then((response) => {
      setAllEquipmentItems(response.data);
      console.log(response.data);
    });
  };

  useEffect(() => {
    refreshEquipmentGroups();
  }, [axios]);

  const handlePath = (path: string) => {
    router.push(path);
  };

  const handleAddEquipmentGroup = async (equipmentGroup: EquipmentGroup) => {
    await axios.post("equipmentGroups", equipmentGroup).then(() => {
      refreshEquipmentGroups();
    });
    setOpenAddEquipmentGroup(false);
  };

  const handleAddEquipmentItem = async (equipment: Equipment) => {
    await axios.post("equipmentGroups/equipment", equipment).then(() => {
      refreshEquipmentGroups();
    });
  };

  const handleAddSCPEquipmentGroup = () => {
    const equipmentGroup = makeEquipmentGroup();
    equipmentGroup.name = "SCP";
    equipmentGroup.utc = "6KTFS";
    equipmentGroup.services = [
      makeEquipmentServiceWithName("Data", "NIPR"),
      makeEquipmentServiceWithName("Voice", "NIPR"),
      makeEquipmentServiceWithName("Data", "SIPR"),
      makeEquipmentServiceWithName("Voice", "SIPR"),
    ];
    handleAddEquipmentGroup(equipmentGroup);
    handleClose();
  };

  const handleAddCFKEquipmentGroup = async () => {
    const equipmentGroup = makeEquipmentGroup();
    equipmentGroup.name = "CFK";
    equipmentGroup.utc = "6KTGB";
    equipmentGroup.services = [
      makeEquipmentServiceWithName("Data", "NIPR"),
      makeEquipmentServiceWithName("Voice", "NIPR"),
      makeEquipmentServiceWithName("Data", "SIPR"),
      makeEquipmentServiceWithName("Voice", "SIPR"),
    ];
    await Promise.all([
      handleAddEquipmentGroup(equipmentGroup),
      addNetworkingStack(equipmentGroup.id, "NIPR Stack"),
      addNetworkingStack(equipmentGroup.id, "SIPR Stack"),
      addNetworkingStack(equipmentGroup.id, "Transport Stack", "123456"),
    ]);

    handleClose();
    router.push(`/equipment/${equipmentGroup.id}`);
  };

  const addNetworkingStack = async (
    groupID: string,
    name: string,
    serialNumber?: string
  ) => {
    const niprStack = makeEquipment(groupID);
    niprStack.name = name;
    niprStack.quantity = 1;
    niprStack.serialNumber = serialNumber || "";
    niprStack.category = "Networking Equipment";
    niprStack.department = "Infrastructure";
    await handleAddEquipmentItem(niprStack);
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="trailing"
        justifyContent="space-between"
      >
        <Typography variant="h4" component="div">
          Equipment Groups
        </Typography>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={handleAddClick}>
            <Add />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            onClick={handleClose}
          >
            <MenuItem onClick={handleAddSCPEquipmentGroup}>
              SCP (UTC: 6KTFS)
            </MenuItem>
            <MenuItem onClick={handleAddCFKEquipmentGroup}>
              CFK (UTC: 6KTGB)
            </MenuItem>
            <MenuItem onClick={() => setOpenAddEquipmentGroup(true)}>
              Custom Group
            </MenuItem>
          </Menu>
          <AddEquipmentGroupDialog
            open={openAddEquipmentGroup}
            handleClose={() => setOpenAddEquipmentGroup(false)}
            handleAdd={(e: EquipmentGroup) => {
              handleAddEquipmentGroup(e);
              handlePath(`/equipment/${e.id}`);
            }}
          />
        </Stack>
      </Stack>
      <Stack>
        {equipmentGroups.length === 0 && <EmptyEquipmentCard />}
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
        >
          {equipmentGroups.map((group) => (
            <Container key={group.id}>
              <ListItemButton
                onClick={() => handlePath(`/equipment/${group.id}`)}
              >
                <ListItemIcon>
                  <Inventory2 />
                </ListItemIcon>
                <ListItemText
                  primary={group.name}
                  secondary={`UTC: ${group.utc}`}
                />
              </ListItemButton>
              <List component="div" disablePadding>
                {group.equipment.map((equipment) => (
                  <ListItemButton
                    key={equipment.id}
                    sx={{ pl: 4 }}
                    onClick={() =>
                      handlePath(`/equipment/${group.id}/${equipment.id}`)
                    }
                  >
                    <ListItemIcon>
                      <Label />
                    </ListItemIcon>
                    <ListItemText
                      primary={equipment.name}
                      secondary={
                        equipment.serialNumber.length > 0
                          ? `Serial #: ${equipment.serialNumber}`
                          : ""
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Container>
          ))}
        </List>
      </Stack>
    </Box>
  );
};

const EmptyEquipmentCard: React.FC<{}> = ({}) => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ p: 4 }}>
        <Stack spacing={2}>
          {/* <Typography variant="h5">Equipment</Typography> */}
          <Typography variant="body1">
            No equipment groups have been added yet.
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
};

export default withAuth(MyComponent);
