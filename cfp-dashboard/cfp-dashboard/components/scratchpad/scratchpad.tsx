import React, { use, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useSocket } from "@/contexts/socketContext";
import Markdown from "react-markdown";

interface Scratchpad {
  defaultDashboard: string;
}

const Scratchpad: React.FC = () => {
  const [editing, setEditing] = React.useState(false);
  const [scratchpad, setScratchpad] = React.useState<Scratchpad>();
  const [text, setText] = React.useState("");
  const { socket, isConnected } = useSocket();
  const namespace = "scratchpad";

  const toggleEditing = (shouldSave: boolean) => {
    if (editing && shouldSave) {
      handleSave();
    }
    setEditing(!editing);
  };

  useEffect(() => {
    setText(scratchpad?.defaultDashboard || "");
  }, [scratchpad]);

  const handleScratchPad = useCallback((scratchpad: Scratchpad) => {
    setScratchpad(scratchpad);
  }, []);

  const handleSave = () => {
    const newScratchpad = { ...scratchpad, defaultDashboard: text };
    socket?.emit(namespace, newScratchpad);
    setEditing(false);
  };

  const reset = () => {
    setText(scratchpad?.defaultDashboard || "");
    setEditing(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on(namespace, handleScratchPad);
      return () => {
        socket.off(namespace, handleScratchPad);
      };
    }
  }, [socket, isConnected, handleScratchPad]);

  return (
    <Box sx={{ flex: 1 }}>
      <Stack
        direction="row"
        alignItems="trailing"
        justifyContent="space-between"
      >
        <Typography variant="h6">Scratchpad</Typography>
        <IconButton onClick={() => toggleEditing(true)}>
          <Edit />
        </IconButton>
      </Stack>
      <Box sx={{ mt: 0, ml: 0, mr: 2, mb: 4, flexGrow: 1 }}>
        {editing ? (
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <Button onClick={reset}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Paper sx={{ p: 2 }}>
              {!text ? (
                <Typography variant="body2" color="textSecondary">
                  Use the scratchpad to jot down notes or reminders.
                </Typography>
              ) : (
                <div className="markdown">
                  <Markdown>{text}</Markdown>
                </div>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Scratchpad;
