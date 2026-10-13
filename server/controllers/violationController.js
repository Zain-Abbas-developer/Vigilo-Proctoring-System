import * as violationService from '../services/violationService.js';
import { ok, asyncHandler } from '../utils/response.js';

export const listViolations  = asyncHandler(async (req, res) => ok(res, await violationService.listViolations(req.user, req.query)));
export const reviewViolation = asyncHandler(async (req, res) => ok(res, await violationService.reviewViolation(req.user, req.params.id, req.body), 'Violation reviewed'));
