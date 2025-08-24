// Global variables
let currentTree = null;
let currentAlgorithm = 'preorder';
let searchTarget = '';
let traversalPath = [];
let currentStep = 0;
let isRunning = false;
let isPaused = false;
let intervalId = null;
let heuristicValues = {};

// Generate node labels
function generateNodeLabels(count) {
    const labels = [];
    for (let i = 0; i < count; i++) {
        if (i < 26) {
            labels.push(String.fromCharCode(65 + i)); // A, B, C...
        } else {
            const firstChar = String.fromCharCode(65 + Math.floor((i - 26) / 26));
            const secondChar = String.fromCharCode(65 + (i - 26) % 26);
            labels.push(firstChar + secondChar); // AA, AB, AC...
        }
    }
    return labels;
}

// Generate custom tree based on user input
function generateCustomTree() {
    const levels = parseInt(document.getElementById('treeLevels').value) || 3;
    const totalNodes = parseInt(document.getElementById('nodeCount').value) || 7;
    const maxChildren = parseInt(document.getElementById('maxChildren').value) || 2;

    if (levels < 2 || levels > 10) {
        document.getElementById('status').textContent = 'Levels must be between 2 and 10';
        document.getElementById('status').className = 'status error';
        return;
    }

    if (totalNodes < 3 || totalNodes > 50) {
        document.getElementById('status').textContent = 'Node count must be between 3 and 50';
        document.getElementById('status').className = 'status error';
        return;
    }

    if (maxChildren < 2 || maxChildren > 5) {
        document.getElementById('status').textContent = 'Max children must be between 2 and 5';
        document.getElementById('status').className = 'status error';
        return;
    }

    const labels = generateNodeLabels(totalNodes);
    currentTree = buildFlexibleTree(labels, levels, maxChildren);
    
    // Update tree info display
    const nodeList = getAllNodes(currentTree).map(n => n.value).join(', ');
    updateTreeInfo(levels, totalNodes, nodeList);

    initializeTree();
    resetVisualization();
    
    document.getElementById('status').textContent = 
        `Generated tree with ${totalNodes} nodes and ${levels} levels`;
    document.getElementById('status').className = 'status success';
}

// Generate random tree structure
function generateRandomTree() {
    const levels = parseInt(document.getElementById('treeLevels').value) || 3;
    const totalNodes = parseInt(document.getElementById('nodeCount').value) || 7;
    const maxChildren = parseInt(document.getElementById('maxChildren').value) || 2;

    if (levels < 2 || levels > 10 || totalNodes < 3 || totalNodes > 50) {
        document.getElementById('status').textContent = 'Please check your input values';
        document.getElementById('status').className = 'status error';
        return;
    }

    const labels = generateNodeLabels(totalNodes);
    currentTree = buildRandomTree(labels, levels, maxChildren);
    
    const nodeList = getAllNodes(currentTree).map(n => n.value).join(', ');
    updateTreeInfo(levels, totalNodes, nodeList);

    initializeTree();
    resetVisualization();
    
    document.getElementById('status').textContent = 
        `Generated random tree with ${totalNodes} nodes`;
    document.getElementById('status').className = 'status success';
}

// Update tree info display
function updateTreeInfo(levels, totalNodes, nodeList) {
    const treeInfo = document.getElementById('treeInfo');
    treeInfo.innerHTML = `
        <div class="tree-info-title">Current Tree:</div>
        <div class="tree-info-details">${levels} levels, ${totalNodes} nodes</div>
        <div class="tree-info-details">Nodes: ${nodeList}</div>
    `;
}

