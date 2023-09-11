import React from "react";
import ForceGraph2D from "react-force-graph-2d";

interface SampleGraphVisProps {
  graphvis: {
    nodes: [];
    links: [];
  };
  width: number;
  height: number;
}

interface SampleGraphVisState {
  name: string;
  show: boolean;
  data: any[];
  headers: any[];
}

/**
 * App
 *
 * Simple react js fetch example
 */
class SampleGraphVis extends React.Component<
  SampleGraphVisProps,
  SampleGraphVisState
> {
  /**
   * constructor
   *
   * @object  @props  parent props
   * @object  @state  component state
   */
  constructor(props: SampleGraphVisProps) {
    super(props);

    this.state = {
      name: "",
      show: false,
      data: [],
      headers: [],
    };
  }

  showInfo = (e: any) => {
    const { __indexColor, x, y, vx, vy, fx, fy, ...rest } = e;
    this.setState({
      show: true,
      data: [rest],
      headers: Object.keys(rest),
    });
  };

  showLinkInfo = (e: any) => {
    const { source, target, __indexColor, __controlPoints, ...rest } = e;
    this.setState({
      show: true,
      data: [rest],
      headers: Object.keys(rest),
    });
  };

  render() {
    return (
      <div>
        {this.state.name}
        {/*this.state.show && (
          <DataTable data={this.state.data} headers={this.state.headers} />
        )*/}
        {
          <ForceGraph2D
            graphData={this.props.graphvis}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.25}
            onNodeClick={this.showInfo}
            onLinkClick={this.showLinkInfo}
            nodeLabel={"label"}
            linkLabel={"label"}
            width={this.props.width}
            height={this.props.height}
          />
        }
      </div>
    );
  }
}

export default SampleGraphVis;
