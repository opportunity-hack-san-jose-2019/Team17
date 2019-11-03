class Tree {
  constructor(root) {
    this._root = root || null;
    this.level = 0;
  }

  _traverse(callback) {
    const self = this;
    function goThrough(node) {
      callback(node);
      node.children.forEach(child => {
        goThrough(child);
      });
    }
    goThrough(this._root);
  }

  _addNode(value, parentValue) {
    const newNode = {
      value,
      children: []
    };

    if (this._root === null) {
      this._root = newNode;
      this._root.level = 0;
      return;
    }

    this._traverse(node => {
      if (node.value === parentValue) {
        newNode.level = node.level + 1;
        node.children.push(newNode);
      }
    });
  }

  _removeNode(value) {
    this._traverse(node => {
      node.children.forEach((childNode, index) => {
        if (childNode.value === value) {
          node.children.splice(index, 1);
        }
      });
    });
  }

  _search(value) {
    let returnNode = "Not Found";
    this._traverse(node => {
      if (node.value === value) {
        returnNode = node;
      }
    });
    return returnNode;
  }

  _displayLeafs(parentValue) {
    const parentNode =
      typeof parentValue === "string" ? this._search(parentValue) : parentValue;
    let leafsRet = [];
    if (parentValue.children && !parentValue.children.length) {
      return parentValue;
    }

    parentNode.children.forEach(child => {
      leafsRet.push(this._displayLeafs(child));
    });

    return leafsRet.flat();
  }
}

class Node {
  constructor(value, children) {
    this.value = value;
    this.children = children;
  }
}

const tree = new Tree();

//add nodes to tree
tree._addNode("Skills");
tree._addNode("Technology", "Skills");
tree._addNode("Management", "Skills");
tree._addNode("Business", "Skills");
tree._addNode("Health", "Skills");
tree._addNode("Education", "Skills");

tree._addNode("Software Engineering", "Technology");
tree._addNode("Analyst", "Technology");
tree._addNode("Product management", "Technology");
tree._addNode("R&D", "Technology");

tree._addNode("Full-stack", "Software Engineering");
tree._addNode("DevOps", "Software Engineering");
tree._addNode("Data Science", "Software Engineering");

tree._addNode("Human Resources", "Management");
tree._addNode("Communications", "Management");
tree._addNode("Accounting", "Management");

tree._addNode("Recruiting", "Human Resources");
tree._addNode("Administration", "Human Resources");

tree._addNode("Marketing", "Business");
tree._addNode("Public Relations", "Business");

tree._addNode("Physiologist", "Health");
tree._addNode("Emergency", "Health");
tree._addNode("Nurse", "Health");

tree._addNode("Professor", "Education");

// tree._traverse((node) => {
//     console.log(node.value);
// });

console.log(tree._search("Business"));

//console.log(tree._displayLeafs('Software Engineering'));
