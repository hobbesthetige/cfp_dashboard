"use client";
import React, { useEffect } from "react";
import PersonnelList from "@/components/personnel/personnelList";
import withAuth from "@/components/withAuth";
import { useTitle } from "@/contexts/titleProvider";
import { NavigateNext } from "@mui/icons-material";
import { Link, Breadcrumbs, Typography } from "@mui/material";

const Page = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Personnel");
  }, []);
  return (
    <div>
      <BreadcrumbsComponent />
      <PersonnelList />
    </div>
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
        Personnel
      </Typography>
    </Breadcrumbs>
  );
};

export default withAuth(Page);
