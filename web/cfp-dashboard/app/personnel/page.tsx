"use client";
import React, { useEffect } from "react";
import PersonnelList from "@/components/personnel/personnelList";
import withAuth from "@/components/withAuth";
import { useTitle } from "@/contexts/titleProvider";

const Page = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Personnel");
  }, []);
  return (
    <div>
      <PersonnelList />
    </div>
  );
};

export default withAuth(Page);
