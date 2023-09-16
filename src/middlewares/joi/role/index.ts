import { Request, Response , NextFunction } from 'express';
import Joi from 'joi';

import { makeResponse, statusCode } from '../../../lib';

export const addRoleJoi = (req:Request, res: Response, next:NextFunction)=>{
    const { error } = Joi.object()
    .keys({
        name: Joi.string().valid('Community Admin', 'Community Member', 'Community Moderator').required(),
    }).validate(req.body);
    if(error){
        return makeResponse(req, res, statusCode.badRequest, false, error.details[0].message, undefined);
    }
    next();
 }