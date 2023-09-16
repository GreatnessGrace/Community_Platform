import { Router, Response , Request } from 'express';
import { makeResponse, statusCode } from '../../lib';
import { 
    // createCommunityJoi, getCommunityJoi, 
    verifyToken } from '../../middlewares';
import { communityCount, createCommunity, createMember, getAllCommunities, getCommunity, getMember, memberCount,  } from '../../services'
import { Iuser } from '../../lib/interface/user';
import { Snowflake } from '@theinternetfolks/snowflake';
const router = Router();

interface ExtendedRequest extends Request {
    user?: Iuser;
  }
router.post('/',verifyToken, async(req:ExtendedRequest,res: Response)=> {
    try { 
         const { name } = req.body;
    const ownerId = req.user?._id; 
    const existingCommunity = await getCommunity({ name }, {});
    if (existingCommunity) {
        return makeResponse(
          req,
          res,
          statusCode.badRequest,
          false,
          'A community with the same name already exists'
        );
      }
    const communityId = Snowflake.generate();
        const Community = await createCommunity({
            _id: communityId,
            name,
            slug: name.toLowerCase().replace(/\s/g, '-'),
            owner: ownerId,
        })
        const memberId = Snowflake.generate();
        const firstMember = await createMember({
            _id: memberId, 
            community: communityId,
            user: ownerId,
            role: 'Community Admin',
        })
        return makeResponse(req, res, statusCode.successful, true, 'Added Successfully', Community);

    } catch (error) {
        const err = error instanceof Error?error : {
            message: 'An unknown error occurred'
        };
        return makeResponse(req, res, statusCode.badRequest, false, err.message);
    
    }
})
router.get('/', async(req:Request,res: Response) => {
    try {
        const perPage = 10;
        const page = parseInt(req.query.page as string, 10) || 1; 
        const totalCommunities = await communityCount();
        const totalPages = Math.ceil((totalCommunities ?? 0) / perPage)
        const communities = await getAllCommunities({}, {}, page, perPage)
        const responseData = {
            status: true,
            content: {
              meta: {
                total: totalCommunities,
                pages: totalPages,
                page: page,
              },
              data: communities.map((community: any) => ({
                _id: community._id,
                name: community.name,
                slug: community.slug,
                owner: {
                  _id: community.owner._id,
                  name: community.owner.name,
                },
                created_at: community.createdAt,
                updated_at: community.updatedAt,
              })),
            },
          };
          return makeResponse(req, res, statusCode.successful, true, 'Fetched Successfully', responseData, undefined);
        } catch (error) {
        const err = error instanceof Error?error : {
            message: 'An unknown error occurred'
        };
        return makeResponse(req, res, statusCode.badRequest, false, err.message);
    }
})

router.get('/:id/members',async(req:Request,res: Response) => {
try {
  const communityId = req.params.id;
  const page = parseInt(req.query.page as string, 10) || 1; 
  const perPage = 10; 
  const members = await getMember({}, {}, page, perPage)
  const totalMembers = await memberCount({_id: communityId});
  const totalPages = Math.ceil((totalMembers ?? 0)/ perPage);

  const responseData = {
    status: true,
    content: {
      meta: {
        total: totalMembers,
        pages: totalPages,
        page: page,
      },
      data: members.map((member: any) => ({
        _id: member._id,
        community: member.community,
        user: {
          _id: member.user._id,
          name: member.user.name,
        },
        role: member.role ? {
          _id: member.role._id,
          name: member.role.name,
        } : null,
        created_at: member.createdAt,
      })),
    },
  };
  return makeResponse(req, res, statusCode.successful, true, 'Fetched Successfully', responseData);
} catch (error) {
  const err = error instanceof Error?error : {
    message: 'An unknown error occurred'
};
return makeResponse(req, res, statusCode.badRequest, false, err.message);
}
})

router.get('/me/owner',verifyToken, async (req: ExtendedRequest, res: Response) => {
  try {
    const ownerId = req.user?._id; 
    const perPage = 10;
    const page = parseInt(req.query.page as string, 10) || 1;
    const totalOwnedCommunities = await communityCount({ owner: ownerId });
    const totalPages = Math.ceil((totalOwnedCommunities ?? 0) / perPage);

    const ownedCommunities = await getAllCommunities({ owner: ownerId }, {}, page, perPage);

    const responseData = {
      status: true,
      content: {
        meta: {
          total: totalOwnedCommunities,
          pages: totalPages,
          page: page,
        },
        data: ownedCommunities.map((community: any) => ({
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.createdAt,
          updated_at: community.updatedAt,
        })),
      },
    };

    return makeResponse(req, res, statusCode.successful, true, 'Fetched Successfully', responseData);
  } catch (error) {
    const err = error instanceof Error ? error : { message: 'An unknown error occurred' };
    return makeResponse(req, res, statusCode.badRequest, false, err.message);
  }
})

router.get('/me/member',verifyToken, async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id; 

    const perPage = 10;
    const page = parseInt(req.query.page as string, 10) || 1;

    const totalCommunities = await communityCount({ members: userId });

    const totalPages = Math.ceil((totalCommunities ?? 0) / perPage);

    const joinedCommunities = await getAllCommunities(
      { members: userId }, 
      {}, 
      page,
      perPage
    );

    const responseData = {
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: totalPages,
          page: page,
        },
        data: joinedCommunities.map((community: any) => ({
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: {
            id: community.owner._id,
            name: community.owner.name,
          },
          created_at: community.created_at,
          updated_at: community.updated_at,
        })),
      },
    };

    return makeResponse(req, res, statusCode.successful, true, 'Fetched Successfully', responseData);
  } catch (error) {
    const err = error instanceof Error ? error : { message: 'An unknown error occurred' };
    return makeResponse(req, res, statusCode.badRequest, false, err.message);
  }
})
export const communityRouter = router;
