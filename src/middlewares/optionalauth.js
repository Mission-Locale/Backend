import jwt from "jsonwebtoken";
import express from "express";
const { NextFunction } = express;
import UserRepository from "../repositories/UserRepository.js";

const ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_KEY;
const userRepository = UserRepository;

/**
 * Middleware to check user's authentication.
 * @param {import('express').Request} req - Request HTTP
 * @param {import('express').Response} res - Response HTTP
 * @param {NextFunction} next - Next stage of the request
 */
async function optionalAuth(req, res, next) {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies.refresh;
  if (!accessToken || !refreshToken) return;

  const data = jwt.verify(accessToken, ACCESS_TOKEN_KEY);
  if (!data) return;

  const user = await userRepository.find(data.key);
  if (!user) return;

  req.user = user;
  return next();
}

export default optionalAuth;
