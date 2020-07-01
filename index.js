const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

//connection to mysql
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password:"password",
    database:"employee_db"
    });

    connection.connect((err)=>{
        if(err)throw err;
        console.log("We have been connected: ",connection.threadId);
        
    mainMenu();
});

//function to track the employees        
    const mainMenu = () =>{
        inquirer.prompt({
            type:"list",
            message:"What would you like to do",
            choices:[
                "view all departments",
                "view all roles",
                "view all employees",
                "add department",
                "add role",
                "add employee",
                "update employee role",
                "update employee manager",
                "delete department",
                "delete role",
                "delete employee"
                ],
                name:"menuChoice",
        })
        .then(({menuChoice})=>{
            console.log(menuChoice);
           
            switch(menuChoice) { 
                case "view all departments":
                    viewAllDepartments().then((res)=>{
                        console.table(res);
                        mainMenu();
                    });
                    break;
                 
                case "view all roles": 
                    viewAllRoles().then((res)=>{
                        
                       console.table(res);         
                       mainMenu();
                   })  

                    break;

                case "view all employees": 
                    viewAllEmployees().then((res)=>{
                        console.table(res);
                       mainMenu();
                    })  

                    break;

                case "add department": 
                      deptMenu();
                      break;               


                case "add role": 
                      roleMenu();
                      break;  

                case "add employee":
                      employeeMenu();
                      break;
 
                case "delete department":
                     chooseDepartment().then((resId)=>{
                     deleteDepartment(resId).then((response)=>{
                     mainMenu()
                     });
                     });
                     break;
     
                case "delete role":
                    chooseRole().then((resId)=>{
                    deleteRole(resId).then((response)=>{
                        console.log(response);
                        
                        mainMenu();
                    })
                 });
                    break;

                 case "delete employee":
                    chooseEmployee().then((resId)=>{
                    deleteEmployee(resId).then((response)=>{
                    console.log(response);
                    mainMenu();
                    });
                });
                    break;    

                case "update employee role":
                    chooseEmployeeRole().then((resId)=>{
                    updateEmployeeRole(resId).then((response)=>{
                            console.log(response);
                            mainMenu();
                        });
                    });
                    break;
        
                case "update employee manager":
                    chooseEmployee().then((resId)=>{
                        updateEmployeeManager1(resId).then((response)=>{
                           console.log(response);
                           mainMenu();
                           
                        })
                    })

                    break;


                    default:
                        connection.end();
                        process.exit;
                        break;

            }
            
        })
    }

    //function to view all departments
   const viewAllDepartments = () =>{
       return new Promise((resolve,reject)=>{
        connection.query("SELECT * FROM department1", (err,data)=>{
            if(err) 
            {
            reject (err);
            }
            resolve(data);
            
        });
    }).then()
  }

  //function to view all roles
  const viewAllRoles = () =>{
    return new Promise((resolve,reject)=>{
     connection.query("SELECT * FROM role", (err,data)=>{
         if(err) 
         {
         reject (err);
         }
         resolve(data);
         
     });
 })
}

//function to view all employees
const viewAllEmployees = () =>{
    return new Promise((resolve,reject)=>{
     connection.query("SELECT employee.id,employee.first_name,employee.last_name,employee.role_id,employee.manager_id,role.title,role.salary,department1.department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department1 ON role.department_id=department1.id", (err,data)=>{
         if(err) 
         {
         reject (err);
         }
         resolve(data);
         
     });
 })
}

//function to add department
const deptMenu = ()=>{
    inquirer.prompt({
        type:"prompt",
        name:"dept_name",
        message:"Add department",
    })
    .then(({dept_name})=>{
        console.log(dept_name);
        addDepartment(dept_name).then(()=>{
            mainMenu();
        })
        
    })
}


const addDepartment = (addDept)=>{
    return new Promise((resolve,reject)=>{
        connection.query(
            "INSERT INTO department1 SET ?",
            [{department: addDept}],
            (err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve({msg:"department was added successfully"});
                }
            }
        )
    })
}


