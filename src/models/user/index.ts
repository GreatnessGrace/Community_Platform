import { Schema , Types, model } from 'mongoose';

const schema = new Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String
    },   
    _id: {
        type: String,
        unique: true,
        null: false
      },
},{
    timestamps: true,
    
});



export const USER = model('user', schema) ;
