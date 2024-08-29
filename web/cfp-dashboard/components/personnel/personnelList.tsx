import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Stack,
  Typography,
  Card,
} from "@mui/material";
import { Personnel } from "@/app/types/personnel";
import useAxios from "@/contexts/useAxios";
import { Add, Edit } from "@mui/icons-material";
import AddPersonnel from "./addPersonnel";
import EditPersonnel from "./editPersonnel";

const PersonnelList: React.FC = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editPerson, setEditPerson] = useState<Personnel>();

  const axios = useAxios();
  const endpoint = "/personnel";

  const fetchPersonnel = async () => {
    const response = await axios.get(endpoint);
    setPersonnel(response.data);
  };

  const handleEditOpen = (personnel: Personnel) => {
    setEditPerson(personnel);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditPerson(undefined);
  };

  const addPersonnel = async (personnel: Personnel) => {
    await axios.post(endpoint, personnel);
    fetchPersonnel();
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="trailing"
        justifyContent="space-between"
      >
        <Typography variant="h4" component="div">
          Personnel
        </Typography>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={() => setAddOpen(true)}>
            <Add />
          </IconButton>
        </Stack>
        <AddPersonnel
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={addPersonnel}
        />
        {editPerson && (
          <EditPersonnel
            personnel={editPerson}
            open={editOpen}
            onClose={handleEditClose}
            onSave={async (personnel) => {
              await axios.put(`${endpoint}/${personnel.id}`, personnel);
              fetchPersonnel();
            }}
          />
        )}
      </Stack>
      <Container maxWidth="md">
        {personnel.length === 0 ? (
          <Box sx={{ m: 4, textAlign: "center" }}>
            <Typography>No personnel added</Typography>
          </Box>
        ) : (
          <Card sx={{ m: 4 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Position
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Unit</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Phone</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personnel.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        {person.rank}
                        {". "}
                        {person.lastName}
                        {", "}
                        {person.firstName}
                      </TableCell>
                      <TableCell>{person.dutyPosition}</TableCell>
                      <TableCell>{person.unit}</TableCell>
                      <TableCell>{person.phone}</TableCell>
                      <TableCell>{person.email}</TableCell>
                      <TableCell style={{ textAlign: "right" }}>
                        <IconButton onClick={() => handleEditOpen(person)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default PersonnelList;
