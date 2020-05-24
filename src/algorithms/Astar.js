import * as _ from "lodash";

export default function Astar(grid, startNode, endNode) {
  // initialization
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      grid[x][y].f = 0;
      grid[x][y].g = 0;
      grid[x][y].h = 0;
      grid[x][y].debug = "";
      grid[x][y].parent = null;
    }
  }

  return search(grid, startNode, endNode);
}

function search(grid, start, end) {
  let openList = [];
  let closedList = [];
  let visitedNodes = [];
  openList.push(start);

  while (openList.length > 0) {
    // Grab the lowest f(x) to process next
    let lowInd = 0;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i].f < openList[lowInd].f) {
        lowInd = i;
      }
    }
    let currentNode = openList[lowInd];

    // End case -- result has been found, return the traced path
    if (currentNode.row === end.row && currentNode.col === end.col) {
      let curr = currentNode;
      let ret = [];
      while (curr.parent) {
        ret.push(curr);
        curr = curr.parent;
      }
      return { shortestPath: ret.reverse(), visitedNodes };
    }

    // Normal case -- move currentNode from open to closed, process each of its neighbors
    _.remove(openList, (n) => {
      return n.col === currentNode.col && n.row === currentNode.row;
    });
    closedList.push(currentNode);
    let neighbors = getNeighbors(grid, currentNode);

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (
        closedList.find(
          (n) => neighbor.col === n.col && neighbor.row === n.row
        ) ||
        neighbor.isWall
      ) {
        // not a valid node to process, skip to next neighbor
        continue;
      }

      // g score is the shortest distance from start to current node, we need to check if
      //   the path we have arrived at this neighbor is the shortest one we have seen yet
      let gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
      let gScoreIsBest = false;

      if (
        !openList.find((n) => neighbor.col === n.col && neighbor.row === n.row)
      ) {
        // This the the first time we have arrived at this node, it must be the best
        // Also, we need to take the h (heuristic) score since we haven't done so yet

        gScoreIsBest = true;
        neighbor.h = heuristic(neighbor, end);
        openList.push(neighbor);
        visitedNodes.push(neighbor);
      } else if (gScore < neighbor.g) {
        // We have already seen the node, but last time it had a worse g (distance from start)
        gScoreIsBest = true;
      }

      if (gScoreIsBest) {
        // Found an optimal (so far) path to this node.   Store info on how we got here and
        //  just how good it really is...
        neighbor.parent = currentNode;
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
      }
    }
  }

  // No result was found -- empty array signifies failure to find path
  return [];
}

function heuristic(startNode, finishNode) {
  return (
    Math.abs(startNode.col - finishNode.col) +
    Math.abs(startNode.row - finishNode.row)
  );
}
function getNeighbors(grid, node) {
  let ret = [];
  let x = node.row;
  let y = node.col;

  if (grid[x - 1] && grid[x - 1][y]) {
    ret.push(grid[x - 1][y]);
  }
  if (grid[x + 1] && grid[x + 1][y]) {
    ret.push(grid[x + 1][y]);
  }
  if (grid[x][y - 1] && grid[x][y - 1]) {
    ret.push(grid[x][y - 1]);
  }
  if (grid[x][y + 1] && grid[x][y + 1]) {
    ret.push(grid[x][y + 1]);
  }
  return ret;
}