// Build a flexible tree with custom branching
function buildFlexibleTree(labels, maxLevels, maxChildren) {
    if (labels.length === 0) return null;

    const containerWidth = 500;
    const containerHeight = Math.max(350, maxLevels * 70);
    
    let nodeIndex = 0;
    const nodes = [];

    function createNode(label, level, positionInLevel, totalInLevel) {
        const x = (containerWidth / (totalInLevel + 1)) * (positionInLevel + 1);
        const y = (containerHeight / (maxLevels + 1)) * (level + 1);

        return {
            value: label,
            x: x,
            y: y,
            children: [],
            level: level,
            cost: Math.floor(Math.random() * 10) + 1,
            gCost: 0,
            hCost: 0,
            fCost: 0
        };
    }

    // Create root
    const root = createNode(labels[nodeIndex++], 0, 0, 1);
    nodes.push(root);

    // Build level by level
    let currentLevelNodes = [root];
    
    for (let level = 1; level < maxLevels && nodeIndex < labels.length; level++) {
        const nextLevelNodes = [];
        
        for (let parent of currentLevelNodes) {
            if (nodeIndex >= labels.length) break;
            
            // Determine number of children (1 to maxChildren)
            const remainingNodes = labels.length - nodeIndex;
            const remainingParents = currentLevelNodes.length - currentLevelNodes.indexOf(parent) - 1;
            const maxPossibleChildren = Math.min(maxChildren, remainingNodes);
            
            let numChildren;
            if (remainingParents === 0) {
                // Last parent in level, give it all remaining nodes (up to max)
                numChildren = Math.min(maxPossibleChildren, remainingNodes);
            } else {
                // Distribute nodes more evenly
                numChildren = Math.min(maxChildren, Math.ceil(remainingNodes / (remainingParents + 1)));
            }

            for (let i = 0; i < numChildren && nodeIndex < labels.length; i++) {
                const child = createNode(labels[nodeIndex++], level, nextLevelNodes.length, 0);
                parent.children.push(child);
                nextLevelNodes.push(child);
            }
        }

        // Recalculate positions for this level
        nextLevelNodes.forEach((node, index) => {
            node.x = (containerWidth / (nextLevelNodes.length + 1)) * (index + 1);
        });

        currentLevelNodes = nextLevelNodes;
    }

    return root;
}

// Build a random tree structure
function buildRandomTree(labels, maxLevels, maxChildren) {
    if (labels.length === 0) return null;

    const containerWidth = 500;
    const containerHeight = Math.max(350, maxLevels * 70);
    
    let nodeIndex = 0;

    function createNode(label, level, x, y) {
        return {
            value: label,
            x: x,
            y: y,
            children: [],
            level: level,
            cost: Math.floor(Math.random() * 10) + 1,
            gCost: 0,
            hCost: 0,
            fCost: 0
        };
    }

    // Create root
    const root = createNode(labels[nodeIndex++], 0, containerWidth / 2, 50);
    const queue = [root];

    while (queue.length > 0 && nodeIndex < labels.length) {
        const parent = queue.shift();
        
        if (parent.level >= maxLevels - 1) continue;

        // Random number of children (1 to maxChildren)
        const remainingNodes = labels.length - nodeIndex;
        const maxPossible = Math.min(maxChildren, remainingNodes);
        const numChildren = Math.max(1, Math.floor(Math.random() * maxPossible) + 1);

        for (let i = 0; i < numChildren && nodeIndex < labels.length; i++) {
            const childLevel = parent.level + 1;
            const levelY = (containerHeight / (maxLevels + 1)) * (childLevel + 1);
            
            // Spread children around parent
            const spreadWidth = Math.min(200, containerWidth / (numChildren + 1));
            const startX = parent.x - (spreadWidth * numChildren) / 2;
            const childX = startX + (spreadWidth * i) + spreadWidth / 2;
            
            // Keep within bounds
            const finalX = Math.max(30, Math.min(containerWidth - 30, childX));

            const child = createNode(labels[nodeIndex++], childLevel, finalX, levelY);
            parent.children.push(child);
            queue.push(child);
        }
    }

    return root;
}

// Flatten tree for easier searching
function getAllNodes(node, nodes = []) {
    if (!node) return nodes;
    nodes.push(node);
    if (node.children) {
        node.children.forEach(child => getAllNodes(child, nodes));
    }
    return nodes;
}

// Calculate heuristic (Manhattan distance based on level and position)
function calculateHeuristic(node, target, allNodes) {
    const targetNode = allNodes.find(n => n.value === target);
    if (!targetNode) return 0;
    
    // Enhanced heuristic: level difference + position difference + random factor
    const levelDiff = Math.abs(node.level - targetNode.level) * 2;
    const posDiff = Math.abs(node.x - targetNode.x) / 50;
    const verticalDiff = Math.abs(node.y - targetNode.y) / 50;
    
    return Math.round(levelDiff + posDiff + verticalDiff);
}

