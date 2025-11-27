/**
 * @summary
 * Internal API controller for Vehicle entity.
 * Handles administrative CRUD operations.
 *
 * @module api/internal/vehicle/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { vehicleCreate, vehicleUpdate, vehicleDelete, vehicleGet } from '@/services/vehicle';

/**
 * @api {post} /api/internal/vehicle Create Vehicle
 * @apiName CreateVehicle
 * @apiGroup Vehicle
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await vehicleCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/vehicle/:id Get Vehicle
 * @apiName GetVehicleInternal
 * @apiGroup Vehicle
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await vehicleGet(req.params);
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
 * @api {put} /api/internal/vehicle/:id Update Vehicle
 * @apiName UpdateVehicle
 * @apiGroup Vehicle
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await vehicleUpdate(req.params, req.body);
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
 * @api {delete} /api/internal/vehicle/:id Delete Vehicle
 * @apiName DeleteVehicle
 * @apiGroup Vehicle
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await vehicleDelete(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
