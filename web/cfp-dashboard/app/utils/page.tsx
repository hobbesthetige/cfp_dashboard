"use client";
import { useRouter } from "next/navigation";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useTitle } from "@/contexts/titleProvider";
import { useEffect } from "react";
import withAuth from "@/components/withAuth";
import JulianContainerComponent from "./components/julianDateComponent";
import { NavigateNext } from "@mui/icons-material";
import AnsibleComponent from "./components/ansibleComponent";

const UtilitiesPage: React.FC = () => {
  const { setTitle } = useTitle();
  const router = useRouter();

  useEffect(() => {
    setTitle("Utilities");
  }, []);

  return (
    <Box>
      <BreadcrumbsComponent />
      <Typography variant="h4">Utilities</Typography>
      <Container maxWidth={"md"} sx={{ mt: 2 }}>
        <Stack spacing={4}>
          <JulianContainerComponent />
          <AnsibleComponent />
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
        Utilities
      </Typography>
    </Breadcrumbs>
  );
};

export default withAuth(UtilitiesPage);