// Update heuristic table display
function updateHeuristicTable(target) {
    const heuristicTable = document.getElementById('heuristicTable');
    const heuristicGrid = document.getElementById('heuristicGrid');
    
    if (currentAlgorithm === 'astar' || currentAlgorithm === 'greedy') {
        heuristicTable.classList.add('show');
        
        const allNodes = getAllNodes(currentTree);
        heuristicGrid.innerHTML = '';
        
        // Calculate and store heuristic values
        heuristicValues = {};
        allNodes.forEach(node => {
            const hValue = calculateHeuristic(node, target, allNodes);
            heuristicValues[node.value] = hValue;
            
            const item = document.createElement('div');
            item.className = 'heuristic-item';
            item.innerHTML = `
                <div class="node-name">${node.value}</div>
                <div class="h-value">h = ${hValue}</div>
            `;
            heuristicGrid.appendChild(item);
        });
    } else {
        heuristicTable.classList.remove('show');
    }
}

// Algorithm information
const algorithmInfo = {
    preorder: {
        title: "Pre-order Traversal",
        dataStructure: "Stack/Recursion",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        description: "Visit root first, then left subtree, then right subtree (Root → Left → Right). Useful for creating tree copies and prefix expressions.",
        conditions: "Tree Traversal"
    },
    inorder: {
        title: "In-order Traversal",
        dataStructure: "Stack/Recursion",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        description: "Visit left subtree, then root, then right subtree (Left → Root → Right). For BST, gives sorted sequence.",
        conditions: "Tree Traversal"
    },
    postorder: {
        title: "Post-order Traversal",
        dataStructure: "Stack/Recursion",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        description: "Visit left subtree, then right subtree, then root (Left → Right → Root). Useful for deleting nodes and calculating sizes.",
        conditions: "Tree Traversal"
    },
    bfs: {
        title: "Breadth-First Search",
        dataStructure: "Queue (FIFO)",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        description: "Explores nodes level by level, guaranteeing shortest path in unweighted graphs. Uses queue for frontier management.",
        conditions: "Uninformed Search"
    },
    dfs: {
        title: "Depth-First Search",
        dataStructure: "Stack (LIFO)",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        description: "Goes deep into each branch before backtracking. Uses stack for implementation.",
        conditions: "Uninformed Search"
    },
    bst: {
        title: "Binary Search Tree Search",
        dataStructure: "Tree Structure",
        timeComplexity: "O(log n) avg, O(n) worst",
        spaceComplexity: "O(log n) avg, O(n) worst",
        description: "Efficient search in sorted binary tree by comparing values and choosing left/right path.",
        conditions: "Tree Search"
    },
    dls: {
        title: "Depth-Limited Search",
        dataStructure: "Stack with depth limit",
        timeComplexity: "O(b^l)",
        spaceComplexity: "O(bl)",
        description: "DFS with maximum depth limit to avoid infinite paths. Useful when solution depth is known.",
        conditions: "Uninformed Search"
    },
    iddfs: {
        title: "Iterative Deepening DFS",
        dataStructure: "Stack with iterative limits",
        timeComplexity: "O(b^d)",
        spaceComplexity: "O(bd)",
        description: "Combines DFS space efficiency with BFS completeness by gradually increasing depth limit.",
        conditions: "Uninformed Search"
    },
    ucs: {
        title: "Uniform Cost Search",
        dataStructure: "Priority Queue",
        timeComplexity: "O(b^(1+⌊C*/ε⌋))",
        spaceComplexity: "O(b^(1+⌊C*/ε⌋))",
        description: "Expands nodes in order of path cost. Optimal for finding least-cost path.",
        conditions: "Uninformed Search"
    },
    astar: {
        title: "A* Search",
        dataStructure: "Priority Queue",
        timeComplexity: "O(b^d)",
        spaceComplexity: "O(b^d)",
        description: "Uses f(n) = g(n) + h(n) where g is path cost and h is heuristic. Optimal if heuristic is admissible.",
        conditions: "Informed Search"
    },
    greedy: {
        title: "Greedy Best-First Search",
        dataStructure: "Priority Queue",
        timeComplexity: "O(b^m)",
        spaceComplexity: "O(b^m)",
        description: "Uses only heuristic h(n) to guide search. Fast but not optimal.",
        conditions: "Informed Search"
    }
};

