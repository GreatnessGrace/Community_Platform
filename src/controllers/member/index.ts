import { Router, Response , Request } from 'express';
import { makeResponse, statusCode } from '../../lib';
import { 
    verifyToken } from '../../middlewares';
import { createMember, deleteMember, getSingleMember } from '../../services'
import { Iuser } from '../../lib/interface/user';
import { Snowflake } from '@theinternetfolks/snowflake';
import { Imember } from '../../lib';
const router = Router();

interface ExtendedRequest extends Request {
    user?: Iuser;
  }
  router.post('/',verifyToken, async(req:ExtendedRequest, res:Response ) =>{
    try {
        const userId = req.user?._id; 
        const loggedMember = await getSingleMember({user: userId}, {})
        if ((loggedMember as Imember).role !== 'Community Admin') {
          return res.status(403).json({
            status: false,
            message: 'You do not have permission to add a member.',
          });
        }
    
        const { community, user, role } = req.body;
        const memeberId = Snowflake.generate(); // 

        const member = await createMember({
          community,
          user,
          role,
          _id:memeberId
        });
        return res.status(201).json({
          status: true,
          content: {
            data: {
              _id: (member as Imember)._id,
              community: (member as Imember).community,
              user: (member as Imember).user,
              role: (member as Imember).role,
              created_at: (member as Imember).created_at,
            },
          },
        });
    } catch (error) {
        const err = error instanceof Error ? error : { message: "An unknown error occurred." };
        return makeResponse(req, res, statusCode.badRequest, false, err.message);     
    }
  })

  router.delete('/:id',verifyToken, async(req:ExtendedRequest, res:Response ) =>{
    try {
        const userId = req.user?._id; 
        const loggedMember = await getSingleMember({user: userId}, {})
     
        if ((loggedMember as Imember).role !== 'Community Admin' && (loggedMember as Imember).role !=='Community Moderator' ) {
          return res.status(403).json({
            status: false,
            message: 'You do not have permission to delete a member.',
          });
        }
        const memberId = req.params.id;
        const deletedMember = await deleteMember({ _id: memberId });
        if (!deletedMember) {
            return res.status(404).json({
              status: false,
              message: 'Member not found.',
            });
          }
          return res.status(200).json({
            status: true,
          });
    } catch (error) {
        const err = error instanceof Error ? error : { message: "An unknown error occurred." };
        return makeResponse(req, res, statusCode.badRequest, false, err.message);     
    }
  })
  export const memberRouter = router;
