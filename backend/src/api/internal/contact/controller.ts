/**
 * @summary
 * Internal API controller for Contact entity.
 * Handles administrative contact management.
 *
 * @module api/internal/contact/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { contactList, contactGet, contactUpdate } from '@/services/contact';

/**
 * @api {get} /api/internal/contact List Contacts
 * @apiName ListContacts
 * @apiGroup Contact
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await contactList(req.query);
    res.json(successResponse(data.data, data.metadata));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/contact/:id Get Contact Details
 * @apiName GetContact
 * @apiGroup Contact
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await contactGet(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/contact/:id Update Contact
 * @apiName UpdateContact
 * @apiGroup Contact
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await contactUpdate(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
