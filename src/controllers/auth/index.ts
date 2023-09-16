import { Router, Response , Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import { makeResponse, statusCode } from '../../lib';
import { loginJoi, signupJoi } from '../../middlewares';
import { createUser, getUser,  } from '../../services'
import { Iuser } from '../../lib/interface/user';
import { Snowflake } from '@theinternetfolks/snowflake';

dotenv.config();
const router = Router();

router.post("/signup", signupJoi, async(req:Request, res:Response ) =>{
    try {
        const { email, password, name } = req.body;
        const findUsers:any = await getUser({email:email}, {});
        if(findUsers !=null){
            if(email === findUsers.email){
                return makeResponse(req, res, statusCode.badRequest, false, 'Email already Exists please try with differnt email');
            }
    
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const snowflakeId = Snowflake.generate(); 
        const result:any = await  createUser({
            email, name, password: hashedPassword, _id: snowflakeId,
        })
        const tokenData = {
            _id : snowflakeId,
            name : name,
            email : email
        }
        const token = sign(tokenData, String(process.env.SECRET_KEY),{
            expiresIn: process.env.TOKEN_EXPIRE,
        })

        const responseData = {
            ...JSON.parse(JSON.stringify(result)),
            password: undefined
        }
        res.cookie("token", token, {
            httpOnly: true
          })
        return makeResponse(req, res, statusCode.successful, true, 'Added Successfully', responseData, { access_token: token });
        
    } catch (error) {
        const err = error instanceof Error?error : {
            message: 'An unknown error occurred'
        };
        return makeResponse(req, res, statusCode.badRequest, false, err.message);
    }
})

router.post('/signin', loginJoi, async(req:Request,res:Response): Promise<number | object | null | undefined> =>{
    try {
        const { email , password } = req.body;
      
        const user = await getUser({email}, {});
        
        if(user === null || ! await (bcrypt.compare(password, (user as { password: string }).password))
        )
        {
            return makeResponse(req, res, statusCode.badRequest, false, 'Invalid email or password!', undefined);
        }
        const tokenData = {
            _id : (user as Iuser)._id ,
            name : (user as Iuser).name,
            email : (user as Iuser).email
        }
        const token = sign(tokenData, String(process.env.SECRET_KEY),{
            expiresIn: process.env.TOKEN_EXPIRE,
        })
        
        
    const responseData = {
        ...JSON.parse(JSON.stringify(user)),
        password: undefined
      };
      res.cookie("token", token, {
        httpOnly: true
      })
      makeResponse(req, res, statusCode.successful, true, "Login successfully", responseData, { access_token: token });

} catch (error) {
    const err = error instanceof Error?error : {
        message: 'An unknown error occured'
    };
    return makeResponse(req, res, statusCode.badRequest, false, err.message );  
}
})
router.get('/me',  async(req:Request,res:Response): Promise<number | object | null | undefined> =>{
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ status: false, content: 'Unauthorized' });
          }
        const token = req.headers.authorization.split(' ')[1];

        const decodedToken:any = verify(token, String(process.env.SECRET_KEY));
    
        const user = await getUser({_id:decodedToken._id}, {});
    
        if (!user) {
          return res.status(404).json({ status: false, content: 'User not found' });
        }
    
        return res.json({
          status: true,
          content: {
            data:  {...JSON.parse(JSON.stringify(user)),
            password: undefined}
          },
        });
        } catch (error) {
        const err = error instanceof Error?error : {
            message: 'An unknown error occured'
        };
        return makeResponse(req, res, statusCode.badRequest, false, err.message );        
    }
})
export const authRouter = router;
