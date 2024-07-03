import React from "react";
import { Issue, IssueNote } from "../../app/types/issue";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

interface IssuesListProps {
  issues: Issue[];
}

const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  return (
    <List>
      {issues.map((issue) => (
        <ListItem disableGutters disablePadding key={issue.id}>
          <ListItemButton>
            <ListItemText primary={issue.title} secondary={issue.description} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default IssuesList;
