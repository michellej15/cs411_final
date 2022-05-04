import "./App.css";
import React, { useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tabs,
  Tab,
  TextField,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: 440,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 160,
    borderColor: "white",
    textColor: "white",
    color: "white",
  },
  customTabRoot: {
    color: "#FFFFFF",
  },
  customTabIndicator: {
    backgroundColor: "#1DB954",
  },
  select: {
    color: "white",
    textAlign: "left",
  },
  InputLabel: {
    borderColor: "white",
    color: "white",
    textColor: "white",
  },
  TableRow: {
    backgroundColor: "#201c1c",
  },
  TableCell: {
    color: "white",
  },
  input: {
    color: "white",
    caretColor: "white",
  }
}));

const StyledInputLabel = styled(InputLabel)`
  .MuiInputLabel-root {
    color: white;
    border-color: white;
    text-color: white;
  }
  .Mui-focused {
    color: white;
    border-color: white;
    text-color: white;
  }
  .MuiInputLabel-formControl {
    color: white;
    border-color: white;
    text-color: white;
  }
  .MuiInputLabel-marginDense {
    color: white;
    border-color: white;
    text-color: white;
  }
  .MuiInputLabel-outlined {
    color: white;
    border-color: white;
    text-color: white;
  }
`;

const country_list = [
  { country: "Argentina" },
  { country: "Australia" },
  { country: "Austria" },
  { country: "Belgium" },
  { country: "Bolivia" },
  { country: "Brazil" },
  { country: "Bulgaria" },
  { country: "Canada" },
  { country: "Chile" },
  { country: "Columbia" },
  { country: "Costa Rica" },
  { country: "Czech Republic" },
  { country: "Denmark" },
  { country: "Dominican Republic" },
  { country: "Ecuador" },
  { country: "El Salvador" },
  { country: "Estonia" },
  { country: "France" },
  { country: "Germany" },
  { country: "Global" },
  { country: "Greece" },
  { country: "Guatemala" },
  { country: "Honduras" },
  { country: "Hong Kong" },
  { country: "Hungary" },
  { country: "Iceland" },
  { country: "India" },
  { country: "Indonesia" },
  { country: "Ireland" },
  { country: "Israel" },
  { country: "Japan" },
  { country: "Korea" },
  { country: "Latvia" },
  { country: "Malaysia" },
  { country: "Mexico" },
  { country: "Netherlands" },
  { country: "New Zealand" },
  { country: "Peru" },
  { country: "Poland" },
  { country: "Portugal" },
  { country: "Russia" },
  { country: "Singapore" },
  { country: "South Africa" },
  { country: "Spain" },
  { country: "Sweden" },
  { country: "Taiwan" },
  { country: "Turkey" },
  { country: "USA" },
  { country: "United Kingdom" },
  { country: "Uraguay" },
  { country: "Vietnam" },
];



