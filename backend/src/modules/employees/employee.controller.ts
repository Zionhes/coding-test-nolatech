import { Request, Response } from "express";
import { Employee } from "../../models/employee.model";
import { findAllEmployees, findEmployeeById } from "./employee.service";
import { User } from "../../models/user.model";

// ADMIN
export const getEmployees = async (_req: Request, res: Response) => {
  try {
    const employees = await findAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employees" });
  }
};

// ADMIN, MANAGER, EMPLOYEE
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await findEmployeeById(req.params.id);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // Employees can only see theyself
    //@ts-ignore
    if (req?.user.role === "employee" && req?.user?.id.toString() !== employee.user.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    // Managers can only see Employees of his team
    //@ts-ignore
    if (req?.user.role === "manager") {
      //@ts-ignore
      const managedEmployees = await Employee.find({ manager: req.user._id });
      //@ts-ignore
      const isPartOfTeam = managedEmployees.some((emp) => emp._id.equals(employee._id));
      if (!isPartOfTeam) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employee" });
  }
};

// ADMIN
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { user, department, position, manager } = req.body;

    // Verify if users is already registered as employee
    const existingEmployee = await Employee.findOne({ user });
    if (existingEmployee) {
      res.status(400).json({ message: "User is already assigned as an employee" });
      return;
    }

    // Verify if user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      res.status(404).json({ messsage: "User not found" });
      return;
    }

    const newEmployee = new Employee({ user, department, position, manager });
    await newEmployee.save();

    res.status(201).json(newEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating employee" });
  }
};

// ADMIN, MANAGER
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    Object.assign(employee, req.body);
    await employee.save();

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee" });
  }
};
