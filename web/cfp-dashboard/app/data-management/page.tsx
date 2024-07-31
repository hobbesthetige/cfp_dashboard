"use client";
import { useRouter } from "next/navigation";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import withAuth from "@/components/withAuth";
import { useTitle } from "@/contexts/titleProvider";
import { useEffect, useState } from "react";
import { NavigateNext } from "@mui/icons-material";
import useAxios from "@/contexts/useAxios";
import DataSettingsComponent from "./components/dataSettingsComponent";
import MSLComponent from "./components/mslComponent";

const DataManagementPage: React.FC = () => {
  const { setTitle } = useTitle();
  const router = useRouter();

  useEffect(() => {
    setTitle("Data Management");
  }, []);

  return (
    <Box>
      <BreadcrumbsComponent />
      <Typography variant="h4">Data Management</Typography>
      <Container maxWidth={"md"} sx={{ mt: 2 }}>
        <Stack spacing={4}>
          <DataSettingsComponent />
          <MSLComponent />
        </Stack>
      </Container>
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
        Data Management
      </Typography>
    </Breadcrumbs>
  );
};

export default withAuth(DataManagementPage);
