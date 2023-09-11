import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ForceGraph2D from "react-force-graph-2d";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StorageIcon from "@mui/icons-material/Storage";
import ListItemText from "@mui/material/ListItemText";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import SearchIcon from "@mui/icons-material/Search";

interface graphvis {
  nodes: any[];
  links: any[];
}

interface subgraph {
  i: number;
  graph: graphvis;
}

export default function GraphPatternPanel(props: any) {
  const [frequentSubgraphs, setFrequentSubgraphs] = React.useState<subgraph[]>(
    []
  );
  const [candGraph, setCandGraph] = React.useState<graphvis>();
  const [answergraph, setAnswerGraph] = React.useState();
  const [DataTable, setDataTable] = React.useState<any>({
    "property-1": 1,
    "property-2": 2,
  });
  const [columns, setColumns] = React.useState(["1", "2"]);
  const [show, setShow] = React.useState(false);
  const [limitAnswer, setLimitAnswer] = React.useState(0.1);
  const [query, setQuery] = React.useState(
    "CONSTRUCT (a)-[e]->(b) MATCH (a:ProductAmazon)-[e:producedbyAmazon]->(b:ManufacturerAmazon) ON Amazon"
  );
  const [queryData, setQueryData] = React.useState<graphvis>();
  const [showinfo, setShowInfo] = useState(true);
  const [datashow, setDataShow] = React.useState<any>();
  const [header, setHeaders] = React.useState<string[]>([]);

  const showAnswerGraph = (index: number) => {
    fetch("http://0.0.0.0:5000/ggdminer/getAnswerGraph", {
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
      }),
    })
      .then((res) => res.json())
      .then((j) => {
        //alert(j);
        setAnswerGraph(JSON.parse(j));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showInfoQuery = (e: any) => {
    const { __indexColor, x, y, vx, vy, fx, fy, ...rest } = e;
    setShowInfo(true);
    setDataShow(rest);
    setHeaders(Object.keys(rest));
  };

  const showLinkInfoQuery = (e: any) => {
    const { source, target, __indexColor, __controlPoints, ...rest } = e;
    setShowInfo(true);
    setDataShow(rest);
    setHeaders(Object.keys(rest));
  };

  const submitConstructQuery = () => {
    fetch("http://0.0.0.0:5000/gcore/query/construct", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query, limit: 50 }),
    })
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
        setQueryData({
          nodes: JSON.parse(json.nodes),
          links: obj2,
        });
        console.log(JSON.parse(json));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadFrequentSubgraphs = () => {
    fetch("http://0.0.0.0:5000/ggdminer/frequentSubgraphs")
      .then((res) => res.json())
      .then((json) => {
        const r = JSON.parse(json);
        setFrequentSubgraphs(r.Subgraph);
        setCandGraph(r.CandidateGraph);
        console.log(frequentSubgraphs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadFrequentSubgraphs();
  }, []);

  const loadInfo = (rest: any) => {
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

  const showInfo = (e: any) => {
    const { __indexColor, index, x, y, vx, vy, fx, fy, ...rest } = e;
    //alert(JSON.stringify(rest));
    loadInfo(rest);
  };

  const showLinkInfo = (e: any) => {
    const { source, target, __indexColor, __controlPoints, index, ...rest } = e;
    //alert(JSON.stringify(e));
    loadInfo(rest);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Graph patterns of {props.graph}</h1>
      </header>
      <Grid container spacing={1} columns={15}>
        {/* Available datasets */}
        <Grid item xs={10} md={10}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Frequent Subgraphs
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
              {frequentSubgraphs.map((g) => (
                <div>
                  <ListItem
                    key={g.i}
                    secondaryAction={
                      <Button
                        variant="outlined"
                        onClick={(e) => showAnswerGraph(g.i)}
                      >
                        Show
                      </Button>
                    }
                  >
                    <Typography
                      sx={{ mt: 1, mb: 1 }}
                      variant="h6"
                      component="div"
                    >
                      Subgraph {g.i}
                    </Typography>
                    <ForceGraph2D
                      //ref={fgRef}
                      graphData={g.graph}
                      linkDirectionalArrowLength={3.5}
                      linkDirectionalArrowRelPos={3}
                      linkColor={"black"}
                      linkVisibility={true}
                      linkCurvature={0.15}
                      nodeAutoColorBy={"label"}
                      linkLabel={"label"}
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
                      width={700}
                      height={300}
                    />
                  </ListItem>
                  <Divider flexItem />
                </div>
              ))}
            </List>
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
              Candidate Graph
            </Typography>
            <ForceGraph2D
              //ref={fgRef}
              graphData={candGraph}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={3}
              linkColor={"black"}
              linkVisibility={true}
              linkCurvature={0.15}
              linkLabel={"similarity"}
              onNodeClick={(e) => showAnswerGraph(e["index"])}
              nodeCanvasObjectMode={() => "after"}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.index;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black"; //node.color;
                ctx.fillText(label, node.x, node.y);
              }}
              width={700}
              height={500}
            />
          </Paper>
        </Grid>
        <Grid item xs={15} md={15}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Results for frequent subgraphs
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
              nodeLabel={"label"}
              linkLabel={"label"}
              nodeAutoColorBy={"label"}
              width={1100}
              height={600}
            />
          </Paper>
        </Grid>
        <Grid item xs={15} md={15}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h5" component="div">
              Query panel
            </Typography>
            <TextField
              id="standard"
              label="Graph pattern query"
              defaultValue={query}
              variant="standard"
              onChange={(e) => setQuery(e.target.value)}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={submitConstructQuery}
            >
              <SearchIcon />
            </IconButton>
            {showinfo && (
              <Table>
                <TableHead>
                  <TableRow>
                    {header.map((c: any) => (
                      <TableCell align="right">{c.toUpperCase()}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {header.map((c) => (
                      <TableCell align="right">{datashow[c]}</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            )}

            <ForceGraph2D
              graphData={queryData}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0.25}
              onNodeClick={showInfoQuery}
              onLinkClick={showLinkInfoQuery}
              nodeLabel={"label"}
              linkLabel={"label"}
              width={1100}
              height={600}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
