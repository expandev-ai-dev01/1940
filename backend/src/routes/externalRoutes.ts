/**
 * @summary
 * External API routes configuration.
 * Handles public endpoints that don't require authentication.
 *
 * @module routes/externalRoutes
 */

import { Router } from 'express';
import * as vehicleController from '@/api/external/vehicle/controller';
import * as contactController from '@/api/external/contact/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Vehicle Public routes - /api/external/vehicle
 */
router.get('/vehicle', vehicleController.listHandler);
router.get('/vehicle/filters', vehicleController.getFiltersHandler);
router.get('/vehicle/:id', vehicleController.getHandler);

/**
 * @rule {be-route-configuration}
 * Contact Public routes - /api/external/contact
 */
router.post('/contact', contactController.createHandler);

export default router;
