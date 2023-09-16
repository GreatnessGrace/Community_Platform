import { Snowflake } from '@theinternetfolks/snowflake';
import { Schema , Types, model } from 'mongoose';

const schema = new Schema({
    _id: {
        type: String,
        unique: true,
        required: true,  
    },
    community:{
        type: String,
        ref: 'community',
        required: true,
    },
    user:{
        type: String,
        ref: 'user',
        required: true,
    },
    role: {
        type: String,
        ref: 'role',
        required: true,
    }
},{
    timestamps: true
});

export const MEMBER = model('member', schema) ;