//function to add role
const roleMenu = ()=>{
    inquirer.prompt([{
        type:"prompt",
        name:"add_title",
        message:"Add title",
    },
    {
        type:"prompt",
        name:"add_salary",
        message:"Add salary",
    },
    {
        type:"prompt",
        name:"add_dept_id",
        message:"Add department id",
    }
])
    .then(({add_title,add_salary,add_dept_id})=>{
      
        addRole(add_title,add_salary,add_dept_id).then(()=>{
            mainMenu();
        })
        
    })
}

const addRole = (add_title,add_salary,add_dept_id)=>{
    return new Promise((resolve,reject)=>{
        connection.query(
            "INSERT INTO role SET ?",
            [{title: add_title,salary: add_salary,department_id: add_dept_id}],
            (err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve({msg:"role was added successfully"})
                }
            }
        )
    })
}


//function to add employee
const employeeMenu = ()=>{
    inquirer.prompt([{
        type:"prompt",
        name:"add_1st_name",
        message:"Add first name",
    },
    {
        type:"prompt",
        name:"add_last_name",
        message:"Add last name",
    },
    {
        type:"prompt",
        name:"add_role_id",
        message:"Add role id",
    },
    {
        type:"prompt",
        name:"add_manager_id",
        default: "",
        message:"Add manager id",
    }
])
    .then(({add_1st_name,add_last_name,add_role_id,add_manager_id})=>{

        if (add_manager_id == ""){
            addEmployee(add_1st_name,add_last_name,add_role_id,null).then(()=>{
                mainMenu();
            })
        }else{
      
            addEmployee(add_1st_name,add_last_name,add_role_id,add_manager_id).then(()=>{
            mainMenu();
            })
        }
    })
}


const addEmployee = (add_1st_name,add_last_name,add_role_id,add_manager_id)=>{
    return new Promise((resolve,reject)=>{
        connection.query(
            "INSERT INTO employee SET ?",
            [{first_name:add_1st_name, last_name:add_last_name, role_id:add_role_id, manager_id:add_manager_id}],
            (err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve({msg:"employee was added successfully"})
                }
            }
        )
    })
}


const chooseDepartment = ()=>{
    return new Promise((resolve,reject)=>{
        viewAllDepartments().then((allDept)=>{
        const deptChoice = allDept.map(
            (element)=>`id: ${element.id} department: ${element.department}`
        )
        inquirer.prompt({
            type:"list",
            message:"Choose a department",
            choices:deptChoice,
            name:"choosenDept",
        }).then(({choosenDept})=>{
            const deptId=choosenDept.split(" ")[1];
            resolve(deptId);
        })
        })
    })
}


const deleteDepartment = (dept_id)=>{
    return new Promise((resolve,reject)=>{
        connection.query("DELETE FROM department1 WHERE ?",[{id:dept_id}],(err)=>{
           if(err){
               reject(err);
           } else{
               resolve({msg:"A department was deleted successfully"})
           }
        })
    })
}

const chooseRole = ()=>{
    return new Promise((resolve,reject)=>{
        viewAllRoles().then((allRole)=>{
        const roleChoice = allRole.map(
            (element)=>`id: ${element.id} title: ${element.title} salary: ${element.salary} department_id: ${element.department_id}`
        )
        inquirer.prompt({
            type:"list",
            message:"Choose a role",
            choices:roleChoice,
            name:"choosenRole",
        }).then(({choosenRole})=>{
            const roleId=choosenRole.split(" ")[1];
            resolve(roleId);
        })
        })
    })
}

const deleteRole = (role_id)=>{
    return new Promise((resolve,reject)=>{
        connection.query("DELETE FROM role WHERE ?",[{id:role_id}],(err)=>{
           if(err){
               reject(err);
           } else{
               resolve({msg:"A role was deleted successfully"})
           }
        })
    })
}


