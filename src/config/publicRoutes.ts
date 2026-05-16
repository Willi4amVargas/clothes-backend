interface IPublicRoutes {
  route: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export const publicRoutes: IPublicRoutes[] = [
  {
    // Acepta /api/signin y /api/signin/
    route: "^/api/signin/?$",
    method: "POST",
  },
  {
    // Acepta /api/docs, /api/docs/, y cualquier sub-ruta como /api/docs/swagger.json
    route: "^/api/docs(/.*)?/?$",
    method: "GET",
  },
  {
    // Acepta la ruta raíz /api o /api/
    route: "^/api/?$",
    method: "GET",
  },
  {
    route: "^/api/recovery_password/?$",
    method: "POST",
  },
  {
    route: "^/api/recovery_password/?$",
    method: "PUT",
  },
] as const;