// Initialize the tree visualization
function initializeTree() {
    if (!currentTree) return;
    
    const svg = document.getElementById('treeSvg');
    svg.innerHTML = '';
    
    // Calculate dynamic viewBox based on tree size
    const allNodes = getAllNodes(currentTree);
    if (allNodes.length === 0) return;
    
    const maxX = Math.max(...allNodes.map(n => n.x)) + 80;
    const maxY = Math.max(...allNodes.map(n => n.y)) + 80;
    const minX = Math.min(...allNodes.map(n => n.x)) - 80;
    const minY = Math.min(...allNodes.map(n => n.y)) - 80;
    
    svg.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
    svg.setAttribute('style', `width: 100%; height: ${Math.max(350, maxY)}px;`);
    
    // Draw edges first
    drawEdges(currentTree, svg);
    
    // Draw nodes
    drawNodes(currentTree, svg);
}

function drawEdges(node, svg, parent = null) {
    if (!node) return;
    
    if (parent) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', parent.x);
        line.setAttribute('y1', parent.y);
        line.setAttribute('x2', node.x);
        line.setAttribute('y2', node.y);
        line.setAttribute('class', 'edge');
        line.setAttribute('id', `edge-${parent.value}-${node.value}`);
        svg.appendChild(line);
        
        // Add edge cost label for informed search algorithms
        if (currentAlgorithm === 'astar' || currentAlgorithm === 'ucs') {
            const midX = (parent.x + node.x) / 2;
            const midY = (parent.y + node.y) / 2;
            
            const costText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            costText.setAttribute('x', midX);
            costText.setAttribute('y', midY - 5);
            costText.setAttribute('class', 'edge-cost');
            costText.textContent = node.cost;
            costText.setAttribute('id', `cost-${parent.value}-${node.value}`);
            svg.appendChild(costText);
        }
    }
    
    if (node.children) {
        node.children.forEach(child => {
            drawEdges(child, svg, node);
        });
    }
}

function drawNodes(node, svg) {
    if (!node) return;
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'node');
    group.setAttribute('id', `node-${node.value}`);
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', 25);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y);
    text.textContent = node.value;
    
    group.appendChild(circle);
    group.appendChild(text);
    
    // Add g(n) and h(n) values for A* algorithm
    if (currentAlgorithm === 'astar') {
        const gText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        gText.setAttribute('x', node.x - 15);
        gText.setAttribute('y', node.y + 35);
        gText.setAttribute('class', 'cost-text');
        gText.setAttribute('id', `g-${node.value}`);
        gText.textContent = `g:${node.gCost}`;
        group.appendChild(gText);
        
        const hText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        hText.setAttribute('x', node.x + 15);
        hText.setAttribute('y', node.y + 35);
        hText.setAttribute('class', 'cost-text');
        hText.setAttribute('id', `h-${node.value}`);
        hText.textContent = `h:${node.hCost}`;
        group.appendChild(hText);
        
        const fText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fText.setAttribute('x', node.x);
        fText.setAttribute('y', node.y + 45);
        fText.setAttribute('class', 'cost-text');
        fText.setAttribute('id', `f-${node.value}`);
        fText.textContent = `f:${node.fCost}`;
        fText.style.fill = '#8b5cf6';
        group.appendChild(fText);
    }
    
    svg.appendChild(group);
    
    if (node.children) {
        node.children.forEach(child => {
            drawNodes(child, svg);
        });
    }
}

// Update node cost displays during A* visualization
function updateNodeCosts(node, gCost, hCost) {
    const gElement = document.getElementById(`g-${node.value}`);
    const hElement = document.getElementById(`h-${node.value}`);
    const fElement = document.getElementById(`f-${node.value}`);
    
    if (gElement) gElement.textContent = `g:${gCost}`;
    if (hElement) hElement.textContent = `h:${hCost}`;
    if (fElement) fElement.textContent = `f:${gCost + hCost}`;
}

