class Tree {
    constructor(root) {
        this._root = root || null;
        this.level = 0;
        this.parent = null;
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


    _addNode(value, parentValue) {
        const newNode = {
            value,
            children: [],
        };

        if (this._root === null) {
            this._root = newNode;
            this._root.level = 0;
            this._root.parent = null;
            return;
        }

        this._traverse((node) => {
            if (node.value === parentValue) {
                newNode.level = node.level + 1;
                newNode.parent = node;
                node.children.push(newNode);
            }
        });
    }

    _removeNode(value) {
        this._traverse((node) => {
            node.children.forEach((childNode, index) => {
                if (childNode.value === value) {
                    node.children.splice(index, 1);
                }
            });
        })
    }

    _search(value) {
        let returnNode = 'Not Found';
        this._traverse((node) => {
            if (node.value === value) {
                returnNode = node;
            }
        });
        return returnNode;
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

//console.log(tree._search('Business'));

//console.log(tree._displayLeafs('Software Engineering'));

/*
Slot allocation logic
*/
var studentSkills =
    [{
        "ID": 1,
        "skill": 'DevOps',
        "assigned": false
    }, {
        "ID": 2,
        "skill": 'Software Engineering',
        "assigned": false,
    }, {
        "ID": 3,
        "skill": 'Full-stack',
        "assigned": false,
    }, {
        "ID": 4,
        "skill": 'Business',
        "assigned": false,
    }, {
        "ID": 5,
        "skill": 'Recruiting',
        "assigned": false,
    }, {
        "ID": 6,
        "skill": 'Physiologist',
        "assigned": false,
    }, {
        "ID": 7,
        "skill": 'Education',
        "assigned": false,
    }, {
        "ID": 8,
        "skill": 'Professor',
        "assigned": false,
    }, {
        "ID": 9,
        "skill": 'R&D',
        "assigned": false,
    }, {
        "ID": 10,
        "skill": 'Accounting',
        "assigned": false,
    }, {
        "ID": 11,
        "skill": 'Marketing',
        "assigned": false,
    }, {
        "ID": 12,
        "skill": 'Health',
        "assigned": false,
    }]

var interviewerSkills =
    [{
        "ID": 1,
        "skill": 'DevOps',
        "studentID": []
    }, {
        "ID": 2,
        "skill": 'Technology',
        "studentID": [],
    }, {
        "ID": 3,
        "skill": 'Software Engineering',
        "studentID": [],
    }, {
        "ID": 4,
        "skill": 'Human Resources',
        "studentID": [],
    }, {
        "ID": 5,
        "skill": 'Business',
        "studentID": [],
    }, {
        "ID": 6,
        "skill": 'Physiologist',
        "studentID": [],
    }, {
        "ID": 7,
        "skill": 'Professor',
        "studentID": [],
    }]

var numberOfStudents = 12;

var studentsAssigned = 0;

var deepest = 3;

//get level from tree 

function getLevel(skill) {

    return tree._search(skill).level;

}

function getParentSkill(skill) {
    if (tree._search(skill).parent != null) {
        //   console.log(tree._search(skill).parent.value);
        return tree._search(skill).parent.value;
    }
    return null;
}

function setAllLevel() {

    for (const interviewskill of interviewerSkills) {
        interviewskill.level = getLevel(interviewskill.skill);
    }

    for (const studentSkill of studentSkills) {
        studentSkill.level = getLevel(studentSkill.skill);
    }
}


function moveLevelUp(deepest) {

    // let leveldown = interviewerSkills.filter((data) => {
    //     return data.level > deepest;
    // })
    // leveldown = leveldown.map((data) => {
    //     data.level--;
    //     data.skill = getParentSkill(data.skill)
    //     return data;
    // })
    // const originalArray = interviewerSkills.filter((data) => {
    //     return data.level <= deepest;
    // })

    // interviewerSkills = [...originalArray, ...leveldown];

    for (var x in interviewerSkills) {
        if (interviewerSkills[x].level > deepest) {
            interviewerSkills[x].level--; //interviewskill.level != 0 && 
            interviewerSkills[x].skill = getParentSkill(interviewerSkills[x].skill);
            if (interviewerSkills[x].level > 1) {
                interviewerSkills.push(interviewerSkills.splice(x, 1)[0]);

            }
        }
    }
    // for (const interviewskill of interviewerSkills) {
    //     const newinterviewskill = interviewskill;


    //     if (newinterviewskill.level > deepest) {
    //         newinterviewskill.level--; //interviewskill.level != 0 && 
    //         newinterviewskill.skill = getParentSkill(newinterviewskill.skill);
    //     }
    //     interviewerSkills.push(newinterviewskill);

    // }

    for (const studentSkill of studentSkills) {
        if (studentSkill.level > deepest) {
            studentSkill.level--; //interviewskill.level != 0 &&
            studentSkill.skill = getParentSkill(studentSkill.skill);
        }
    }
}

setAllLevel();
// moveLevelUp(2);
// console.log(interviewerSkills);
// console.log("-----------------");
// console.log(studentSkills);
// moveLevelUp(1);
// console.log(interviewerSkills);
// console.log("-----------------");
// console.log(studentSkills);

while (numberOfStudents != studentsAssigned) {
    for (const studentSkill of studentSkills) {
        if (!studentSkill.assigned) {
            const sLevel = getLevel(studentSkill.skill); //3

            if (sLevel == deepest) { // true

                for (var interviewerSkill of interviewerSkills) {
                    const iLevel = getLevel(interviewerSkill.skill);  // 3
                    //node.children.push(newNode);
                    if (interviewerSkill.skill == studentSkill.skill && iLevel == sLevel && interviewerSkill.studentID.length < 2) {
                        // MATCH !!
                        studentsAssigned++;
                        studentSkill.assigned = true;
                        interviewerSkill.studentID.push(studentSkill.ID);
                        //console.log("interviewerSkill");
                        //console.log(interviewerSkill);
                        break;
                    }
                }

            }
        }
    }
    //1

    deepest--;
    // if (deepest == 0) break;
    // console.log("Deepest: " + deepest);
    // console.log("----------int-------");
    // console.log(interviewerSkills);
    // console.log("--------std---------");
    // console.log(studentSkills);
    // console.log("+++++++++++++++++++");

    moveLevelUp(deepest);  // [2,]

    // console.log("After level up");
    // console.log("Deepest: " + deepest);
    // console.log("----------int-------");
    // console.log(interviewerSkills);
    // console.log("--------std---------");
    // console.log(studentSkills);
    // console.log("+++++++++++++++++++");


}

console.log(interviewerSkills);
console.log("-----------------");
console.log(studentSkills);

