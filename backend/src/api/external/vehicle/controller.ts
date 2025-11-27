/**
 * @summary
 * External API controller for Vehicle entity.
 * Handles public listing and details operations.
 *
 * @module api/external/vehicle/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { vehicleList, vehicleGet, vehicleGetFilters } from '@/services/vehicle';

/**
 * @api {get} /api/external/vehicle List Vehicles
 * @apiName ListVehicles
 * @apiGroup Vehicle
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await vehicleList(req.query);
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
 * @api {get} /api/external/vehicle/filters Get Vehicle Filters
 * @apiName GetVehicleFilters
 * @apiGroup Vehicle
 */
export async function getFiltersHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await vehicleGetFilters();
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
 * @api {get} /api/external/vehicle/:id Get Vehicle Details
 * @apiName GetVehicleDetails
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
