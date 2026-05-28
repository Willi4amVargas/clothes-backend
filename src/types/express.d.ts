import { User } from "@/users/models/User";

declare global {
  namespace Express {
    interface Locals {
      dry_run: boolean;
      user: User;
    }
  }
}