const chooseEmployee = ()=>{
    return new Promise((resolve,reject)=>{
        viewAllEmployees().then((allEmployee)=>{
        const employeeChoice = allEmployee.map(
            (element)=>`id: ${element.id}  first_name: ${element.first_name}  last_name: ${element.last_name}  role_id: ${element.role_id}  manager_id: ${element.manager_id}`
        )
        inquirer.prompt({
            type:"list",
            message:"Choose a employee",
            choices:employeeChoice,
            name:"choosenEmployee",
        }).then(({choosenEmployee})=>{
            const employeeId=choosenEmployee.split(" ")[1];
            resolve(employeeId);
        })
        })
    })
}



const deleteEmployee = (employee_id)=>{
    return new Promise((resolve,reject)=>{
        connection.query("DELETE FROM employee WHERE ?",[{id:employee_id}],(err)=>{
           if(err){
               reject(err);
           } else{
               resolve({msg:"A employee was deleted successfully"})
           }
        })
    })
}

//function to update the employee role
const updateEmployeeRole = (employeeId)=>{
    return new Promise((resolve,reject)=>{
    viewAllRoles().then(allRoles=>{
        const roleChoice = allRoles.map(
            (element)=> `id: ${element.id}  title: ${element.title}  salary: ${element.salary}  department_id: ${element.department_id}`
        )
    inquirer.prompt({
        type:"list",
        message:"Choose a role to update the selected employee",
        choices:roleChoice,
        name:"choosenRole",
    }).then(({choosenRole})=>{
        const roleId=choosenRole.split(" ")[1];
        const employeeUpdate = {id: employeeId,role_id: roleId}
        return updateEmployee(employeeUpdate);
    }).then((updatedEmployee)=>{
        resolve(updatedEmployee);
    })
    })
    
})
}

const updateEmployee = (employeeUpdate)=>{
    return new Promise((resolve,reject)=>{
connection.query("UPDATE employee SET ? WHERE ?",
[
    { 
    role_id: employeeUpdate.role_id, 
    
    },
    {id: employeeUpdate.id}
],
    (err)=>{
    if(err){
        reject(err);
    }else{
        resolve({msg:"Employee was updated successfully"});
    }
})
})
}

//function to update the employee manager
const updateEmployeeManager1 = (employeeId)=>{
    return new Promise((resolve,reject)=>{
    viewAllEmployees().then(allEmployee=>{
        const employeeChoice = allEmployee.map(
            (element)=> `id: ${element.id} first_name: ${element.first_name} last_name: ${element.last_name} role_id: ${element.role_id} manager_id: ${element.manager_id} title: ${element.title}`
        )
    inquirer.prompt({
        type:"list",
        message:"Choose a manager for the selected employee",
        choices:employeeChoice,
        name:"choosenManager",
    }).then(({choosenManager})=>{
        const managerId=choosenManager.split(" ")[1];
        const employeeUpdate = {id: employeeId,manager_id: managerId}
        return updateEmployeeManager(employeeUpdate);
    }).then((updatedEmployee)=>{
        resolve(updatedEmployee);
    })
    })
    
})
}



const updateEmployeeManager = (employeeUpdate)=>{
    return new Promise((resolve,reject)=>{
connection.query("UPDATE employee SET ? WHERE ?",
[
    { 
    manager_id: employeeUpdate.manager_id, 
    
    },
    {id: employeeUpdate.id}
],
    (err)=>{
    if(err){
        reject(err);
    }else{
        resolve({msg:"Employee manager was updated successfully"});
    }
})
})
}
    


const chooseEmployeeRole = ()=>{
    return new Promise((resolve,reject)=>{
        viewAllEmployees().then((allEmployee)=>{
        const employeeChoice = allEmployee.map(
            (element)=>`id: ${element.id}  first_name: ${element.first_name}  last_name: ${element.last_name}  role_id: ${element.role_id}  manager_id: ${element.manager_id} title: ${element.title} `
        )
        inquirer.prompt({
            type:"list",
            message:"Choose a employee to update role",
            choices:employeeChoice,
            name:"choosenEmployee",
        }).then(({choosenEmployee})=>{
            const employeeId=choosenEmployee.split(" ")[1];
            resolve(employeeId)

            console.log(employeeId);
        })
        })
    })
}
