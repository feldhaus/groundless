var AI = {
    
    // depth-first search
    /*
    dfs: function (grid, playerPosition, targetPosition, size) {

        var start = this.getState(grid, playerPosition);
        var frontier = [start.id];
        var data = {[start.id]: start};
        
        while (frontier.length > 0) {
            
            var current = data[frontier.pop()]
            current.explored = true;
            
            var total = this.getTotal(current.grid);
            if (total == 0) {
                return this.reconstructPath(start, current);
            }
            
            var neighbors = this.getNeighbors(current.grid, current.position, targetPosition, size);
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (data[neighbor.id] === undefined || data[neighbor.id].explored === undefined) {
                    neighbor.parent = current;
                    frontier.push(neighbor.id);
                    data[neighbor.id] = neighbor;
                }
            }
        }
        return false;
    },
    */
    
    // a-star search (a*)
    ast: function (grid, playerPosition, targetPosition, size) {
        
        var start = this.getState(grid, playerPosition);
        start.priority = 0;
        
        var frontier = new PriorityQueue({comparator: function(a, b) { return a.priority - b.priority; }});
        frontier.queue(start);
        var costSoFar = {[start.id]: 0};
        
        while (frontier.length > 0) {
            current = frontier.dequeue();
             
            var total = this.getTotal(current.grid);
            //console.log(total,'=',current.position.x,current.position.y,'/',targetPosition.x,targetPosition.y);
            if (total === 0 && current.position.x === targetPosition.x && current.position.y === targetPosition.y) {
                return this.reconstructPath(start, current);
            }
             
            var neighbors = this.getNeighbors(current.grid, current.position, targetPosition, size);
            for (var i = 0; i < neighbors.length; i++) {
                 
                var newCost = costSoFar[current.id] + 1;
                var neighbor = neighbors[i];
                
                if (costSoFar[neighbor.id] === undefined || newCost < costSoFar[neighbor.id]) {
                    costSoFar[neighbor.id] = newCost;
                    neighbor.parent = current;
                    var priority = newCost + this.getTotal(neighbors[i].grid);
                    neighbor.priority = priority;
                    frontier.queue(neighbor);
                }
            }
        }
    },
    
    // return a new state
    getState: function (grid, position) {
        return {
            id: this.getId(grid, position),
            grid: grid,
            position: position,
            parent: null
        };
    },
    
    // return the total of tiles remained
    getTotal: function (grid) {
        var sum = 0;
        for (var i = 0; i < grid.length; i++) {
            if (grid[i] > 0) {
                sum += grid[i];
            }
        }
        return sum;
    },
    
    // return the id from position + player position
    getId: function (grid, pos) {
        var id = "(" + pos.x + "," + pos.y + ") ";
        for (var i = 0; i < grid.length; i++) {
            id += grid[i];
        }
        return id;
    },
    
    // return if column and row is in grid bounds
    inBounds: function (node, size) {
        return node.row >= 0 && node.row < size.rows && node.col >= 0 && node.col < size.cols;
    },
    
    // get all neighbors and filter them
    getNeighbors: function(grid, position, startPosition, size) {
        var possible = [
            {col: position.x, row: position.y - 1},
            {col: position.x, row: position.y + 1},
            {col: position.x - 1, row: position.y},
            {col: position.x + 1, row: position.y}
        ];
        
        var neighbors = [];
        for (var i = 0; i < possible.length; i++) {
            var n = possible[i];
            
            if (this.inBounds(n, size)) {
                if ((grid[n.row * size.cols + n.col] > 0) || (n.row == startPosition.y && n.col == startPosition.x && this.getTotal(grid) === 1)) {
                    var clone = grid.slice(0);
                    clone[position.y * size.cols + position.x]--;
                    neighbors.push(this.getState(clone, new Phaser.Point(n.col, n.row)));
                }
            }
        }
        
        return neighbors;
    },
    
    // return the directions to resolve the grid
    reconstructPath: function (start, goal) {
        var current = goal;
        var path = [];
        
        while (current.id !== start.id) {
            if (current.position.y < current.parent.position.y) {
                path.push('up');
            } else if (current.position.y > current.parent.position.y) {
                path.push('down');
            } else if (current.position.x < current.parent.position.x) {
                path.push('left');
            } else if (current.position.x > current.parent.position.x) {
                path.push('right');
            }
            current = current.parent;
        }
        
        path.reverse();
        
        return path;
    },
    
    debug: function (grid, size) {
        console.log('  | 0 1 2 3 4 5 6 7 8 9');
        console.log('-------------------------------------');
        for (var i = 0; i < size.rows; i++) {
            var line = i + ' | ';
            for (var j = 0; j < size.cols; j++) {
                line += grid[i * size.cols + j] + ' ';
            }
            console.log(line);
        }
    }
};