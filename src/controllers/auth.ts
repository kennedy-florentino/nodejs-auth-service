import { validate } from "class-validator";
import { Request, RequestHandler, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import { SignInRequest } from "../requests/sign-in";
import { SignInService } from "../services/sign-in";
import { SignUpRequest } from "../requests/sign-up";
import { SignUpResponse } from "../responses/create-user";
import { SignUpService } from "../services/sign-up";
import { RefreshTokenRequest } from "../requests/refresh-token";
import { RefreshTokenService } from "../services/refresh-token";

export class AuthController {
  public static signUp: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { name, email, password } = req.body;
    const signUpRequest = new SignUpRequest({ name, email, password });
    const invalidAttributes = await validate(signUpRequest);

    if (invalidAttributes.length > 0)
      throw new BadRequestError({
        message: "Invalid user attributes",
        metadata: invalidAttributes.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        })),
      });

    const newUser = await SignUpService.save(signUpRequest);

    return res.status(201).json(new SignUpResponse({ ...newUser }));
  };

  public static signIn: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { email, password } = req.body;
    const signInRequest = new SignInRequest({ email, password });
    const invalidAttributes = await validate(signInRequest);

    if (invalidAttributes.length > 0)
      throw new BadRequestError({ message: "Invalid user or password" });

    const tokens = await SignInService.signIn({ email, password });

    return res.status(200).json(tokens);
  };

  public static refreshToken: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { accessToken, refreshToken } = req.body;
    const refreshTokenRequest = new RefreshTokenRequest({
      accessToken,
      refreshToken,
    });
    const invalidAttributes = await validate(refreshTokenRequest);

    if (invalidAttributes.length > 0)
      throw new BadRequestError({
        message: "Invalid token",
        metadata: invalidAttributes.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        })),
      });

    const tokens = RefreshTokenService.getTokens({
      accessToken,
      refreshToken,
    });

    return res.status(200).json(tokens);
  };
}
