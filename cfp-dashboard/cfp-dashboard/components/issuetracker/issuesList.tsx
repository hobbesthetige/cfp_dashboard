import React, { use, useEffect, useState } from "react";
import { Issue, IssueNote } from "../../app/types/issue";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Chip,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSocket } from "@/contexts/socketContext";
import {
  Add,
  Edit,
  FilterList,
  FilterListOff,
  KeyboardArrowUp,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";
import AddIssueDialog from "./addIssueDialog";
import EditIssueDialog from "./editIssueDialog";
import { inherits } from "util";

const IssuesList: React.FC = ({}) => {
  const { socket, isConnected } = useSocket();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [sortedIssues, setSortedIssues] = useState<Issue[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isFilteringActiveOnly, setIsFilteringActiveOnly] = useState(false);

  useEffect(() => {
    setSortedIssues(
      issues
        .sort((a, b) => {
          if (a.priority === b.priority) {
            return (
              Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
            );
          }
          return a.priority - b.priority;
        })
        .filter(
          (issue) =>
            !isFilteringActiveOnly ||
            !["Canceled", "Resolved"].includes(issue.status)
        )
    );
  }, [issues, isFilteringActiveOnly]);

  useEffect(() => {
    socket?.on("issues", (data: Issue[]) => {
      console.log("Issues: ", data);
      setIssues(data);
    });
    if (socket && isConnected) {
      socket?.on("updateIssue", (data: Issue) => {
        setIssues((prev) => {
          return prev.map((issue) => {
            if (issue.id === data.id) {
              return data;
            }
            return issue;
          });
        });
      });

      socket?.on("newIssue", (data: Issue) => {
        setIssues((prev) => {
          return [...prev, data];
        });
      });

      socket?.on("deleteIssue", (data: Issue) => {
        setIssues((prev) => {
          return prev.filter((issue) => issue.id !== data.id);
        });
      });
    }
    return () => {
      socket?.off("issues");
      socket?.off("updateIssue");
      socket?.off("newIssue");
      socket?.off("deleteIssue");
    };
  }, [socket, isConnected]);

  const handleAddIssue = () => {
    setIsAddOpen(true);
  };

  const handleAdd = (issue: Issue) => {
    socket?.emit("newIssue", issue);
    setIsAddOpen(false);
  };

  const makeIssuePriority = (issue: Issue) => {
    if (issue.priority === 0) {
      return "Urgent";
    } else if (issue.priority === 1) {
      return "High";
    } else if (issue.priority === 2) {
      return "Medium";
    } else if (issue.priority === 3) {
      return "Low";
    }
    return "";
  };

  const makeIssueNote = (note: IssueNote) => {
    const localDate = new Date(note.timestamp).toLocaleString();
    const zuluTime =
      new Date(note.timestamp).toISOString().slice(11, 16) + " Zulu";

    const combinedText = `${localDate} | ${zuluTime}`;
    return (
      <Stack direction="column" spacing={0}>
        <Typography variant="inherit">{note.note}</Typography>
        <Typography variant="caption">{combinedText}</Typography>
      </Stack>
    );
  };

  const makeIssueTitle = (issue: Issue) => {
    return (
      <TableRow
        key={issue.id}
        onClick={() => setEditingIssue(issue)}
        sx={{
          cursor: "pointer",
          "&:hover": {
            bgcolor: (theme) =>
              alpha(
                theme.palette.action.hover,
                theme.palette.action.hoverOpacity
              ),
          },
          verticalAlign: "top",
        }}
      >
        <TableCell style={{ verticalAlign: "top" }}>
          <Chip
            label={issue.status}
            color={
              issue.status === "Backlog"
                ? "warning"
                : issue.status === "Blocked"
                ? "error"
                : issue.status === "In Progress"
                ? "info"
                : issue.status === "Resolved"
                ? "success"
                : "default"
            }
          />
        </TableCell>
        <TableCell style={{ verticalAlign: "top" }}>
          <Stack direction="row" spacing={2}>
            {issue.priority === 0 ? (
              <KeyboardDoubleArrowUp color="error" />
            ) : null}
            {issue.priority === 1 ? <KeyboardArrowUp color="error" /> : null}
            <Box>{makeIssuePriority(issue)}</Box>
          </Stack>
        </TableCell>
        <TableCell style={{ verticalAlign: "top" }}>{issue.title}</TableCell>

        <TableCell style={{ verticalAlign: "top" }}>
          {issue.notes.length > 0 ? makeIssueNote(issue.notes[0]) : ""}
        </TableCell>
      </TableRow>
    );
  };

  const handleEditIssue = (issue: Issue) => {
    socket?.emit("updateIssue", issue);
    setEditingIssue(null);
  };

  const activeIssuesCount = sortedIssues.filter(
    (issue) => !["Canceled", "Resolved"].includes(issue.status)
  ).length;

  const issueCountText = isFilteringActiveOnly
    ? `${activeIssuesCount} Active Issue${activeIssuesCount !== 1 ? "s" : ""}`
    : `${sortedIssues.length} Issue${sortedIssues.length !== 1 ? "s" : ""}`;

  return (
    <Box sx={{ flex: 1 }}>
      <Stack
        direction="row"
        alignItems="trailing"
        justifyContent="space-between"
      >
        <Typography variant="h6">{issueCountText}</Typography>
        <Stack direction={"row"} spacing={1}>
          <Tooltip title="Filter Active Only">
            <IconButton
              onClick={() => setIsFilteringActiveOnly(!isFilteringActiveOnly)}
            >
              {isFilteringActiveOnly ? <FilterListOff /> : <FilterList />}
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleAddIssue}>
            <Add />
          </IconButton>
        </Stack>
        <AddIssueDialog
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAdd}
        />
      </Stack>
      <Box sx={{ mt: 0, ml: 0, mr: 2, mb: 4, flexGrow: 1 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Priority</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedIssues.map((issue) => makeIssueTitle(issue))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {editingIssue && (
        <EditIssueDialog
          open={!!editingIssue}
          onUpdate={handleEditIssue}
          onClose={() => setEditingIssue(null)}
          issue={editingIssue}
        />
      )}
    </Box>
  );
};

export default IssuesList;
