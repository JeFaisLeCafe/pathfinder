// const node = {
//   row,
//   col,
//   isVisited,
//   distance,
// };

export function djikstra(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) return false;

  let visitedNodesInOrder = [];
  startNode.distance = 0; // initialization
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // if we encounter a wall, we skip it
    if (closestNode.isWall) continue;
    // if closestNode is to infinity, then we are trapped
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function updateUnvisitedNeighbors(node, grid) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (let neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getAllNodes(grid) {
  let nodes = [];
  for (let row of grid) {
    for (let col of row) {
      nodes.push(col);
    }
  }
  return nodes;
}

function getUnvisitedNeighbors(node, grid) {
  let neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

export function getNodesInShortestPathOrder(finishNode) {
  let nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