// Algorithm implementations
function bfsTraversal(root, target) {
    const queue = [root];
    const path = [];
    const visited = new Set();
    
    while (queue.length > 0) {
        const node = queue.shift();
        if (visited.has(node.value)) continue;
        
        visited.add(node.value);
        const found = node.value === target;
        path.push({
            node: node.value,
            action: 'visit',
            found: found
        });
        
        if (found) break;
        
        if (node.children) {
            node.children.forEach(child => {
                if (!visited.has(child.value)) {
                    queue.push(child);
                }
            });
        }
    }
    
    return path;
}

function dfsTraversal(root, target) {
    const stack = [root];
    const path = [];
    const visited = new Set();
    
    while (stack.length > 0) {
        const node = stack.pop();
        if (visited.has(node.value)) continue;
        
        visited.add(node.value);
        const found = node.value === target;
        path.push({
            node: node.value,
            action: 'visit',
            found: found
        });
        
        if (found) break;
        
        if (node.children) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                if (!visited.has(node.children[i].value)) {
                    stack.push(node.children[i]);
                }
            }
        }
    }
    
    return path;
}

function preorderTraversal(node, target, path = []) {
    if (!node) return path;
    
    const found = node.value === target;
    path.push({
        node: node.value,
        action: 'visit',
        found: found
    });
    
    if (found) return path;
    
    if (node.children) {
        node.children.forEach(child => {
            if (!path.find(p => p.found)) {
                preorderTraversal(child, target, path);
            }
        });
    }
    
    return path;
}

function inorderTraversal(node, target, path = []) {
    if (!node) return path;
    
    // Left
    if (node.children && node.children[0]) {
        if (!path.find(p => p.found)) {
            inorderTraversal(node.children[0], target, path);
        }
    }
    
    // Root
    if (!path.find(p => p.found)) {
        const found = node.value === target;
        path.push({
            node: node.value,
            action: 'visit',
            found: found
        });
        
        if (found) return path;
    }
    
    // Right
    if (node.children && node.children[1]) {
        if (!path.find(p => p.found)) {
            inorderTraversal(node.children[1], target, path);
        }
    }
    
    return path;
}

function postorderTraversal(node, target, path = []) {
    if (!node) return path;
    
    // Left
    if (node.children && node.children[0]) {
        if (!path.find(p => p.found)) {
            postorderTraversal(node.children[0], target, path);
        }
    }
    
    // Right
    if (node.children && node.children[1]) {
        if (!path.find(p => p.found)) {
            postorderTraversal(node.children[1], target, path);
        }
    }
    
    // Root
    if (!path.find(p => p.found)) {
        const found = node.value === target;
        path.push({
            node: node.value,
            action: 'visit',
            found: found
        });
    }
    
    return path;
}

// Binary Search Tree Search
function bstSearch(root, target) {
    const path = [];
    let current = root;
    
    while (current) {
        const found = current.value === target;
        path.push({
            node: current.value,
            action: 'visit',
            found: found
        });
        
        if (found) break;
        
        // For BST, compare and go left or right
        if (target < current.value) {
            current = current.children && current.children[0];
        } else {
            current = current.children && current.children[1];
        }
    }
    
    return path;
}

// Depth-Limited Search
function depthLimitedSearch(root, target, depthLimit) {
    const path = [];
    
    function dls(node, depth) {
        if (!node || depth > depthLimit) return false;
        
        const found = node.value === target;
        path.push({
            node: node.value,
            action: 'visit',
            found: found
        });
        
        if (found) return true;
        
        if (depth < depthLimit && node.children) {
            for (let child of node.children) {
                if (dls(child, depth + 1)) return true;
            }
        }
        
        return false;
    }
    
    dls(root, 0);
    return path;
}

