interface IPublicRoutes {
  route: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export const publicRoutes: IPublicRoutes[] = [
  {
    route: "/api/signin/",
    method: "POST",
  },
  {
    route: "/api/signin",
    method: "POST",
  },
  {
    route: "/api/docs",
    method: "GET",
  },
  {
    route: "/api/docs/",
    method: "GET",
  },
  {
    route: "/api/",
    method: "GET",
  },
] as const;
