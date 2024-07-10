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
import { EventLogLevel } from "../events/eventsList";
import { useEventsSocket } from "@/contexts/eventsSocketContext";

const IssuesList: React.FC = ({}) => {
  const { eventsSocket } = useEventsSocket();
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
    emitNewIssueEvent(issue);
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

  const makeIssueCreatedAt = (createdAt: string) => {
    const localDate = new Date(createdAt).toLocaleString();
    const zuluTime = new Date(createdAt).toISOString().slice(11, 16) + " Zulu";

    const combinedText = `${localDate} | ${zuluTime}`;
    return combinedText;
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
        <TableCell style={{ verticalAlign: "top" }}>
          {makeIssueCreatedAt(issue.createdAt)}
        </TableCell>
      </TableRow>
    );
  };

  const handleEditIssue = (issue: Issue) => {
    if (editingIssue) {
      emitUpdateIssueEvent(editingIssue as Issue, issue);
    }
    socket?.emit("updateIssue", issue);
    setEditingIssue(null);
  };

  const activeIssuesCount = sortedIssues.filter(
    (issue) => !["Canceled", "Resolved"].includes(issue.status)
  ).length;

  const issueCountText = isFilteringActiveOnly
    ? `${activeIssuesCount} Active Issue${activeIssuesCount !== 1 ? "s" : ""}`
    : `${sortedIssues.length} Issue${sortedIssues.length !== 1 ? "s" : ""}`;

  const emitNewIssueEvent = (issue: Issue) => {
    emitEventItem(
      EventLogLevel.Warning,
      "Issue",
      `New ${makeIssuePriority(issue)} Priority Issue: ${issue.title}`,
      issue.description
    );
  };

  const emitUpdateIssueEvent = (prevIssue: Issue, issue: Issue) => {
    const statusChangeMessage =
      prevIssue.status !== issue.status
        ? `Status: ${prevIssue.status} ➡ ${issue.status}`
        : "";
    const priorityChangeMessage =
      prevIssue.priority !== issue.priority
        ? `Priority: ${makeIssuePriority(prevIssue)} ➡ ${makeIssuePriority(
            issue
          )}`
        : "";
    const notesChangeMessage =
      issue.notes.length > 0 ? `Last Update: ${issue.notes[0].note}` : "";

    const descChangeMessage =
      prevIssue.description !== issue.description
        ? `Updated Description: ${issue.description}`
        : "";

    const ticketNumberChangeMessage =
      prevIssue.ticketNumber !== issue.ticketNumber
        ? `Updated Ticket Number: ${issue.ticketNumber}`
        : "";

    const changes = [
      statusChangeMessage,
      priorityChangeMessage,
      descChangeMessage,
      notesChangeMessage,
      ticketNumberChangeMessage,
    ].filter((message) => message.length > 0);

    if (changes.length === 0) {
      return;
    }

    emitEventItem(
      EventLogLevel.Info,
      "Issue",
      `Updated Issue ${issue.title}`,
      changes.join("  \n")
    );
  };

  function emitEventItem(
    level: EventLogLevel,
    category: string,
    title: string,
    message: string | undefined
  ) {
    eventsSocket?.emit("newEventItem", {
      id: new Date().toISOString(),
      level,
      category,
      title,
      message: message || "",
      author: "User",
      isUserGenerated: true,
      timestamp: new Date().toISOString(),
    });
  }

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
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Last Update</TableCell>
                <TableCell>Created</TableCell>
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
