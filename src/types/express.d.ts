import { User } from "@/users/models/User";

declare global {
  namespace Express {
    interface Locals {
      user: User;
      dry_run: boolean;
    }
  }
}