function App() {
  const [searchCountry, setSearchCountry] = useState("");
  const [newSongCharts, setNewSongCharts] = useState([]);
  const [tab, setTab] = React.useState(0);
  const [myCharts, setMyCharts] = useState([]);
  const [newNote, setNewNote] = useState("");
  const tabChange = (event, newValue) => {
    setTab(newValue);
  };

  const submitNewSong = (value) => {
    // Axios.post("http://localhost:8080/api/insert", {
    Axios.post("https://brave-sunspot-308516.uc.r.appspot.com/api/insert", {
      songId: value,
    });
  };
  const searchChart = (value) => {
    // Axios.get("http://localhost:8080/api/get", {
    Axios.get("https://brave-sunspot-308516.uc.r.appspot.com/api/get", {
      params: {
        search: value,
      },
    }).then((response) => {
      console.log(response.data);
      var i;
      for (i = 0; i < response.data.length; i++) {
        response.data[i].editMode = false;
        response.data[i].id = response.data[i].song_id.concat(
          response.data[i].artist_id
        );
      }
      setNewSongCharts(response.data);
    });
  };

  // For My Songs Retrieval
  const getMyCharts = () => {
    // Axios.get("http://localhost:8080/api/retrieve").then((response) => {
    Axios.get("https://brave-sunspot-308516.uc.r.appspot.com/api/retrieve").then((response) => {
      console.log(response.data);
      setMyCharts(response.data);
    });
  };

  // For deleting songs from Personalize
  const deleteSong = (songId) => {
    // Axios.delete(`http://localhost:8080/api/delete/${songId}`);
    Axios.delete(`https://brave-sunspot-308516.uc.r.appspot.com/api/delete/${songId}`);
  };

  const onToggleEditMode = (id) => {
    setMyCharts((state) => {
      return myCharts.map((row) => {
        if (row.song_id === id) {
          return { ...row, editMode: !row.editMode };
        }
        return row;
      });
    });
  };

  const updateSong = (currsongId) => {
    console.log(currsongId);
    // Axios.put(`http://localhost:8080/api/update`, {
    Axios.put(`https://brave-sunspot-308516.uc.r.appspot.com/api/update`, {
      songId: currsongId,
      note: newNote,
    });
    onToggleEditMode(currsongId);
  };

  const changeCountry = (event) => {
    setSearchCountry(event.target.value);
    searchChart(event.target.value);
  };

  const onChange = (e, row) => {
    const value = e.target.value;
    const name = e.target.name;
    
    const curRow = row;
    if (name === "note") {
      setNewNote(value);
    }

    const newRows = myCharts.map((row) => {
      if (row === curRow) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setMyCharts(newRows);
  };

  const classes = useStyles();


  const CustomTableCell = ({ val, name, onChange }) => {
    const { editMode } = val;
    console.log(val);
    return (
      <TableCell align="center" className={classes.TableCell}>
        {editMode ? (
          <TextField
            value={val[name]}
            name={name}
            onChange={(e) => onChange(e, val)}
            InputProps={{
              className: classes.input
            }}
            autoFocus
          />
        ) : (
          val[name]
        )}
      </TableCell>
    );
  };

  return (
    <Grid
      className="App"
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={4}
    >
      <Grid item>
        <h1 style={{ color: "white" }}> Spotify The World</h1>
      </Grid>
      <Grid item>
        <Tabs
          value={tab}
          onChange={tabChange}
          classes={{
            root: classes.customTabRoot,
            indicator: classes.customTabIndicator,
          }}
        >
          <Tab label="Charts" />
          <Tab label="Personalized List" />
        </Tabs>
      </Grid>
      {tab === 0 && (
        <Grid item>
          <FormControl variant="outlined" className={classes.formControl}>
            <StyledInputLabel className={classes.InputLabel}>
              Country
            </StyledInputLabel>
            <Select
              classes={{
                root: classes.select,
                select: classes.select,
                icon: classes.select,
              }}
              onChange={changeCountry}
              value={searchCountry}
            >
              {country_list.map((val) => (
                <MenuItem value={val.country}>{val.country}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      {tab === 0 && (
        <Grid item>
          <TableContainer className={classes.container} component={Paper}>
            <Table className={classes.container} aria-label="simple table">
              <TableHead>
                <TableRow className={classes.TableRow}>
                  <TableCell align="center" className={classes.TableCell}>
                    Rank{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Song{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Artist{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Album{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Actions{" "}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {newSongCharts.map((val) => (
                  <TableRow key={val.id} className={classes.TableRow}>
                    <TableCell align="center" className={classes.TableCell}>
                      {" "}
                      {val.chart_rank}{" "}
                    </TableCell>
                    <TableCell align="center" className={classes.TableCell}>
                      {" "}
                      {val.song_name}{" "}
                    </TableCell>
                    <TableCell align="center" className={classes.TableCell}>
                      {" "}
                      {val.artists}{" "}
                    </TableCell>
                    <TableCell align="center" className={classes.TableCell}>
                      {" "}
                      {val.album_name}{" "}
                    </TableCell>
                    <TableCell align="center" className={classes.TableCell}>
                      <AddIcon
                        onClick={() => submitNewSong(val.song_id)}
                        style={{ fill: "#1DB954" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {tab === 1 && (
        <Grid item>
          <Button onClick={getMyCharts} variant="contained" color="primary">
            Refresh
          </Button>
        </Grid>
      )}

      {tab === 1 && (
        <Grid item>
          <TableContainer className={classes.container}>
            <Table className={classes.container} aria-label="simple table">
              <TableHead>
                <TableRow className={classes.TableRow}>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Song{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Artist{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Album{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Highly Rated?{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Note{" "}
                  </TableCell>
                  <TableCell align="center" className={classes.TableCell}>
                    {" "}
                    Actions{" "}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {myCharts.map((val) => (
                  <TableRow key={val.id} className={classes.TableRow}>
                    <TableCell align="center" className={classes.TableCell}>
                      {" "}
                      {val.song_name}{" "}
                    </TableCell>
                    <TableCell align="center" className={classes.TableCell}>
                      {" "}
                      {val.artists}{" "}
                    </TableCell>
                    <TableCell align="center" className={classes.TableCell}>
                      {" "}
                      {val.album_name}{" "}
                    </TableCell>
                    <TableCell align="center" className={classes.TableCell}>
                      {" "}
                      {val.highlyRated}{" "}
                    </TableCell>
                    <CustomTableCell {...{ val, name: "note", onChange }} />
                    <TableCell align="center" className={classes.TableCell}>
                      {val.editMode ? (
                        <>
                          <DoneIcon
                            style={{ fill: "green" }}
                            onClick={() => updateSong(val.song_id)}
                          >
                            Done
                          </DoneIcon>
                        </>
                      ) : (
                        <>
                          <CloseIcon
                            onClick={() => deleteSong(val.song_id)}
                            style={{ fill: "red" }}
                          />
                          <EditIcon
                            style={{ fill: "orange" }}
                            onClick={() => onToggleEditMode(val.song_id)}
                          />
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </Grid>
  );
}

export default App;
