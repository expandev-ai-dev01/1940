/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as initExampleController from '@/api/internal/init-example/controller';
import * as vehicleController from '@/api/internal/vehicle/controller';
import * as contactController from '@/api/internal/contact/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Init-Example routes - /api/internal/init-example
 */
router.get('/init-example', initExampleController.listHandler);
router.post('/init-example', initExampleController.createHandler);
router.get('/init-example/:id', initExampleController.getHandler);
router.put('/init-example/:id', initExampleController.updateHandler);
router.delete('/init-example/:id', initExampleController.deleteHandler);

/**
 * @rule {be-route-configuration}
 * Vehicle Management routes - /api/internal/vehicle
 */
router.post('/vehicle', vehicleController.createHandler);
router.get('/vehicle/:id', vehicleController.getHandler);
router.put('/vehicle/:id', vehicleController.updateHandler);
router.delete('/vehicle/:id', vehicleController.deleteHandler);

/**
 * @rule {be-route-configuration}
 * Contact Management routes - /api/internal/contact
 */
router.get('/contact', contactController.listHandler);
router.get('/contact/:id', contactController.getHandler);
router.put('/contact/:id', contactController.updateHandler);

export default router;
