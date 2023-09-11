import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DatasetIcon from "@mui/icons-material/Dataset";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import { BubbleChart } from "@mui/icons-material";
import { ListItem, Menu, MenuItem } from "@mui/material";
import { HashRouter, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MainMenu(props: any) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  //const [selectedGraph, setSelectedGraph] = React.useState("not selected");
  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <ListItemButton component={Link} to="/">
        <ListItemIcon>
          <DatasetIcon />
        </ListItemIcon>
        <ListItemText primary="Dataset" secondary={props.graph} />
      </ListItemButton>
      <ListItemButton component={Link} to="/attribute">
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Attributes" />
      </ListItemButton>
      <ListItemButton component={Link} to="/graphpattern">
        <ListItemIcon>
          <BubbleChart />
        </ListItemIcon>
        <ListItemText primary="Graph Patterns" />
      </ListItemButton>
      <ListItemButton component={Link} to="/ggd-vis">
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="GGDs" />
      </ListItemButton>
    </React.Fragment>
  );
}
