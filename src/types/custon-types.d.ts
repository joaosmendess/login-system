import "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      password: string;
    }
  }
}
