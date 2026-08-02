import { users } from "#/client";

declare global {
  namespace Express {
    interface Locals {
      dry_run: boolean;
      user: users;
    }
  }
}
