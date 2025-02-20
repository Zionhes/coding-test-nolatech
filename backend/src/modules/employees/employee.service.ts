import { Employee } from "../../models/employee.model";

export const findAllEmployees = async () => {
  return await Employee.find().populate("user", "firstName lastName email role");
};

export const findEmployeeById = async (id: string) => {
  return await Employee.findById(id).populate("user", "firstName lastName email role");
};
