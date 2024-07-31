"use client";
import EquipmentList from "@/components/equipment/equipmentList";
import withAuth from "@/components/withAuth";
import { Box, Toolbar, Typography } from "@mui/material";
import { useTitle } from "@/contexts/titleProvider";
import { useEffect } from "react";

const MyComponent: React.FC = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Equipment");
  }, []);

  return (
    <Box>
      <EquipmentList />
    </Box>
  );
};

export default withAuth(MyComponent);