// Iterative Deepening DFS
function iterativeDeepeningDFS(root, target) {
    const path = [];
    const maxDepth = 10; // Reasonable limit
    
    for (let depth = 0; depth <= maxDepth; depth++) {
        const currentPath = depthLimitedSearch(root, target, depth);
        
        // Add all steps from this iteration
        currentPath.forEach(step => {
            if (!path.find(p => p.node === step.node && p.action === step.action)) {
                path.push(step);
            }
        });
        
        // If target found, break
        if (currentPath.find(p => p.found)) break;
    }
    
    return path;
}

// Uniform Cost Search
function uniformCostSearch(root, target) {
    const path = [];
    const frontier = [{node: root, cost: 0, path: []}];
    const visited = new Set();
    
    while (frontier.length > 0) {
        // Sort by cost (lowest first)
        frontier.sort((a, b) => a.cost - b.cost);
        const current = frontier.shift();
        
        if (visited.has(current.node.value)) continue;
        
        visited.add(current.node.value);
        const found = current.node.value === target;
        
        path.push({
            node: current.node.value,
            action: 'visit',
            found: found,
            cost: current.cost
        });
        
        if (found) break;
        
        if (current.node.children) {
            current.node.children.forEach(child => {
                if (!visited.has(child.value)) {
                    frontier.push({
                        node: child,
                        cost: current.cost + child.cost,
                        path: [...current.path, current.node.value]
                    });
                }
            });
        }
    }
    
    return path;
}

// A* Search with enhanced visualization
function astarSearch(root, target) {
    const path = [];
    const allNodes = getAllNodes(root);
    
    // Initialize all nodes with their heuristic values
    allNodes.forEach(node => {
        node.hCost = calculateHeuristic(node, target, allNodes);
        node.gCost = node === root ? 0 : Infinity;
        node.fCost = node.gCost + node.hCost;
    });
    
    const frontier = [{
        node: root,
        gCost: 0,
        hCost: root.hCost,
        fCost: root.hCost,
        parent: null
    }];
    const visited = new Set();
    
    while (frontier.length > 0) {
        // Sort by f-cost (g + h), then by h-cost as tiebreaker
        frontier.sort((a, b) => {
            if (a.fCost !== b.fCost) return a.fCost - b.fCost;
            return a.hCost - b.hCost;
        });
        
        const current = frontier.shift();
        
        if (visited.has(current.node.value)) continue;
        
        visited.add(current.node.value);
        
        // Update node costs
        current.node.gCost = current.gCost;
        current.node.fCost = current.fCost;
        
        const found = current.node.value === target;
        
        path.push({
            node: current.node.value,
            action: 'visit',
            found: found,
            gCost: current.gCost,
            hCost: current.hCost,
            fCost: current.fCost,
            nodeObj: current.node
        });
        
        if (found) break;
        
        if (current.node.children) {
            current.node.children.forEach(child => {
                if (!visited.has(child.value)) {
                    const tentativeGCost = current.gCost + child.cost;
                    const hCost = calculateHeuristic(child, target, allNodes);
                    const fCost = tentativeGCost + hCost;
                    
                    // Update child costs
                    child.gCost = Math.min(child.gCost, tentativeGCost);
                    child.hCost = hCost;
                    child.fCost = child.gCost + child.hCost;
                    
                    frontier.push({
                        node: child,
                        gCost: tentativeGCost,
                        hCost: hCost,
                        fCost: fCost,
                        parent: current.node
                    });
                }
            });
        }
    }
    
    return path;
}

// Greedy Best-First Search
function greedyBestFirstSearch(root, target) {
    const path = [];
    const allNodes = getAllNodes(root);
    const frontier = [{
        node: root,
        hCost: calculateHeuristic(root, target, allNodes)
    }];
    const visited = new Set();
    
    while (frontier.length > 0) {
        // Sort by heuristic cost only
        frontier.sort((a, b) => a.hCost - b.hCost);
        const current = frontier.shift();
        
        if (visited.has(current.node.value)) continue;
        
        visited.add(current.node.value);
        const found = current.node.value === target;
        
        path.push({
            node: current.node.value,
            action: 'visit',
            found: found,
            hCost: current.hCost
        });
        
        if (found) break;
        
        if (current.node.children) {
            current.node.children.forEach(child => {
                if (!visited.has(child.value)) {
                    frontier.push({
                        node: child,
                        hCost: calculateHeuristic(child, target, allNodes)
                    });
                }
            });
        }
    }
    
    return path;
}

