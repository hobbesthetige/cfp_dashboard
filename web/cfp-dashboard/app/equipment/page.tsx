"use client";
import EquipmentList from "@/components/equipment/equipmentList";
import withAuth from "@/components/withAuth";
import { Link, Box, Toolbar, Typography, Breadcrumbs } from "@mui/material";
import { useTitle } from "@/contexts/titleProvider";
import { useEffect } from "react";
import { NavigateNext } from "@mui/icons-material";

const MyComponent: React.FC = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Equipment");
  }, []);

  return (
    <Box>
      <BreadcrumbsComponent />
      <EquipmentList />
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

export default withAuth(MyComponent);
