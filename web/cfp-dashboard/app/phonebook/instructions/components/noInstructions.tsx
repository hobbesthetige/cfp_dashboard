import { Phone } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";

const NoInstrutionsComponent: React.FC<{ handleAddClick: () => void }> = ({
  handleAddClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: 2,
      }}
    >
      <Phone sx={{ fontSize: 80, marginBottom: 2 }} color="primary" />
      <Typography variant="h5" component="h1" gutterBottom>
        No dialing instructions
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Add dialing instructions to provide users support when calling between
        DSN, commercial, and XComm numbers.
      </Typography>
      <Button onClick={handleAddClick}>Add Instruction Set</Button>
    </Box>
  );
};

export default NoInstrutionsComponent;