function startVisualization() {
    if (!currentTree) {
        document.getElementById('status').textContent = 'Please generate a tree first';
        document.getElementById('status').className = 'status error';
        return;
    }

    const algorithmSelect = document.getElementById('algorithmSelect');
    const searchInput = document.getElementById('searchValue');
    
    currentAlgorithm = algorithmSelect.value;
    searchTarget = searchInput.value.toUpperCase().trim();
    
    if (!searchTarget) {
        document.getElementById('status').textContent = 'Please enter a value to search';
        document.getElementById('status').className = 'status error';
        return;
    }

    // Check if target exists in tree
    const allNodes = getAllNodes(currentTree);
    const targetExists = allNodes.some(node => node.value === searchTarget);
    
    if (!targetExists) {
        const nodeList = allNodes.map(n => n.value).join(',');
        document.getElementById('status').textContent = `Target ${searchTarget} not in tree. Available: ${nodeList}`;
        document.getElementById('status').className = 'status error';
        return;
    }
    
    // Reset visualization first
    resetVisualization(false);
    
    // Update heuristic table for A* and Greedy
    updateHeuristicTable(searchTarget);
    
    // Re-initialize tree to show cost values for A*
    initializeTree();
    
    // Generate traversal path based on selected algorithm
    switch (currentAlgorithm) {
        case 'preorder':
            traversalPath = preorderTraversal(currentTree, searchTarget);
            break;
        case 'inorder':
            traversalPath = inorderTraversal(currentTree, searchTarget);
            break;
        case 'postorder':
            traversalPath = postorderTraversal(currentTree, searchTarget);
            break;
        case 'bfs':
            traversalPath = bfsTraversal(currentTree, searchTarget);
            break;
        case 'dfs':
            traversalPath = dfsTraversal(currentTree, searchTarget);
            break;
        case 'bst':
            traversalPath = bstSearch(currentTree, searchTarget);
            break;
        case 'dls':
            const depthLimit = parseInt(document.getElementById('depthLimit').value) || 3;
            traversalPath = depthLimitedSearch(currentTree, searchTarget, depthLimit);
            break;
        case 'iddfs':
            traversalPath = iterativeDeepeningDFS(currentTree, searchTarget);
            break;
        case 'ucs':
            traversalPath = uniformCostSearch(currentTree, searchTarget);
            break;
        case 'astar':
            traversalPath = astarSearch(currentTree, searchTarget);
            break;
        case 'greedy':
            traversalPath = greedyBestFirstSearch(currentTree, searchTarget);
            break;
    }
    
    currentStep = 0;
    updateAlgorithmInfo();
    
    document.getElementById('status').textContent = `Starting ${algorithmInfo[currentAlgorithm].title}...`;
    document.getElementById('status').className = 'status info';
    
    isRunning = true;
    isPaused = false;
    document.getElementById('pauseBtn').textContent = '⏸️';
    
    // Start immediately with first step, then continue with interval
    setTimeout(() => {
        stepForward();
        intervalId = setInterval(stepForward, 1500);
    }, 500);
}

