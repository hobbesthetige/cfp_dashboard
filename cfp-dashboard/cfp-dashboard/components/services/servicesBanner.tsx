import React, { use, useCallback, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Stack,
  Divider,
  List,
  Paper,
} from "@mui/material";
import useAxios from "@/contexts/useAxios";
import EditServicesBanner from "./editServicesBanner";
import { EquipmentGroup } from "@/app/types/equipment";
import ServiceStatusIndicator from "./serviceStatusIndicator";
import { SocketProvider, useSocket } from "@/contexts/socketContext";

interface ServicesBannerProps {
  // Add your prop types here
}

const Enclave: React.FC<{ enclave: string }> = ({ enclave }) => {
  return <Typography>{enclave}</Typography>;
};

const ServicesBanner: React.FC<ServicesBannerProps> = (props) => {
  const [groups, setGroups] = useState<EquipmentGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<EquipmentGroup[]>([]);
  const { isConnected, socket } = useSocket();
  const namespace = "equipmentGroups";

  const handleEquipmentGroupsUpdated = useCallback(
    (groups: EquipmentGroup[]) => {
      console.log("Received updated equipment groups:", groups);
      const nonEmptyGroups = groups.filter(
        (group) => group.services.length > 0
      );
      const filteredGroups = nonEmptyGroups
        .map((group) => ({
          ...group,
          services: group.services.filter((service) => service.isVisible),
        }))
        .filter((group) => group.services.length > 0);
      console.log("Filtered equipment groups:", filteredGroups);
      setGroups(nonEmptyGroups);
      setFilteredGroups(filteredGroups);
    },
    []
  );

  useEffect(() => {
    if (socket) {
      socket.on(namespace, handleEquipmentGroupsUpdated);
      return () => {
        socket.off(namespace, handleEquipmentGroupsUpdated);
      };
    }
  }, [socket, isConnected, handleEquipmentGroupsUpdated]);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="trailing"
        justifyContent="space-between"
      >
        <Typography variant="h6">Services</Typography>
        <EditServicesBanner groups={groups} onUpdate={() => {}} />
      </Stack>
      <Box sx={{ mt: 4, ml: 0, mr: 2, mb: 4 }}>
        <SocketProvider namespace="pingPong">
          <Grid container columnSpacing={2}>
            {filteredGroups.map((group) => (
              <Grid item key={group.id} xs={6}>
                <Paper>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">{group.name}</Typography>
                    <List>
                      {group.services.map((service, index) => (
                        <React.Fragment key={service.id}>
                          <ServiceStatusIndicator
                            group={group}
                            service={service}
                          />
                          {index !== group.services.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </SocketProvider>
      </Box>
    </Box>
  );
};

export default ServicesBanner;
