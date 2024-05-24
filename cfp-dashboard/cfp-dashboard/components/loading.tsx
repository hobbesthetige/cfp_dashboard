import React from "react";
import { CircularProgress } from "@mui/material";

const FullscreenLoading: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  );
};

const InlineLoading: React.FC = () => {
  return (
    <div
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export { FullscreenLoading, InlineLoading };

export default FullscreenLoading;
