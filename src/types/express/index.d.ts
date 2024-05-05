// src/types/express/index.d.ts
import "express";

declare module "express-serve-static-core" {
  interface User {
    id: number;
    name: string;
    password: string;
    email: string;
  }
}
