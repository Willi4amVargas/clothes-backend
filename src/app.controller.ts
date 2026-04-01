import { Request, Response } from "express";
import { AppService } from "@/app.service";

export class AppController {
  constructor(private appService: AppService) {}
  public get = (_: Request, res: Response) => {
    res.send(this.appService.sayHello());
  };
}
