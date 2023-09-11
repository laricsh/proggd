import React, { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListSubheader,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StorageIcon from "@mui/icons-material/Storage";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { TabContext, TabList } from "@mui/lab";
import TabPanel from "@mui/lab/TabPanel";
import ForceGraph2D from "react-force-graph-2d";
import PieChartIcon from "@mui/icons-material/PieChart";
import ListItemButton from "@mui/material/ListItemButton";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ListItemIcon from "@mui/material/ListItemIcon";

interface AttributePairs {
  datatype: string;
  label1: string;
  attributeName1: string;
  label2: string;
  attributeName2: string;
}

interface hist {
  name: string;
  amnt: number;
}

interface clusterInterface {
  cluster: string;
  values: string[];
}

export default function AttributeSummary(props: any) {
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLink, setHighlightLink] = useState(new Set());
  const [iconColor2, setIconColor2] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [page3, setPage3] = useState(0);
  const [rowsPerPage3, setRowsPerPage3] = useState(5);
  const [simThreshold, setSimThreshold] = useState(2.0);
  const [histBucket, setHistBuckets] = useState(2.0);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [simjoindata, setSimJoinData] = useState([
    { attr1: "-", attr2: "-", count: "0" },
  ]);
  const [showSelected, setShowSelected] = useState(false);
  const [histdata, setHistData] = React.useState<hist[]>([]);
  const [numericalValues, setNumericalValues] = useState([
    {
      label: "-",
      attribute: "-",
    },
  ]);
  const [iconColor, setIconColor] = useState(0);
  const [tableRow, setTableRow] = useState<AttributePairs>();
  const [tableRowHistogram, setTableRowHistogram] = useState({
    label: "-",
    attribute: "-",
  });
  const [attributeIndexes, setAttributeIndexes] = useState([
    { datatype: "string", label: "label-1", attribute: "attribute name 1" },
  ]);
  const [attributePairs, setAttributePairs] = React.useState<AttributePairs[]>([
    {
      datatype: "string",
      label1: "label1",
      attributeName1: "attr1",
      label2: "label2",
      attributeName2: "attr2",
    },
  ]);
  const [chartData, setChartData] = useState<clusterInterface[]>([
    { cluster: "1", values: ["str1", "str2", "str3"] },
    { cluster: "2", values: ["str1", "str2", "str3"] },
  ]);
  const [selectedClusters, setSelectedClusters] = useState<clusterInterface[]>([
    { cluster: "1", values: ["str1", "str2", "str3"] },
    { cluster: "2", values: ["str1", "str2", "str3"] },
  ]);
  const [showIndex, setShowIndex] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [showHistogramC, setShowHistogramC] = React.useState(false);
  const [checked, setChecked] = React.useState([0]);
  const [showCluster, setShowCluster] = React.useState(false);
  const [intersectionArray, setIntersectionArray] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [showBarChartComparison, setShowBarChartComparison] = useState(false);
  const [showLineChartComparison, setLineChartComparison] = useState(false);
  const [attr1, setAttr1] = useState("attr1");
  const [attr2, setAttr2] = useState("attr2");

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const loadAttributesTable = () => {
    fetch("http://0.0.0.0:5000/ggdminer/attributePairs")
      .then((res) => res.json())
      .then((json) => {
        setAttributePairs(json);
        console.log(attributePairs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showSelectedClusterComparison = () => {
    //alert(JSON.stringify(checked));
    const selectedClusters = chartData.filter((c) => {
      return checked.includes(parseInt(c.cluster));
    });
    const intersectionArrays = selectedClusters
      .map((a) => a.values)
      .reduce((a, b) => a.filter((c) => b.includes(c)));
    setSelectedClusters(selectedClusters);
    setIntersectionArray(intersectionArrays);
    setShowCluster(true);
  };

  const loadNumberTable = () => {
    fetch("http://0.0.0.0:5000/ggdminer/numericalValues")
      .then((res) => res.json())
      .then((json) => {
        setNumericalValues(JSON.parse(json));
        console.log(numericalValues);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadIndexesTable = () => {
    fetch("http://0.0.0.0:5000/ggdminer/attributeIndexes")
      .then((res) => res.json())
      .then((json) => {
        setAttributeIndexes(json);
        console.log(attributeIndexes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadAttributesTable();
    loadIndexesTable();
    loadNumberTable();
  }, []);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeRowsPerPage2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const handleChangeRowsPerPage3 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage3(parseInt(event.target.value, 10));
    setPage3(0);
  };

  const highlightNodesClick = (tableRow: AttributePairs) => {
    //const tableRow = attributePairs[num];
    highlightNodes.clear();
    highlightLink.clear();
    props.graphvis.nodes.forEach((node: any) => {
      if (node.label === tableRow.label1 || node.label === tableRow.label2) {
        highlightNodes.add(node.id);
      }
    });
    props.graphvis.links.forEach((link: any) => {
      if (link.label === tableRow.label1 || link.label === tableRow.label2) {
        highlightLink.add(link);
      }
    });
    setHighlightNodes(highlightNodes);
    setHighlightLink(highlightLink);
  };

  const runSimilarityIndex = (tableRow: AttributePairs) => {
    //const tableRow = attributePairs[num];
    runSimilarityJoin(tableRow);
  };

  const showHistogram = (row: any) => {
    setTableRowHistogram(row);
    setShowHistogramC(true);
    fetch("http://0.0.0.0:5000/ggdminer/histogram", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: row.label,
        attribute: row.attribute,
        bucket: histBucket,
      }),
    })
      .then((res) => res.json())
      .then((j) => {
        setHistData(j);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(histdata);
    console.log(showHistogramC);
  };

  const runSimilarityJoin = (tableRow: AttributePairs) => {
    setTableRow(tableRow);
    fetch("http://0.0.0.0:5000/ggdminer/similarityJoin", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label1: tableRow.label1,
        label2: tableRow.label2,
        attribute1: tableRow.attributeName1,
        attribute2: tableRow.attributeName2,
        threshold: simThreshold,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setSimJoinData(JSON.parse(json));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function runComparisonSelected(type: string): void {
    if (type.startsWith("bar")) {
      setShowBarChartComparison(true);
    } else {
      setLineChartComparison(true);
    }
    // @ts-ignore
    setAttr1(selected.at(0)["attribute"]);
    // @ts-ignore
    setAttr2(selected.at(1)["attribute"]);
    const str = JSON.stringify(selected.slice(0, 2));
    fetch("http://0.0.0.0:5000/ggdminer/numericalComparison", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: str,
    })
      .then((res) => res.json())
      .then((json) => {
        setComparisonData(json);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onGraphChangeFn(
    attributeName: string,
    label: string,
    index: number
  ): void {
    fetch("http://0.0.0.0:5000/ggdminer/similarityIndex", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attribute: attributeName,
        label: label,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setChartData(JSON.parse(json));
        setShowIndex(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangePage2 = (event: unknown, newPage: number) => {
    setPage2(newPage);
  };

  const handleChangePage3 = (event: unknown, newPage: number) => {
    setPage3(newPage);
  };

  const handleClick_row = (event: React.MouseEvent<unknown>, row: any) => {
    const selectedIndex = selected.indexOf(row);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (row: any) => selected.indexOf(row) !== -1;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Properties of {props.graph}</h1>
      </header>
      <Grid container spacing={1} columns={15}>
        {/* Available datasets */}
        <Grid item xs={7} md={7}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Numerical Values
            </Typography>
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Show Histogram</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {numericalValues
                    .slice(
                      page3 * rowsPerPage3,
                      page3 * rowsPerPage3 + rowsPerPage3
                    )
                    .map((row, index) => (
                      //  {attributePairs.map((row, index) => (
                      <TableRow
                        hover
                        onClick={(event) => handleClick_row(event, row)}
                        role="checkbox"
                        aria-checked={isSelected(row)}
                        tabIndex={-1}
                        key={index}
                        selected={isSelected(row)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox color="primary" checked={isSelected(row)} />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={row.label}
                          scope="row"
                          padding="none"
                        >
                          {row.label}
                        </TableCell>
                        <TableCell>{row.attribute}</TableCell>
                        <TableCell>
                          <FormControl>
                            <TextField
                              sx={{
                                width: 120,
                              }}
                              size="small"
                              id="outlined-basic"
                              label="Hist. Bucket"
                              variant="outlined"
                              margin="normal"
                              defaultValue={histBucket}
                              onChange={(e) =>
                                setHistBuckets(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            value={index}
                            key={index}
                            onClick={(e) => showHistogram(row)}
                            style={{
                              color: iconColor2 === index ? "green" : "black",
                            }}
                          >
                            <BarChartIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="rowC">
              {/*<IconButton
                sx={{
                  width: 200,
                }}
                edge="end"
                aria-label="delete"
                onClick={(e) => runComparisonSelected("bar")}
              >
                <BarChartIcon />
              </IconButton>*/}
              <IconButton
                sx={{
                  width: 500,
                }}
                edge="end"
                aria-label="delete"
                onClick={(e) => runComparisonSelected("query")}
              >
                <QueryStatsIcon />
              </IconButton>
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={numericalValues.length}
              rowsPerPage={rowsPerPage3}
              page={page3}
              onPageChange={handleChangePage3}
              onRowsPerPageChange={handleChangeRowsPerPage3}
            />
          </Paper>
        </Grid>
        <Grid item xs={8} md={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Histogram of {tableRowHistogram.attribute} of{" "}
              {tableRowHistogram.label}
            </Typography>
            {showHistogramC && (
              <div>
                <ResponsiveContainer width="100%" aspect={1}>
                  <BarChart
                    data={histdata}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amnt" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {/*showBarChartComparison && (
              <div>
                <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
                  Comparison of selected rows
                </Typography>
                <ResponsiveContainer width="100%" aspect={1}>
                  <BarChart
                    data={comparisonData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="attr1" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attr2" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )*/}
            {showLineChartComparison && (
              <div>
                <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
                  Comparison of selected rows
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="attr1" name={attr1} />
                    <YAxis type="number" dataKey="attr2" name={attr2} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter
                      name="Comparison"
                      data={comparisonData}
                      fill="#8884d8"
                      line
                      shape="cross"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </Paper>
        </Grid>
        <Grid item xs={10} md={10}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Possibly Correlated Properties
            </Typography>
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Data Type</TableCell>
                    <TableCell>Label 1</TableCell>
                    <TableCell>Attribute Name 1</TableCell>
                    <TableCell>Label 2</TableCell>
                    <TableCell>Attribute Name 2</TableCell>
                    <TableCell>Show similarity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attributePairs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      //  {attributePairs.map((row, index) => (
                      <TableRow
                        key={index}
                        onClick={(e) => highlightNodesClick(row)}
                        hover={true}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.datatype}
                        </TableCell>
                        <TableCell>{row.label1}</TableCell>
                        <TableCell>{row.attributeName1}</TableCell>
                        <TableCell>{row.label2}</TableCell>
                        <TableCell>{row.attributeName2}</TableCell>
                        <TableCell>
                          <div className="rowC">
                            <FormControl
                              sx={{
                                width: 50,
                              }}
                            >
                              <TextField
                                label="Threshold"
                                variant="outlined"
                                defaultValue={simThreshold}
                                onChange={(e) =>
                                  setSimThreshold(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              value={index}
                              key={index}
                              onClick={(e) => runSimilarityIndex(row)}
                              style={{
                                color: iconColor2 === index ? "green" : "black",
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={attributePairs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
        <Grid item xs={5} md={5}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Schema Graph
            </Typography>
            <ForceGraph2D
              //ref={fgRef}
              graphData={props.graphvis}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={3}
              linkVisibility={true}
              linkCurvature={0.15}
              nodeLabel={"label"}
              linkLabel={"label"}
              nodeColor={(node) => {
                if (highlightNodes.has(node.id)) {
                  return "red";
                } else {
                  return "blue";
                }
              }}
              linkColor={(link) => {
                if (highlightLink.has(link)) {
                  return "red";
                } else {
                  return "black";
                }
              }}
              width={400}
              height={300}
            />
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Similarity Indexed Attributes
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Data Type</TableCell>
                    <TableCell align="right">Label</TableCell>
                    <TableCell align="right">Property</TableCell>
                    <TableCell align="right">Show Index</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attributeIndexes.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="right">{row.datatype}</TableCell>
                      <TableCell align="right">{row.label}</TableCell>
                      <TableCell align="right">{row.attribute}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          value={row.attribute}
                          key={index}
                          onClick={(e) =>
                            onGraphChangeFn(row.attribute, row.label, index)
                          }
                          style={{
                            color: iconColor === index ? "green" : "black",
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={7} md={7}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Similarity Join Results
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Attribute {tableRow?.attributeName1} of {tableRow?.label1}
                    </TableCell>
                    <TableCell>
                      Attribute {tableRow?.attributeName2} of {tableRow?.label2}
                    </TableCell>
                    <TableCell>Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {simjoindata
                    .slice(
                      page2 * rowsPerPage2,
                      page2 * rowsPerPage2 + rowsPerPage2
                    )
                    .map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{row.attr1}</TableCell>
                        <TableCell>{row.attr2}</TableCell>
                        <TableCell>{row.count}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={simjoindata.length}
              rowsPerPage={rowsPerPage2}
              page={page2}
              onPageChange={handleChangePage2}
              onRowsPerPageChange={handleChangeRowsPerPage2}
            />
          </Paper>
        </Grid>
        <Grid item xs={8} md={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Similarity Index
            </Typography>
            {showIndex && (
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 600,
                  "& ul": { padding: 0 },
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Clusters
                  </ListSubheader>
                }
              >
                {chartData.map((c, index) => (
                  <ListItem disablePadding>
                    <ListItemButton
                      style={{ margin: "0 auto", display: "flex" }}
                      onClick={handleToggle(parseInt(c.cluster))}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(parseInt(c.cluster)) !== -1}
                          tabIndex={-1}
                        />
                      </ListItemIcon>
                      <ListItemButton onClick={(e) => setOpen(!open)}>
                        <ListItemText primary={c.cluster} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        {c.values.map((v: string) => (
                          <List component="div" disablePadding>
                            <ListItemText primary={v} />
                          </List>
                        ))}
                      </Collapse>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
            <Button
              variant="contained"
              onClick={showSelectedClusterComparison}
              style={{ margin: "0 auto", display: "flex" }}
              sx={{
                width: 300,
              }}
            >
              Show Cluster Comparison
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={16} md={16}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Cluster Comparison
            </Typography>
            <Grid container spacing={1}>
              {showCluster &&
                selectedClusters.map((cluster, index) => (
                  <Grid item sm={10 / selectedClusters.length}>
                    <TableContainer
                      sx={{
                        width: 300,
                      }}
                      className="rowC"
                    >
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>{cluster.cluster}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cluster.values.map((str, id) => (
                            <TableRow>
                              <TableCell
                                style={{
                                  backgroundColor: intersectionArray.includes(
                                    str
                                  )
                                    ? "red"
                                    : "white",
                                }}
                              >
                                {str}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
