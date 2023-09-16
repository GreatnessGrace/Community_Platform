import { Router } from "express";
import { authRouter, communityRouter, roleRouter, memberRouter } from '../controllers'
const router = Router();

router.use('/v1/auth', authRouter)
router.use('/v1/role', roleRouter)
router.use('/v1/community', communityRouter)
router.use('/v1/member', memberRouter)
export { router };

