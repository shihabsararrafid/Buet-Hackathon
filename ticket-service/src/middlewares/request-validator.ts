import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ZodTypeAny } from "zod";
interface validatorsType {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
}
export function requestValidator(validators: validatorsType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body, "body from validator");
    try {
      // if (validators.params) {
      //   req.params = await validators.params.parseAsync(req.params);
      // }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      return next();
    } catch (error) {
      console.log(error, "error");
      next(createHttpError(422, "Validation Failed"));
    }
  };
}
