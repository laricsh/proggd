import React, { useState, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ForceGraph2D from "react-force-graph-2d";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import BarChartIcon from "@mui/icons-material/BarChart";
import Box from "@mui/material/Box";

interface graphvis {
  nodes: any[];
  links: any[];
}

interface constraint {
  distance: String;
  var1: string;
  var2: string;
  attr1: string;
  attr2: string;
  threshold: number;
  operator: string;
}

interface ggds {
  index: number;
  sourceGP: graphvis;
  targetGP: graphvis;
  sourceCons: constraint[];
  targetCons: constraint[];
}
export default function GGDPanel(props: any) {
  //const [answergraph, setAnswerGraph] = React.useState<graphvis>({
  //  nodes: [],
  //  links: [],
  //});
  const NODE_R = 8;
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [answergraph, setAnswerGraph] = React.useState<graphvis>();
  const [ggdstats, setGGDStats] = React.useState<any[]>([
    {
      id: 1,
      nsource: 1400,
      ntarget: 1357,
      confidence: 0.85,
      coverage: 0.6,
    },
  ]);
  const [coverageData, setCoverageData] = React.useState<any[]>([]);
  const [ggds, setGGDs] = React.useState<ggds[]>([]);
  const [DataTable, setDataTable] = React.useState<any>({
    "property-1": 1,
    "property-2": 2,
  });
  const [columns, setColumns] = React.useState(["1", "2"]);
  const [show, setShow] = React.useState(false);
  const [limitAnswer, setLimitAnswer] = React.useState(0.1);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showInfo = (e: any) => {
    const { __indexColor, index, x, y, vx, vy, fx, fy, ...rest } = e;
    //alert(JSON.stringify(rest));
    rest["variable"] = "-";
    loadInfo(rest);
    //highlightMatches(rest);
    //setHoverNode(e || null);
  };

  const highlightMatches = (rest: any) => {
    fetch("http://0.0.0.0:5000/ggdminer/highlightMatches", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    })
      .then((res) => res.json())
      .then((j) => {
        //alert(j);
        const parsej = JSON.parse(j);
        setHighlightNodes(parsej["nodes"]);
        setHighlightLinks(parsej["links"]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadInfo = (rest: any) => {
    //alert(JSON.stringify(rest));
    fetch("http://0.0.0.0:5000/ggdminer/getNodeLinkProperties", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    })
      .then((res) => res.json())
      .then((j) => {
        //alert(j);
        const parsej = JSON.parse(j);
        setDataTable(parsej);
        setColumns(Object.keys(parsej));
        setShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadGGDs = () => {
    fetch("http://0.0.0.0:5000/ggdminer/ggds")
      .then((res) => res.json())
      .then((json) => {
        // alert(json);
        console.log(JSON.parse(json));
        setGGDs(JSON.parse(json));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const paintRing = useCallback(
    (node: any, ctx: any) => {
      // add ring just for highlighted nodes
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = node === hoverNode ? "red" : "orange";
      ctx.fill();
    },
    [hoverNode]
  );

  const loadStats = () => {
    fetch("http://0.0.0.0:5000/ggdminer/ggdstats")
      .then((res) => res.json())
      .then((json) => {
        // alert(json);
        console.log(JSON.stringify(json));
        setGGDStats(json);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadGGDs();
    loadStats();
  }, []);

  const showGraph = (index: number, type: string) => {
    console.log("Show graph function" + index);
    fetch("http://0.0.0.0:5000/ggdminer/getGGDAnswerGraph", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        index: index,
        limit: limitAnswer,
        typ: type,
      }),
    })
      .then((res) => res.json())
      .then((j) => {
        //alert(j);
        const json = JSON.parse(j);
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
        setAnswerGraph({
          nodes: JSON.parse(json.nodes),
          links: obj2,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showLinkInfo = (e: any) => {
    const { source, target, __indexColor, __controlPoints, index, ...rest } = e;
    //alert(JSON.stringify(e));
    rest["variable"] = "-";
    loadInfo(rest);
    //highlightMatches(rest);
  };

  const showNodeLabel = (e: any): string => {
    const { label, id, ...rest } = e;
    return "Label:".concat(label).concat(" Variable:").concat(id);
  };

  const showLinkLabel = (e: any): string => {
    return "Label:".concat(e["label"]).concat(" Variable:").concat(e["var"]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Graph Generating Dependencies Overview</h1>
      </header>
      <Grid container spacing={1} columns={16}>
        {/* Available datasets */}
        <Grid item xs={16} md={16}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              GGDs in the dataset
            </Typography>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 700,
                "& ul": { padding: 0 },
              }}
            >
              {ggds.map((g) => (
                <div className="flex-container">
                  <Typography
                    sx={{ mt: 1, mb: 1 }}
                    variant="h6"
                    component="div"
                  >
                    {g.index}
                  </Typography>
                  <ListItem
                    key={g.index}
                    secondaryAction={
                      <Box sx={{ "& button": { m: 1 } }}>
                        <div className="columnC">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => showGraph(g.index, "validated")}
                          >
                            Show Validated
                          </Button>
                        </div>
                        <div>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => showGraph(g.index, "violated")}
                          >
                            Show Violated
                          </Button>
                        </div>
                      </Box>
                    }
                  >
                    <div className="flex-child">
                      <ForceGraph2D
                        //ref={fgRef}
                        graphData={g.sourceGP}
                        linkDirectionalArrowLength={3.5}
                        linkDirectionalArrowRelPos={3}
                        linkColor={"black"}
                        linkVisibility={true}
                        linkCurvature={0.15}
                        nodeAutoColorBy={"label"}
                        linkAutoColorBy={"label"}
                        nodeLabel={"label"}
                        linkLabel={(e) => showLinkLabel(e)}
                        nodeCanvasObjectMode={() => "after"}
                        nodeCanvasObject={(node, ctx, globalScale) => {
                          const label = node.id;
                          const fontSize = 12 / globalScale;
                          ctx.font = `${fontSize}px Sans-Serif`;
                          ctx.textAlign = "center";
                          ctx.textBaseline = "middle";
                          ctx.fillStyle = "black"; //node.color;
                          ctx.fillText(label, node.x, node.y);
                        }}
                        width={400}
                        height={300}
                      />
                      <TableContainer>
                        <Table
                          size="small"
                          sx={{
                            width: 50,
                          }}
                        >
                          <TableHead>
                            <TableRow>
                              {
                                //Object.keys(g.sourceCons[0]).map((c: any) => (
                                // <TableCell align="right">{c.toUpperCase()}</TableCell>
                                //))
                              }
                              <TableCell>DISTANCE</TableCell>
                              <TableCell>VAR 1</TableCell>
                              <TableCell>ATTR 1</TableCell>
                              <TableCell>VAR 2</TableCell>
                              <TableCell>ATTR 2</TableCell>
                              <TableCell>THRESHOLD</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {g.sourceCons.map((data: any, index: number) => (
                              <TableRow key={index}>
                                {
                                  //Object.keys(g.sourceCons[0]).map((c) => (
                                  // <TableCell align="right">{data[c]}</TableCell>
                                  //))
                                }
                                <TableCell>{data["distance"]}</TableCell>
                                <TableCell>{data["var1"]}</TableCell>
                                <TableCell>{data["attr1"]}</TableCell>
                                <TableCell>{data["var2"]}</TableCell>
                                <TableCell>{data["attr2"]}</TableCell>
                                <TableCell>{data["threshold"]}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                    <Divider orientation="vertical" flexItem />
                    <div className="flex-child">
                      <ForceGraph2D
                        //ref={fgRef}
                        graphData={g.targetGP}
                        linkDirectionalArrowLength={3.5}
                        linkDirectionalArrowRelPos={3}
                        linkColor={"black"}
                        linkVisibility={true}
                        linkCurvature={0.15}
                        nodeAutoColorBy={"label"}
                        linkAutoColorBy={"label"}
                        nodeLabel={"label"}
                        linkLabel={(e) => showLinkLabel(e)}
                        nodeCanvasObjectMode={() => "after"}
                        nodeCanvasObject={(node, ctx, globalScale) => {
                          const label = node.id;
                          const fontSize = 12 / globalScale;
                          ctx.font = `${fontSize}px Sans-Serif`;
                          ctx.textAlign = "center";
                          ctx.textBaseline = "middle";
                          ctx.fillStyle = "black"; //node.color;
                          ctx.fillText(label, node.x, node.y);
                        }}
                        width={400}
                        height={300}
                      />
                      <TableContainer>
                        <Table
                          size="small"
                          sx={{
                            width: 50,
                          }}
                        >
                          <TableHead>
                            <TableRow>
                              {
                                //Object.keys(g.sourceCons[0]).map((c: any) => (
                                // <TableCell align="right">{c.toUpperCase()}</TableCell>
                                //))
                              }
                              <TableCell>DISTANCE</TableCell>
                              <TableCell>VAR 1</TableCell>
                              <TableCell>ATTR 1</TableCell>
                              <TableCell>VAR 2</TableCell>
                              <TableCell>ATTR 2</TableCell>
                              <TableCell>THRESHOLD</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {g.targetCons.map((data: any, index: number) => (
                              <TableRow key={index}>
                                {
                                  //Object.keys(g.sourceCons[0]).map((c) => (
                                  // <TableCell align="right">{data[c]}</TableCell>
                                  //))
                                }
                                <TableCell>{data["distance"]}</TableCell>
                                <TableCell>{data["var1"]}</TableCell>
                                <TableCell>{data["attr1"]}</TableCell>
                                <TableCell>{data["var2"]}</TableCell>
                                <TableCell>{data["attr2"]}</TableCell>
                                <TableCell>{data["threshold"]}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </ListItem>
                  <Divider flexItem />
                </div>
              ))}
            </List>
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
            <div className="flex-container">
              <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
                Overview{" "}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleClickOpen}
                >
                  <HelpCenterIcon />
                </IconButton>
              </Typography>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Information about GGDs measures"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Confidence(GGD) = Number of validated source matches /
                    Number of source matches
                  </DialogContentText>
                  <DialogContentText id="alert-dialog-description">
                    Coverage(GGD) = Number of nodes and edges matched in the
                    source / Total number of nodes and edges in the graph
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </Dialog>
              <Grid container spacing={1}>
                <Grid sm={6}>
                  <div>
                    <TableContainer
                      component={Paper}
                      sx={{ width: 500 }}
                      style={{ maxHeight: 400 }}
                    >
                      <Table
                        sx={{ width: 500 }}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>GGD</TableCell>
                            <TableCell>Source matches</TableCell>
                            <TableCell>Target matches</TableCell>
                            <TableCell>Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {ggdstats.map((row: any) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {row.id}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {row.nsource}
                              </TableCell>
                              <TableCell>{row.ntarget}</TableCell>
                              <TableCell>{row.confidence}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Grid>
                <Grid sm={6}>
                  <div>
                    <BarChart
                      width={500}
                      height={300}
                      data={ggdstats}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="5 5" />
                      <XAxis dataKey="id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="coverage" fill="#8884d8" />
                    </BarChart>
                  </div>
                </Grid>
              </Grid>
            </div>
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
              Results for GGDs
            </Typography>
            <TextField
              id="standard"
              label="Sample of Answer Graph"
              defaultValue={limitAnswer}
              variant="standard"
              onChange={(e) => setLimitAnswer(parseFloat(e.target.value))}
            />
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((c: any) => (
                    <TableCell align="right">{c.toUpperCase()}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {columns.map((c) => (
                    <TableCell align="right">{DataTable[c]}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
            <ForceGraph2D
              graphData={answergraph}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0.25}
              onNodeClick={showInfo}
              onLinkClick={showLinkInfo}
              nodeAutoColorBy={"label"}
              linkAutoColorBy={"label"}
              nodeLabel={"label"}
              linkLabel={"label"}
              width={1100}
              height={600}
              nodeRelSize={NODE_R}
              autoPauseRedraw={false}
              linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
              linkDirectionalParticles={4}
              linkDirectionalParticleWidth={(link) =>
                highlightLinks.has(link) ? 4 : 0
              }
              nodeCanvasObjectMode={(node) =>
                highlightNodes.has(node) ? "before" : undefined
              }
              nodeCanvasObject={paintRing}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
