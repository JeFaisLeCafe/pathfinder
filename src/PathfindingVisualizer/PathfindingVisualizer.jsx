import React from "react";
import Node from "./Node";
import Title from "./Title";
import styled from "styled-components";
import { djikstra, getNodesInShortestPathOrder } from "../algorithms/djikstra";
import Astar from "../algorithms/Astar";
import * as _ from "lodash";
import Footer from "./Footer";

const Button = styled.button`
  padding: 7px 15px;
  font-size: 25px;
  margin: 10px;
  background-color: #011638;
  color: white;
  border: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

  :hover {
    cursor: pointer;
    background-color: #d2a1b8;
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const BigContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Content = styled.div`
  max-width: 95vw;
`;
const GRID_COL_NUMBER = 30;
const GRID_ROW_NUMBER = 15;
const START_NODE_COL = 5;
const START_NODE_ROW = 5;
const FINISH_NODE_COL = GRID_COL_NUMBER - 5;
const FINISH_NODE_ROW = GRID_ROW_NUMBER - 5;
const TIME_PARAM = 50;
export default class PathfindingVisualizer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      isDraggingStart: false,
      isDraggingFinish: false,
      startNode: { col: START_NODE_COL, row: START_NODE_ROW },
      finishNode: { col: FINISH_NODE_COL, row: FINISH_NODE_ROW },
    };
    this.visualizeDjikstra = this.visualizeDjikstra.bind(this);
    this.animateShortestPath = this.animateShortestPath.bind(this);
    this.reset = this.reset.bind(this);

    this.visualizeAstar = this.visualizeAstar.bind(this);
    this.generateRandomWall = this.generateRandomWall.bind(this);
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  getInitialGrid() {
    let grid = [];
    for (let row = 0; row < GRID_ROW_NUMBER; row++) {
      let currentRow = [];
      for (let col = 0; col < GRID_COL_NUMBER; col++) {
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
      isStart:
        row === this.state.startNode.row && col === this.state.startNode.col,
      isFinish:
        row === this.state.finishNode.row && col === this.state.finishNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  resetNode(node) {
    return {
      ...node,
      isVisited: false,
      isShortedPath: false,
      display: Infinity,
      previousNode: null,
    };
  }

  resetIsVisited() {
    let newGrid = _.cloneDeep(this.state.grid);
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        const resetedNode = this.resetNode(newGrid[i][j]);
        newGrid[i][j] = resetedNode;
      }
    }
    this.setState({ grid: newGrid });
    return newGrid;
  }

  visualizeAstar() {
    let grid = _.cloneDeep(this.resetIsVisited());
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.finishNode.row][this.state.finishNode.col];
    //const visitedNodesInOrder = djikstra(grid, startNode, finishNode);
    //const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    //this.animateAstar(visitedNodesInOrder, nodesInShortestPathOrder);
    const AstarNodes = Astar(grid, startNode, finishNode); // {visitedNodes: [], shortestPath: []}
    this.animateAstar(AstarNodes);
  }

  animateAstar(AstarNodes) {
    console.log("Astar", AstarNodes);
    for (let i = 0; i <= AstarNodes.visitedNodes.length; i++) {
      if (i === AstarNodes.visitedNodes.length) {
        setTimeout(() => {
          this.animateShortestPath(AstarNodes.shortestPath);
        }, TIME_PARAM * i);
        return;
      }
      setTimeout(() => {
        const node = AstarNodes.visitedNodes[i];
        const newGrid = JSON.parse(JSON.stringify(this.state.grid));
        const newNode = { ...node, isVisited: true };
        newGrid[node.row][node.col] = newNode;
        this.setState({ grid: newGrid });
      }, TIME_PARAM * i);
    }
  }

  visualizeDjikstra() {
    let grid = _.cloneDeep(this.resetIsVisited());
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.finishNode.row][this.state.finishNode.col];
    const visitedNodesInOrder = djikstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    this.animateDjikstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const newGrid = JSON.parse(JSON.stringify(this.state.grid));
        const newNode = { ...node, isShortedPath: true };
        newGrid[node.row][node.col] = newNode;
        this.setState({ grid: newGrid });
      }, TIME_PARAM * i);
    }
  }

  animateDjikstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, TIME_PARAM * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const newGrid = JSON.parse(JSON.stringify(this.state.grid));
        const newNode = { ...node, isVisited: true };
        newGrid[node.row][node.col] = newNode;
        this.setState({ grid: newGrid });
      }, TIME_PARAM * i);
    }
  }

  getNewGridWithWallToggled(grid, row, col) {
    let newGrid = _.cloneDeep(grid);
    let node = newGrid[row][col];
    if (!node.isStart && !node.isFinish) {
      const newNode = { ...node, isWall: !node.isWall };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  }
  getNewGridWithStartMoved(grid, row, col) {
    let newGrid = _.cloneDeep(grid);
    let node = newGrid[row][col];
    if (!node.isFinish) {
      const newNode = { ...node, isStart: true };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  }

  handleRightClick(row, col) {
    let newGrid = _.cloneDeep(this.state.grid);
    let node = newGrid[row][col];
    // we handle here all the different possibilities after a left click
    // first, cases where we are moving the start/finish, and setting a new start/finish
    if (this.state.isDraggingStart && !node.isFinish) {
      node = { ...node, isStart: true, isWall: false };
      this.setState({ isDraggingStart: false, startNode: { row, col } });
    } else if (this.state.isDraggingFinish && !node.isStart) {
      node = { ...node, isFinish: true, isWall: false };
      this.setState({ isDraggingFinish: false, finishNode: { col, row } });
    } //then cases where we are starting to move, ie right clicking on start/finish
    else if (
      !this.state.isDraggingStart &&
      !this.state.isDraggingFinish &&
      node.isStart
    ) {
      node = { ...node, isStart: false, isWall: false };
      this.setState({ isDraggingStart: true });
    } else if (
      !this.state.isDraggingStart &&
      !this.state.isDraggingFinish &&
      node.isFinish
    ) {
      node = { ...node, isFinish: false, isWall: false };
      this.setState({ isDraggingFinish: true });
    }
    newGrid[row][col] = node;
    this.setState({ grid: newGrid });
    return false;
  }

  handleMouseDown(row, col) {
    const node = this.state.grid[row][col];
    if (node.isStart) {
      // we want to drag and drop the start
      this.setState({ isDraggingStart: true });
    } else if (node.isFinish) {
      this.setState({ isDraggingFinish: true });
    } else {
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
      this.setState({ mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;

    let newGrid = this.state.grid;
    const node = newGrid[row][col];
    if (this.state.isDraggingStart) {
      // we want to drag and drop the start
      newGrid = this.getNewGridWithStartMoved(newGrid, row, col);
    } else if (node.isFinish) {
      this.setState({ isDraggingFinish: true });
    } else {
      newGrid = this.getNewGridWithWallToggled(newGrid, row, col);
    }
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({
      mouseIsPressed: false,
    });
  }

  generateRandomWall() {
    this.reset();

    const grid = _.cloneDeep(this.state.grid);
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        if (Math.random() < 0.1 && !cell.isStart && !cell.isFinish) {
          grid[i][j] = { ...grid[i][j], isWall: true };
        }
      }
    }
    this.setState({ grid });
  }

  reset() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  render() {
    return (
      <BigContainer>
        <Container>
          <Title />
          <Content>
            <Button onClick={this.visualizeDjikstra}>
              Visualize Djikstra's algorithm
            </Button>
            <Button onClick={this.visualizeAstar}>
              Visualize A* algorithm
            </Button>
            <Button onClick={this.generateRandomWall}>
              Generate random Laby
            </Button>
            <Button onClick={this.reset}>Reset</Button>
            {this.state.grid.map((row, rowInd) => {
              return (
                <Row key={rowInd}>
                  {row.map((node, colInd) => {
                    return (
                      <Node
                        key={colInd}
                        {...node}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          this.handleRightClick(rowInd, colInd);
                        }}
                        onMouseDown={(e) => {
                          // this is only for left click mousedown
                          if (e.button === 0) {
                            this.handleMouseDown(rowInd, colInd);
                          }
                        }}
                        onMouseUp={() => this.handleMouseUp()}
                        onMouseEnter={() =>
                          this.handleMouseEnter(rowInd, colInd)
                        }
                      />
                    );
                  })}
                </Row>
              );
            })}
          </Content>
        </Container>
        <Footer />
      </BigContainer>
    );
  }
}
