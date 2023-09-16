import { Router, Response , Request } from 'express';
import { makeResponse, statusCode } from '../../lib';
import { addRoleJoi, 
    // getRoleJoi
 } from '../../middlewares';
import { addRole, getRole, roleCount,  } from '../../services'
import { Snowflake } from '@theinternetfolks/snowflake';

const router = Router();
const snowflake = new Snowflake();

router.post('/', addRoleJoi, async(req:Request, res:Response ) =>{
    try {
        const { name } = req.body;
        const roleId = Snowflake.generate();

        const result:any = await  addRole({
            name, _id: roleId,
        })
      
        
        return makeResponse(req, res, statusCode.successful, true, 'Role Added Successfully', result,);
        
    } catch (error) {
        const err = error instanceof Error?error : {
            message: 'An unknown error occurred'
        };
        return makeResponse(req, res, statusCode.badRequest, false, err.message);
    }
})
.get('/', async (req: Request, res: Response) => {
    try {
      const perPage = 10;
      const page = parseInt(req.query.page as string, 10) || 1; 
      const totalRoles = await roleCount();
      const totalPage = Math.ceil((totalRoles ?? 0) / perPage)
      const roles = await getRole({}, {}, page, perPage)

      
      return makeResponse(
        req,
        res,
        statusCode.successful,
        true,
        "Get Succesfully",
        roles,
        {
            total: totalRoles,
            pages: totalPage,
            page: page,
          },
      );
    } catch (error) {
      const err = error instanceof Error ? error : { message: "An unknown error occurred." };
      return makeResponse(req, res, statusCode.badRequest, false, err.message);
    }
  })

export const roleRouter = router;
