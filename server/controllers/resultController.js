import * as resultService from '../services/resultService.js';
import { ok, asyncHandler } from '../utils/response.js';

export const getResult = asyncHandler(async (req, res) => ok(res, await resultService.getResult(req.user, req.params.attemptId)));
