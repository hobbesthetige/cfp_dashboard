"use client";
import EquipmentList from "@/components/equipment/equipmentList";
import withAuth from "@/components/withAuth";
import { Box, Toolbar, Typography } from "@mui/material";

const MyComponent: React.FC = () => {
  return (
    <Box>
      <EquipmentList />
    </Box>
  );
};

export default withAuth(MyComponent);
