interface IPublicRoutes {
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  route: string;
}

export const publicRoutes: IPublicRoutes[] = [
  {
    method: "POST",
    // Acepta /api/signin y /api/signin/
    route: "^/api/signin/?$",
  },
  {
    method: "GET",
    // Acepta /api/docs, /api/docs/, y cualquier sub-ruta como /api/docs/swagger.json
    route: "^/api/docs(/.*)?/?$",
  },
  {
    method: "GET",
    // Acepta la ruta raíz /api o /api/
    route: "^/api/?$",
  },
  {
    method: "POST",
    route: "^/api/recovery_password/?$",
  },
  {
    method: "PUT",
    route: "^/api/recovery_password/?$",
  },
  {
    method: "GET",
    route: "^/api/products/?$",
  },
  {
    method: "GET",
    route: "^/api/products/[^/]+/?$",
  },
    {
    method: "GET",
    route: "^/api/products/marks/?$",
  },
] as const;
