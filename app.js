const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const teamMemberIDs = [];

function appMenu() {

  function makeManager() {
    console.log("Time for some literal team-building:");
    inquirer.prompt([
      {
        type: "input",
        name: "managerName",
        message: "What is your manager's name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "You can't enter literally nothing here.";
        }
      },
      {
        type: "input",
        name: "managerID",
        message: "What is your manager's ID number?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            return true;
          }
          return "ID numbers can't be negative, or fractional, or non-numeric. 0 is also not a valid choice. If your manager or co-worker is insisting otherwise, please contact HR for assistance.";
        }
      },
      {
        type: "input",
        name: "managerEmail",
        message: "What is your manager's email address?",
        validate: answer => {
          const pass = answer.match(
            /\S+@\S+\.\S+/
          );
          if (pass) {
            return true;
          }
          return "Please enter a valid email address; preferably one that actually exists.";
        }
      },
      {
        type: "input",
        name: "managerOfficeNumber",
        message: "What is your manager's office number?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            return true;
          }
          return "Office numbers can't be negative, or fractional, or non-numeric. 0 is also not a valid choice. If your manager or co-worker is insisting otherwise, please contact HR for assistance.";
        }
      }
    ]).then(answers => {
      const manager = new Manager(answers.managerName, answers.managerID, answers.managerEmail, answers.managerOfficeNumber);
      teamMembers.push(manager);
      teamMemberIDs.push(answers.managerID);
      console.log("calling makeTeam()..."); 
      makeTeam();
    });
  }

  function makeTeam() {
    console.log("entering makeTeam()...");
    inquirer.prompt([
      {
        type: "list",
        name: "memberTypeChoice",
        message: "Which type of team member would you like to add?",
        choices: [
          "Engineer",
          "Intern",
          "I'm done"
        ]
      }
    ]).then(userChoice => {
      switch(userChoice.memberTypeChoice) {
      case "Engineer":
        addEngineer();
        break;
      case "Intern":
        addIntern();
        break;
      default:
        assembleTeam();
      }
    });
  }

  function addEngineer() {
    console.log("Let's add an engineer to the team:");
    inquirer.prompt([
      {
        type: "input",
        name: "engineerName",
        message: "What is the engineer's name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "This is no time for mystery, please enter an actual name.";
        }
      },
      {
        type: "input",
        name: "engineerID",
        message: "What is the engineer's ID number?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            if (teamMemberIDs.includes(answer)) {
              return "This ID is already taken. Please enter a different number.";
            } else {
              return true;
            }
          }
          return "ID numbers can't be negative, or fractional, or non-numeric. 0 is also not a valid choice. If your manager or co-worker is insisting otherwise, please contact HR for assistance.";
        }
      },
      {
        type: "input",
        name: "engineerEmail",
        message: "What is your engineer's email?",
        validate: answer => {
          const pass = answer.match(
            /\S+@\S+\.\S+/
          );
          if (pass) {
            return true;
          }
          return "Please enter a valid email address; preferably one that actually exists.";
        }
      },
      {
        type: "input",
        name: "engineerGithub",
        message: "What is your engineer's GitHub username?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "You have to enter something here. If they don't have a GitHub account, tell them to go make one right now; it takes literally 3 minutes to do.";
        }
      }
    ]).then(answers => {
      const engineer = new Engineer(answers.engineerName, answers.engineerID, answers.engineerEmail, answers.engineerGithub);
      teamMembers.push(engineer);
      teamMemberIDs.push(answers.engineerID);
      makeTeam();
    });
  }

  function addIntern() {
    console.log("Let's add an intern to the team:");
    
    inquirer.prompt([
      {
        type: "input",
        name: "internName",
        message: "What is the intern's name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "This is no time for mystery, please enter an actual name.";
        }
      },
      {
        type: "input",
        name: "internID",
        message: "What is your intern's ID number?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            if (teamMemberIDs.includes(answer)) {
              return "This ID is already taken. Please enter a different number.";
            } else {
              return true;
            }
                        
          }
          return "ID numbers can't be negative, or fractional, or non-numeric. 0 is also not a valid choice. If your manager or co-worker is insisting otherwise, please contact HR for assistance.";
        }
      },
      {
        type: "input",
        name: "internEmail",
        message: "What is your intern's email?",
        validate: answer => {
          const pass = answer.match(
            /\S+@\S+\.\S+/
          );
          if (pass) {
            return true;
          }
          return "Please enter a valid email address; preferably one that actually exists.";
        }
      },
      {
        type: "input",
        name: "internSchool",
        message: "What is your intern's school?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "This is no time for mystery, please enter an actual name.";
        }
      }
    ]).then(answers => {
      const intern = new Intern(answers.internName, answers.internID, answers.internEmail, answers.internSchool);
      teamMembers.push(intern);
      teamMemberIDs.push(answers.internID);
      makeTeam();
    });
  }

  function assembleTeam() {
    // Create the output directory if the output path doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
  }

  makeManager();
}

appMenu();