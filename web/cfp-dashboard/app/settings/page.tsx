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
import DataSettingsComponent from "../data-management/components/dataSettingsComponent";

const SettingsPage: React.FC = () => {
  const { setTitle } = useTitle();
  const router = useRouter();

  useEffect(() => {
    setTitle("Settings");
  }, []);

  return (
    <Box>
      <BreadcrumbsComponent />
      <Typography variant="h4">Settings</Typography>
      <Container maxWidth={"md"} sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <Typography>Nothing here.... yet</Typography>
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
        Settings
      </Typography>
    </Breadcrumbs>
  );
};

export default withAuth(SettingsPage);
