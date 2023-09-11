import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LeftPanel from "../App/LeftPanel";
import MainMenu from "./MainMenu";
import { Routes } from "react-router";
import { HashRouter, Link, Route, useNavigate } from "react-router-dom";
import LeftBottomPanel from "../App/LeftBottomPanel";
import MainPanel from "./MainPanel";
import HomeIcon from "@mui/icons-material/Home";
import ExampleFlask from "../App/ExampleFlask";
import AttributeSummary from "../App/AttributeSummary";
import GraphPatternPanel from "../App/GraphPatternPanel";
import GGDPanel from "../App/GGDPanel";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface graphVis {
  nodes: any[];
  links: any[];
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const initialGraphVis: graphVis = {
    nodes: [
      {
        id: "1",
        label: "Select a Dataset",
        property: [],
      },
    ],
    links: [],
  };
  const [graphvis, setGraphvis] = React.useState<graphVis>(initialGraphVis);

  const [open, setOpen] = React.useState(true);
  const [graph, setGraph] = React.useState("not-selected-father");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <HashRouter>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                ProGGD - Graph Data Profiling with GGDs
              </Typography>
              <IconButton component={Link} to="/" color="inherit">
                <HomeIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <MainMenu
              graph={graph}
              setGraph={setGraph}
              graphvis={graphvis}
              setGraphvis={setGraphvis}
            />
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <MainPanel
                      graph={graph}
                      setGraph={setGraph}
                      graphvis={graphvis}
                      setGraphvis={setGraphvis}
                    />
                  }
                />
                <Route
                  path="/graphpattern"
                  element={
                    <GraphPatternPanel graph={graph} graphvis={graphvis} />
                  }
                />
                <Route
                  path="/attribute"
                  element={
                    <AttributeSummary graph={graph} graphvis={graphvis} />
                  }
                />
                <Route
                  path="/summary"
                  element={<LeftBottomPanel name={"larissa"} />}
                />
                <Route
                  path="/ggd-vis"
                  element={<GGDPanel graph={graph} graphvis={graphvis} />}
                />
              </Routes>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </HashRouter>
  );
}
