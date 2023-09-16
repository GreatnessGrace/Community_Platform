import { Types } from 'mongoose';

export interface IReqUser {
    user: {
        // resetPassword: {
        //     token: string,
        //     isUsed: boolean
        // },
    _id : String,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    _v: number,
}
}