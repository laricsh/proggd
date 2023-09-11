import React, { useEffect, useState } from "react";
import { Copyright } from "@mui/icons-material";
import LeftPanel from "../App/LeftPanel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TabPanel from "@mui/lab/TabPanel";
import StartIcon from "@mui/icons-material/Start";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PieChartIcon from "@mui/icons-material/PieChart";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import StorageIcon from "@mui/icons-material/Storage";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  IconButton,
  Input,
  InputLabel,
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
  TableRow,
  Tabs,
  TextField,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ForceGraph2D from "react-force-graph-2d";
import Box from "@mui/material/Box";
import { TabList } from "@mui/lab";
import { TabContext } from "@mui/lab";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function generate(element: React.ReactElement) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

interface property {
  name: string;
  domain: string;
}

interface numberLabel {
  name: string;
  number: number;
}

interface pieChart {
  name: string;
  value: number;
}

interface barChart {
  name: string;
  amnt: number;
}

export default function MainPanel(props: any) {
  const [valueTab, setValueTab] = React.useState("nodes");
  const [graphs, setGraphs] = React.useState<string[]>(["loading"]);
  //const [graph, setGraph] = React.useState<string>("graph");
  const [label, setLabel] = React.useState<string>("label");
  const [data, setData] = React.useState({
    min: 0,
    max: 0,
    avg: 0,
  });
  const [pieChartData, setPieChartData] = React.useState<pieChart[]>([
    { name: "1", value: 1 },
  ]);
  const [barChartData, setBarChartData] = React.useState<barChart[]>([
    { name: "1", amnt: 1 },
  ]);
  const [properties, setProperties] = React.useState<property[]>([
    { name: "-", domain: "-" },
  ]);
  const [numberVertices, setNumberVertices] = React.useState<numberLabel[]>([
    { name: "-", number: 1 },
  ]);
  const [numberEdges, setNumberEdges] = React.useState<numberLabel[]>([
    { name: "-", number: 3 },
  ]);
  /*const initialGraphVis: graphVis = {
    nodes: [
      {
        id: "1",
        label: "Select a Dataset",
        property: [],
      },
    ],
    links: [],
  };
  const [graphvis, setGraphvis] = React.useState<graphVis>(initialGraphVis);*/
  const [iconOneColor, setIconOneColor] = useState(0);
  const [iconPieChartColor, setIconPieChartColor] = useState(0);
  const [iconBoxplotChartColor, setIconBoxplotChartColor] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [showPieChart, setShowPieChart] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const [stringMinThreshold, setStringMinThreshold] = React.useState(7);
  const [stringMinDifference, setStringMinDifference] = React.useState(1);
  const [numberMinThreshold, setNumberMinThreshold] = React.useState(20);
  const [numberMinDifference, setNumberMinDifference] = React.useState(2);
  const [frequency, setFrequency] = React.useState(200);
  const [confidence, setConfidence] = React.useState(0.7);
  const [diversityThreshold, setDiversityThreshold] = React.useState(0.5);
  const [kedge, setKedge] = React.useState(3);
  const [sampleRate, setSampleRate] = React.useState(0.0);
  const [maxHops, setMaxHops] = React.useState(3);
  const [kgraph, setKGraph] = React.useState(3);
  const [maxCombination, setMaxCombination] = React.useState(7);
  const [schemaSimilarity, setSchemaSimilarity] = React.useState(0.5);
  const [maxMapping, setMaxMapping] = React.useState(7);
  const [sample, setSample] = React.useState("false");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const submitGraphDialog = () => {
    setOpen(false);
    console.log(
      JSON.stringify({
        graph: props.graph,
        configminer: {
          freqThreshold: frequency,
          minThresholdPerDataType: [
            {
              dataType: "String",
              minThreshold: stringMinThreshold,
              minDifference: stringMinDifference,
            },
            {
              dataType: "Number",
              minThreshold: numberMinThreshold,
              minDifference: numberMinDifference,
            },
          ],
          confidence: confidence,
          shortDistance: 0,
          diversityThreshold: diversityThreshold,
          kedge: kedge,
          sample: sample.toLowerCase() === "true",
          sampleRate: sampleRate,
          preprocess: "schema",
          maxHops: maxHops,
          kgraph: kgraph,
          schemaSim: schemaSimilarity,
          minCoverage: 0.0,
          minDiversity: 0.0,
          maxMappings: maxMapping,
          maxCombination: maxCombination,
        },
      })
    );
    fetch("http://0.0.0.0:5000/gcore/configminer/", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        graph: props.graph,
        configminer: {
          freqThreshold: frequency,
          minThresholdPerDataType: [
            {
              dataType: "String",
              minThreshold: stringMinThreshold,
              minDifference: stringMinDifference,
            },
            {
              dataType: "Number",
              minThreshold: numberMinThreshold,
              minDifference: numberMinDifference,
            },
          ],
          confidence: confidence,
          shortDistance: 0,
          diversityThreshold: diversityThreshold,
          kedge: kedge,
          sample: sample.toLowerCase() === "true",
          sampleRate: sampleRate,
          preprocess: "schema",
          maxHops: maxHops,
          kgraph: kgraph,
          schemaSim: schemaSimilarity,
          minCoverage: 0.0,
          minDiversity: 0.0,
          maxMappings: maxMapping,
          maxCombination: maxCombination,
        },
      }),
    })
      .then((res) => res.text())
      .then((txt) => {
        setOpen2(true);
        console.log("Response");
      })
      .catch((err) => {
        console.log(err);
        setOpen3(true);
      });
  };

  const onGraphChangeFn = (g: string, id: number) => {
    setIconOneColor(id);
    //alert(e.target.value); // graph name
    //if (e.target.value) this.props.setType(e.target.value);
    const graphValue = g;
    fetch("http://0.0.0.0:5000/gcore/schema/" + graphValue)
      .then((res) => res.json())
      .then((json) => {
        const obj1 = JSON.parse(json.links, function (k, v) {
          if (k === "from") {
            this.source = v;
            return; //# if return  undefined, orignal property will be removed
          }
          return v;
        });
        const obj2 = JSON.parse(JSON.stringify(obj1), function (k, v) {
          if (k === "to") {
            this.target = v;
            return; //# if return  undefined, orignal property will be removed
          }
          return v;
        });
        console.log(JSON.stringify(obj2));
        props.setGraphvis({
          nodes: JSON.parse(json.nodes),
          links: obj2,
        });
        console.log(props.graphvis?.links);
      })
      .catch((err) => {
        console.log(err);
      });
    props.setGraph(graphValue);
    //also fetch number of nodes and edges
    fetch("http://0.0.0.0:5000/gcore/numberLabels/" + graphValue)
      .then((res) => res.json())
      .then((json) => {
        //console.log(json);
        //const obj1 = JSON.parse(json.verticesSize);
        //const obj2 = JSON.parse(json.edgesSize);
        //console.log(JSON.stringify(obj2));
        //console.log(JSON.stringify(obj1));
        setNumberVertices(json.vertices);
        setNumberEdges(json.edges);
      })
      .catch((err) => {
        console.log(err);
      });
  }; // make component to render graph schemas

  useEffect(() => {
    loadGraphDB();
  }, []);

  const loadGraphDB = () => {
    fetch("http://0.0.0.0:5000/gcore/availableGraphs")
      .then((res) => res.json())
      .then((json) => {
        setGraphs(JSON.parse(json));
        console.log(graphs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNodeProperties = (node: any) => {
    setLabel(node["label"]);
    setProperties(node["property"]);
  };

  const handleChangeTab = (
    event: any,
    newValue: React.SetStateAction<string>
  ) => {
    setValueTab(newValue);
  };

  const handleClickPieChart = (label: string, property: string, id: number) => {
    setIconPieChartColor(id);
    console.log(
      JSON.stringify({
        graph: props.graph,
        label: label,
        property: property,
      })
    );
    fetch("http://0.0.0.0:5000/gcore/uniquevalues/", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        graph: props.graph,
        label: label,
        property: property,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setPieChartData(JSON.parse(json));
        console.log("Response");
      })
      .catch((err) => {
        console.log(err);
      });
    fetch("http://0.0.0.0:5000/gcore/minmaxvalues/", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        graph: props.graph,
        label: label,
        property: property,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setData(JSON.parse(json));
        console.log("Response");
      })
      .catch((err) => {
        console.log(err);
      });
    setShowPieChart(true);
  };

  const handleLinkProperties = (link: any) => {
    setLabel(link["label"]);
    setProperties(link["property"]);
  };

  return (
    <div>
      <Grid container spacing={1} columns={15}>
        {/* Available datasets */}
        <Grid item xs={5} md={5}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Graph Datasets
            </Typography>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
                "& ul": { padding: 0 },
              }}
            >
              {graphs.map((g, id) => (
                <ListItem
                  key={id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      value={g}
                      key={id}
                      onClick={(e) => onGraphChangeFn(g, id)}
                      style={{
                        color: iconOneColor === id ? "green" : "black",
                      }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <StorageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={g} />
                </ListItem>
              ))}
            </List>
            <IconButton color="primary" component="label">
              <input type="file" accept="application/json" hidden />
              <AttachFileIcon fontSize="medium" />
            </IconButton>
            <Box sx={{ width: "100%", typography: "body1", marginTop: "50px" }}>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                id="tableTitle"
                component="div"
              >
                {"Number of nodes and edges"}
              </Typography>
              <TabContext value={valueTab}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    maxWidth: "1200px",
                    margin: "0 auto",
                  }}
                >
                  <TabList
                    onChange={handleChangeTab}
                    aria-label="lab API tabs example"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    <Tab label="Vertices" value="nodes" />
                    <Tab label="Edges" value="edges" />
                  </TabList>
                </Box>
                <TabPanel value={"nodes"}>
                  <TableContainer component={Paper} style={{ maxHeight: 350 }}>
                    <Table stickyHeader aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label</TableCell>
                          <TableCell align="right">
                            Number of vertices
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {numberVertices.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.number}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel value={"edges"}>
                  <TableContainer component={Paper} style={{ maxHeight: 350 }}>
                    <Table stickyHeader aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label</TableCell>
                          <TableCell align="right">Number of edges</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {numberEdges.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.number}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabContext>
            </Box>
          </Paper>
        </Grid>
        {/* Schema of the graph */}
        <Grid item xs={10} md={10}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h5"
              id="tableTitle"
              component="div"
            >
              {`Graph ${props.graph}`}
            </Typography>
            <ForceGraph2D
              //ref={fgRef}
              graphData={props.graphvis}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={3}
              linkColor={"black"}
              linkVisibility={true}
              linkCurvature={0.15}
              linkLabel={"label"}
              nodeAutoColorBy={"label"}
              linkAutoColorBy={"label"}
              nodeCanvasObjectMode={() => "after"}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.label;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black"; //node.color;
                ctx.fillText(label, node.x, node.y);
              }}
              onNodeClick={handleNodeProperties}
              onLinkClick={handleLinkProperties}
              width={700}
              height={450}
            />
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h5"
              id="tableTitle"
              component="div"
            >
              {`Label ${label}`}
            </Typography>
            <TableContainer component={Paper} style={{ maxHeight: 350 }}>
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell align="right">Type</TableCell>
                    <TableCell align="right">Values</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties.map((row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.domain}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          value={row.name}
                          key={index}
                          onClick={(e) =>
                            handleClickPieChart(label, row.name, index)
                          }
                          style={{
                            color:
                              iconPieChartColor === index ? "green" : "black",
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
          </Paper>
        </Grid>
        {/*<Grid item xs={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ width: "100%", typography: "body1", marginTop: "50px" }}>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {"Number of nodes and edges"}
              </Typography>
              <TabContext value={valueTab}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    maxWidth: "1200px",
                    margin: "0 auto",
                  }}
                >
                  <TabList
                    onChange={handleChangeTab}
                    aria-label="lab API tabs example"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    <Tab label="Vertices" value="nodes" />
                    <Tab label="Edges" value="edges" />
                  </TabList>
                </Box>
                <TabPanel value={"nodes"}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label</TableCell>
                          <TableCell align="right">
                            Number of vertices
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {numberVertices.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.number}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel value={"edges"}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label</TableCell>
                          <TableCell align="right">Number of edges</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {numberEdges.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.number}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabContext>
            </Box>
          </Paper>
        </Grid>*/}
        <Grid item xs={7}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h5"
              id="tableTitle"
              component="div"
            >
              {"Unique, duplicate and null values"}
            </Typography>
            {showPieChart && (
              <>
                <PieChart width={550} height={300}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#fff"
                    label
                  />
                  <Tooltip />
                  <Legend verticalAlign="bottom" align="center" />
                </PieChart>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Min. value</TableCell>
                        <TableCell>Max. value</TableCell>
                        <TableCell>Average</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {data.min}
                        </TableCell>
                        <TableCell>{data.max}</TableCell>
                        <TableCell>{data.avg}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper>
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h5"
              id="tableTitle"
              component="div"
            >
              {"Configuration Parameters"}
            </Typography>
            <FormGroup>
              <div className="rowC">
                <p>Differential Constraints parameter</p>
                <FormControl
                  sx={{
                    width: 300,
                  }}
                >
                  <p>String type</p>
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Min. threshold"
                    variant="outlined"
                    margin="normal"
                    defaultValue={stringMinThreshold}
                    onChange={(e) =>
                      setStringMinThreshold(parseInt(e.target.value))
                    }
                  />
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Min. difference"
                    variant="outlined"
                    margin="normal"
                    defaultValue={stringMinDifference}
                    onChange={(e) =>
                      setStringMinDifference(parseInt(e.target.value))
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 300,
                  }}
                >
                  <p>Number type</p>
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Min. threshold"
                    variant="outlined"
                    margin="normal"
                    defaultValue={numberMinThreshold}
                    onChange={(e) =>
                      setNumberMinThreshold(parseFloat(e.target.value))
                    }
                  />
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Min. difference"
                    variant="outlined"
                    margin="normal"
                    defaultValue={numberMinDifference}
                    onChange={(e) =>
                      setNumberMinDifference(parseFloat(e.target.value))
                    }
                  />
                </FormControl>
              </div>
              <div className="rowC">
                <p>Miner parameters</p>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Frequency"
                    variant="outlined"
                    margin="normal"
                    defaultValue={frequency}
                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Confidence"
                    variant="outlined"
                    margin="normal"
                    defaultValue={confidence}
                    onChange={(e) => setConfidence(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Number of edges"
                    variant="outlined"
                    margin="normal"
                    defaultValue={kedge}
                    onChange={(e) => setKedge(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-select-currency-native"
                    select
                    label="Sample"
                    defaultValue="EUR"
                    SelectProps={{
                      native: true,
                    }}
                    onChange={(e) => setSample(e.target.value)}
                  >
                    <option key={"true"} value={"true"}>
                      {"TRUE"}
                    </option>
                    <option key={"false"} value={"false"}>
                      {"FALSE"}
                    </option>
                  </TextField>
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Sample rate"
                    variant="outlined"
                    margin="normal"
                    defaultValue={sampleRate}
                    onChange={(e) => setSampleRate(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Schema similarity"
                    variant="outlined"
                    margin="normal"
                    defaultValue={schemaSimilarity}
                    onChange={(e) =>
                      setSchemaSimilarity(parseFloat(e.target.value))
                    }
                  />
                </FormControl>
              </div>
              <div className="rowC">
                <p>Candidate Index parameters</p>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Number of source patterns"
                    variant="outlined"
                    margin="normal"
                    defaultValue={maxCombination}
                    onChange={(e) =>
                      setMaxCombination(parseInt(e.target.value))
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Edges in the candidate graph"
                    variant="outlined"
                    margin="normal"
                    defaultValue={kgraph}
                    onChange={(e) => setKGraph(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Diversity threshold"
                    variant="outlined"
                    margin="normal"
                    defaultValue={diversityThreshold}
                    onChange={(e) =>
                      setDiversityThreshold(parseFloat(e.target.value))
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Number of hops"
                    variant="outlined"
                    margin="normal"
                    defaultValue={maxHops}
                    onChange={(e) => setMaxHops(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormControl
                  sx={{
                    width: 200,
                  }}
                >
                  <TextField
                    sx={{
                      width: 150,
                    }}
                    id="outlined-basic"
                    label="Number of possible targets"
                    variant="outlined"
                    margin="normal"
                    defaultValue={maxCombination}
                    onChange={(e) =>
                      setMaxCombination(parseInt(e.target.value))
                    }
                  />
                </FormControl>
              </div>
            </FormGroup>
            <Button
              variant="contained"
              onClick={handleOpen}
              style={{ margin: "0 auto", display: "flex" }}
              sx={{
                width: 300,
              }}
            >
              Set and submit configuration
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Confirm Graph Dataset</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to select {props.graph} graph?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={submitGraphDialog}>Confirm</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={open2} onClose={handleClose2}>
              <DialogTitle>Selected {props.graph} dataset</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Continue your analysis according to the desired function in
                  the main menu.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose2}>OK</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={open3} onClose={(e) => setOpen3(false)}>
              <DialogTitle>Error on setting the parameters</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  There was an error when setting the configuration parameters.
                  Please re-check the values and submit again!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={(e) => setOpen3(false)}>OK</Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </div>
  );
}
