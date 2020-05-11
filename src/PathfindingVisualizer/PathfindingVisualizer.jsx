import React from "react";
import Node from "./Node/Node";
import styled from "styled-components";
import { djikstra, getNodesInShortestPathOrder } from "../algorithms/djikstra";

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Content = styled.div`
  max-width: 95vw;
`;
const START_NODE_COL = 5;
const START_NODE_ROW = 5;
const FINISH_NODE_COL = 15;
const FINISH_NODE_ROW = 5;

export default class PathfindingVisualizer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
    this.visualizeDjikstra = this.visualizeDjikstra.bind(this);
    this.animateShortestPath = this.animateShortestPath.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
    console.log("mounting component");
  }

  getInitialGrid() {
    let grid = [];
    for (let row = 0; row < 20; row++) {
      let currentRow = [];
      for (let col = 0; col < 40; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row) {
    return {
      col,
      row,
      isStart: row === START_NODE_COL && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  resetIsVisited(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (i < 1 && j < 5) {
          console.log("before node", grid[i][j]);
        }
        let node = grid[i][j];
        node.isVisited = false;
        if (i < 1 && j < 5) {
          console.log("actual node", node);
        }
        grid[i][j] = node;
        if (i < 1 && j < 5) {
          console.log("after node", grid[i][j]);
        }
      }
    }
  }

  visualizeDjikstra() {
    let grid = [...this.state.grid];
    console.log("before all", JSON.stringify(grid));
    this.resetIsVisited(grid);
    console.log("before almost all", grid);
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = djikstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    this.animateDjikstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  animateShortestPath(nodesInShortestPathOrder) {
    console.log("in the shotest path");
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const newGrid = JSON.parse(JSON.stringify(this.state.grid));
        const newNode = { ...node, isShortedPath: true };
        newGrid[node.row][node.col] = newNode;
        this.setState({ grid: newGrid });
      }, 50 * i);
    }
  }

  animateDjikstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 50 * i);
        return;
      }
      setTimeout(() => {
        if (i < 2) {
          const node = visitedNodesInOrder[i];
          console.log("dans la boucle", node);
          const newGrid = JSON.parse(JSON.stringify(this.state.grid));
          const newNode = { ...node, isVisited: true };
          console.log("old grid", newGrid);
          newGrid[node.row][node.col] = newNode;
          console.log("newgrid", newGrid);
          this.setState({ grid: newGrid });
        }
      }, 50 * i);
    }
    // let locationInArray = 0;
    //
    // function delayedOutput() {
    //   // now we replace the correct modified node in state
    //   const newGrid = this.state.grid.slice();
    //   const node = visitedNodesInOrder[locationInArray];
    //   console.log("in da boucle", node);
    //   const newNode = { ...node, isVisited: true };
    //   newGrid[node.row][node.col] = newNode;
    //   console.log("New GRID", newGrid);
    //   this.setState({ grid: newGrid });
    //
    //   locationInArray++;
    //   if (locationInArray < visitedNodesInOrder.length) {
    //     setTimeout(delayedOutput, 1000);
    //   }
    // }
    // delayedOutput();
  }

  getNewGridWithWallToggled(grid, row, col) {
    console.log("getting new grid wall stuff", grid);
    let newGrid = grid.slice();
    let node = newGrid[row][col];
    if (!node.isStart && !node.isFinish) {
      console.log("dans le if");
      const newNode = { ...node, isWall: !node.isWall };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  }

  handleMouseDown(row, col) {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
    this.setState({ mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  reset() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  render() {
    return (
      <Container>
        <Content>
          <button onClick={this.visualizeDjikstra}>
            Visualize Djikstra's algorithm
          </button>
          <button onClick={this.reset}>Reset</button>
          {this.state.grid.map((row, rowInd) => {
            return (
              <Row key={rowInd}>
                {row.map((node, colInd) => {
                  return (
                    <Node
                      key={colInd}
                      {...node}
                      onMouseDown={() => this.handleMouseDown(rowInd, colInd)}
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseEnter={() => this.handleMouseEnter(rowInd, colInd)}
                    />
                  );
                })}
              </Row>
            );
          })}
        </Content>
      </Container>
    );
  }
}
