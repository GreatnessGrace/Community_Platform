import { Request, Response , NextFunction } from 'express';
import Joi from 'joi';

import { makeResponse, statusCode } from '../../../lib';

export const loginJoi = (req:Request, res: Response, next:NextFunction)=>{
    const { error } = Joi.object()
    .keys({
        email: Joi.string().required(),
        password: Joi.string().required()
        
    }).validate(req.body);
    if(error){
        return makeResponse(req, res, statusCode.badRequest, false, error.details[0].message, undefined);
    }
    next();
 }

 
export const signupJoi = (req: Request, res: Response, next: NextFunction) => {
    const passwordSchema = Joi.string()
      .min(6) 
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
      .message(
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*)'
      )
      .required();
  
    const { error } = Joi.object().keys({
      name: Joi.string().min(2).required(),
      email: Joi.string().required(),
      password: passwordSchema, 
    }).validate(req.body);
  
    if (error) {
      return makeResponse(req, res, statusCode.badRequest, false, error.details[0].message, undefined);
    }
    next();
  };