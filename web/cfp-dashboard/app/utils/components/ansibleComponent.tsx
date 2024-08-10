import useAxios from "@/contexts/useAxios";
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { axiosAnsibleInstance } from "@/contexts/axios";
import {
  AddOutlined,
  Backup,
  Check,
  Delete,
  Edit,
  Error,
  Router,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import loading from "@/components/loading";

interface SystemHealthCheck {
  responses: SystemHealth[];
  errors: string[];
}

interface SystemHealth {
  host: string;
  port: number;
  status: string;
}

const AnsibleComponent: React.FC = () => {
  const SystemHealthCheck: React.FC = () => {
    const [systemHealth, setSystemHealth] = useState<SystemHealthCheck>();
    const [lastUpdated, setLastUpdated] = useState<Date>();
    const [loading, setLoading] = useState(false);

    const checkSystemHealth = useCallback(async () => {
      setLoading(true);
      try {
        const response = await axiosAnsibleInstance.get<SystemHealthCheck>(
          "/healthCheck"
        );
        setSystemHealth(response.data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(error);
        setSystemHealth(undefined);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      checkSystemHealth();
    }, [checkSystemHealth]);

    return (
      <Stack spacing={2}>
        <Typography variant="h6">System Health Check</Typography>
        {loading && <LinearProgress />}
        {systemHealth && !loading && (
          <Box>
            {systemHealth?.errors.map((error, index) => (
              <Stack key={index} spacing={1}>
                <Typography>{error}</Typography>
              </Stack>
            ))}
            {systemHealth?.responses && (
              <Stack spacing={2}>
                {systemHealth?.responses
                  .sort((a, b) => a.host.localeCompare(b.host)) // Sort responses by host
                  .map((response, index) => (
                    <React.Fragment key={index}>
                      {response.status === "open" && (
                        <Alert
                          icon={<Check fontSize="inherit" />}
                          severity="success"
                        >
                          {response.host}:{response.port} is up and running.
                        </Alert>
                      )}
                      {response.status === "closed" && (
                        <Alert
                          icon={<Error fontSize="inherit" />}
                          severity="error"
                        >
                          {response.host}:{response.port} is down.
                        </Alert>
                      )}
                    </React.Fragment>
                  ))}
              </Stack>
            )}
          </Box>
        )}
        <Typography variant="caption">
          Last updated: {lastUpdated?.toLocaleString() ?? "Never"}
        </Typography>
        <Button onClick={checkSystemHealth} disabled={loading}>
          Check System Health
        </Button>
      </Stack>
    );
  };

  const BackupConfigs: React.FC = () => {
    interface BackupDevice {
      ipaddress: string;
      devicetype: "cisco" | "other";
      username: string;
      password: string;
    }

    const defaultusername = "tdcadmin";
    const defaultPassword = "1qa2ws#ED$RF%TG";

    const backupDevice: BackupDevice = {
      ipaddress: "8.8.8.8",
      devicetype: "cisco",
      username: defaultusername,
      password: defaultPassword,
    };

    const [backupDevices, setBackupDevices] = useState<BackupDevice[]>([
      backupDevice,
    ]);

    const addBackupDevice = () => {
      setBackupDevices([...backupDevices, backupDevice]);
      axios.post("/backupDevice", backupDevice);
    };

    const removeBackupDevice = (index: number) => {
      const newBackupDevices = [...backupDevices];
      newBackupDevices.splice(index, 1);
      setBackupDevices(newBackupDevices);
      axios.delete(`/backupDevice/${index}`);
    };

    const updateBackupDevice = (index: number) => {
      return (device: BackupDevice) => {
        const newBackupDevices = [...backupDevices];
        newBackupDevices[index] = device;
        setBackupDevices(newBackupDevices);
      };
    };

    const [openDialog, setOpenDialog] = useState(false);

    const axios = useAxios();

    useEffect(() => {
      const fetchBackupDevices = async () => {
        try {
          const response = await axios.get<BackupDevice[]>("/backupDevices");
          setBackupDevices(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchBackupDevices();
    }, [axios]);

    const AddDeviceDialog: React.FC<{
      open: boolean;
      onClose: () => void;
      onAdd: (device: BackupDevice) => void;
    }> = ({ open, onClose, onAdd }) => {
      const [editedDevice, setEditedDevice] =
        useState<BackupDevice>(backupDevice);

      const handleFormUpdate = (device: BackupDevice) => {
        setEditedDevice(device);
      };

      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Backup Device</DialogTitle>
          <DialogContent>
            <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
              <TextField
                label="IP Address"
                value={editedDevice.ipaddress}
                onChange={(e) =>
                  handleFormUpdate({
                    ...editedDevice,
                    ipaddress: e.target.value,
                  })
                }
              />
              <TextField
                label="Username"
                value={editedDevice.username}
                onChange={(e) =>
                  handleFormUpdate({
                    ...editedDevice,
                    username: e.target.value,
                  })
                }
              />
              <TextField
                label="Password"
                type="password"
                value={editedDevice.password}
                onChange={(e) =>
                  handleFormUpdate({
                    ...editedDevice,
                    password: e.target.value,
                  })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => onAdd(editedDevice)}>Add</Button>
          </DialogActions>
        </Dialog>
      );
    };

    const BackupDeviceItem: React.FC<{
      device: BackupDevice;
      onUpdate: (device: BackupDevice) => void;
      onDelete: () => void;
    }> = ({ device, onDelete, onUpdate }) => {
      const [editedDevice, setEditedDevice] = useState<BackupDevice>(device);
      const [openDialog, setOpenDialog] = useState(false);
      const [showPassword, setShowPassword] = useState(false);

      const handleFormUpdate = (device: BackupDevice) => {
        setEditedDevice(device);
      };

      const saveChanges = () => {
        handleCloseDialog();
        onUpdate(editedDevice);
      };

      const handleOpenDialog = () => {
        setEditedDevice(device);
        setOpenDialog(true);
      };

      const handleCloseDialog = () => {
        setOpenDialog(false);
      };

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

      return (
        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack
            spacing={3}
            direction="row"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            {device.devicetype === "cisco" && (
              <Router fontSize="large" color="primary" />
            )}
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{device.ipaddress}</Typography>
              <Typography>Device Type: {device.devicetype}</Typography>
              <Typography>
                Username: {device.username.substring(0, 2)}••••
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <IconButton onClick={handleOpenDialog}>
                <Edit />
              </IconButton>
              <IconButton onClick={onDelete}>
                <Delete />
              </IconButton>
            </Stack>
          </Stack>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Backup Device</DialogTitle>
            <DialogContent>
              <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
                <TextField
                  label="IP Address"
                  value={editedDevice.ipaddress}
                  onChange={(e) =>
                    handleFormUpdate({
                      ...editedDevice,
                      ipaddress: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Username"
                  value={editedDevice.username}
                  onChange={(e) =>
                    handleFormUpdate({
                      ...editedDevice,
                      username: e.target.value,
                    })
                  }
                />
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={editedDevice.password}
                    onChange={(e) =>
                      handleFormUpdate({
                        ...editedDevice,
                        password: e.target.value,
                      })
                    }
                  />
                  <IconButton size="small" onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={saveChanges}>Save</Button>
            </DialogActions>
          </Dialog>
        </Card>
      );
    };

    return (
      <Stack spacing={2}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Backup Configs
          </Typography>
          <IconButton onClick={() => setOpenDialog(true)}>
            <AddOutlined />
          </IconButton>
        </Stack>
        {backupDevices.map((device, index) => (
          <BackupDeviceItem
            key={index}
            device={device}
            onDelete={() => removeBackupDevice(index)}
            onUpdate={updateBackupDevice(index)}
          />
        ))}
        <Button>Backup Now</Button>
        <AddDeviceDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onAdd={addBackupDevice}
        />
      </Stack>
    );
  };

  const AnsibleComponent: React.FC = () => {
    return (
      <Card sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Ansible</Typography>
          <Typography>
            Ansible is a simple IT automation tool that automates cloud
            provisioning, configuration management, application deployment,
            intra-service orchestration, and many other IT needs.
          </Typography>
          <Divider />
          <SystemHealthCheck />
          <Divider />
          <BackupConfigs />
        </Stack>
      </Card>
    );
  };

  return <AnsibleComponent />;
};

export default AnsibleComponent;
