import { Schema , model } from 'mongoose';

const schema = new Schema({
    name:{
        type: String,
        enum: ['Community Admin', 'Community Member', 'Community Moderator']
    },
    _id:{
        type: String,
        unique: true
    },
},{
    timestamps: true
});

export const ROLE = model('role', schema) ;