function stepForward() {
    if (currentStep >= traversalPath.length) {
        stopVisualization();
        return;
    }
    
    const step = traversalPath[currentStep];
    const nodeElement = document.getElementById(`node-${step.node}`);
    
    if (!nodeElement) {
        console.error(`Node ${step.node} not found`);
        currentStep++;
        return;
    }
    
    // Update A* cost values on the graph
    if (currentAlgorithm === 'astar' && step.nodeObj) {
        updateNodeCosts(step.nodeObj, step.gCost, step.hCost);
    }
    
    // Update node appearance
    if (step.found) {
        nodeElement.classList.add('target');
        document.getElementById('status').textContent = `Found target: ${searchTarget}!`;
        document.getElementById('status').className = 'status success';
        stopVisualization();
    } else {
        nodeElement.classList.add('current');
        setTimeout(() => {
            nodeElement.classList.remove('current');
            nodeElement.classList.add('visited');
        }, 1000);
    }
    
    // Update path display with cost information for informed search
    let pathText = '';
    if (currentAlgorithm === 'astar') {
        const pathNodes = traversalPath.slice(0, currentStep + 1).map(s => 
            `${s.node}(f:${s.fCost})`
        ).join(' → ');
        pathText = pathNodes;
    } else if (currentAlgorithm === 'ucs') {
        const pathNodes = traversalPath.slice(0, currentStep + 1).map(s => 
            `${s.node}(${s.cost || 0})`
        ).join(' → ');
        pathText = pathNodes;
    } else {
        pathText = traversalPath.slice(0, currentStep + 1).map(s => s.node).join(' → ');
    }
    
    document.getElementById('pathDisplay').textContent = pathText;
    
    // Update step counter
    document.getElementById('stepCount').textContent = currentStep + 1;
    
    currentStep++;
    
    // If this was the last step and target wasn't found
    if (currentStep >= traversalPath.length && !step.found) {
        setTimeout(() => {
            document.getElementById('status').textContent = `Completed traversal - ${searchTarget} not found`;
            document.getElementById('status').className = 'status error';
        }, 1100);
    }
}

function pausePlay() {
    if (!isRunning) return;
    
    if (isPaused) {
        isPaused = false;
        document.getElementById('pauseBtn').textContent = '⏸️';
        intervalId = setInterval(stepForward, 1500);
    } else {
        isPaused = true;
        document.getElementById('pauseBtn').textContent = '▶️';
        clearInterval(intervalId);
    }
}

function stopVisualization() {
    isRunning = false;
    isPaused = false;
    clearInterval(intervalId);
    document.getElementById('pauseBtn').textContent = '⏸️';
}

function resetVisualization(clearInput = true) {
    stopVisualization();
    
    // Reset tree visualization
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
        node.classList.remove('visited', 'current', 'target');
    });
    
    // Reset displays
    document.getElementById('pathDisplay').textContent = 'Path will appear here...';
    document.getElementById('stepCount').textContent = '0';
    
    // Hide heuristic table
    document.getElementById('heuristicTable').classList.remove('show');
    
    if (clearInput) {
        document.getElementById('searchValue').value = '';
        document.getElementById('status').textContent = 'Configure tree and select algorithm';
        document.getElementById('status').className = 'status';
    }
    
    currentStep = 0;
    traversalPath = [];
    
    // Re-initialize tree to remove cost displays
    if (currentTree) {
        initializeTree();
    }
}

function updateAlgorithmInfo() {
    const info = algorithmInfo[currentAlgorithm];
    const infoContent = document.getElementById('infoContent');
    
    infoContent.innerHTML = `
        <div class="info-text"><strong>Data Structure:</strong> ${info.dataStructure}</div>
        <div class="info-text"><strong>Time Complexity:</strong> ${info.timeComplexity}</div>
        <div class="info-text"><strong>Space Complexity:</strong> ${info.spaceComplexity}</div>
        <div class="info-text"><strong>Description:</strong> ${info.description}</div>
        <div class="info-text"><strong>Category:</strong> ${info.conditions}</div>
    `;
    
    // Show/hide depth limit input for DLS
    const depthContainer = document.getElementById('depthLimitContainer');
    if (depthContainer) {
        depthContainer.style.display = currentAlgorithm === 'dls' ? 'flex' : 'none';
    }
    
    // Hide heuristic table when not using informed search
    if (currentAlgorithm !== 'astar' && currentAlgorithm !== 'greedy') {
        document.getElementById('heuristicTable').classList.remove('show');
    }
}

// Event listeners
document.getElementById('algorithmSelect').addEventListener('change', function() {
    currentAlgorithm = this.value;
    updateAlgorithmInfo();
    if (currentTree) {
        initializeTree(); // Re-draw to show/hide cost labels
    }
});

document.getElementById('searchValue').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        startVisualization();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Generate initial tree
    const labels = generateNodeLabels(7);
    currentTree = buildFlexibleTree(labels, 3, 2);
    initializeTree();
    updateAlgorithmInfo();
});
