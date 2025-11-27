/**
 * @summary
 * External API controller for Contact entity.
 * Handles public contact form submissions.
 *
 * @module api/external/contact/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { contactCreate } from '@/services/contact';

/**
 * @api {post} /api/external/contact Submit Contact Form
 * @apiName SubmitContact
 * @apiGroup Contact
 *
 * @apiBody {String} nome_completo Full name (min 3 chars)
 * @apiBody {String} email Valid email address
 * @apiBody {String} telefone Phone number (min 10 digits)
 * @apiBody {String} preferencia_contato Preference (Telefone|E-mail|WhatsApp)
 * @apiBody {String} [melhor_horario] Best time (Manhã|Tarde|Noite|Qualquer horário)
 * @apiBody {String} id_veiculo Vehicle ID
 * @apiBody {String} modelo_veiculo Vehicle Model Name
 * @apiBody {String} assunto Subject
 * @apiBody {String} mensagem Message content (10-1000 chars)
 * @apiBody {Boolean} [financiamento] Interest in financing
 * @apiBody {Boolean} termos_privacidade Must be true
 * @apiBody {Boolean} [receber_novidades] Newsletter opt-in
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.protocolo Generated protocol number
 * @apiSuccess {String} data.mensagem Success message
 * @apiSuccess {String} data.prazo_resposta Estimated response time
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ip = req.ip || req.socket.remoteAddress || '0.0.0.0';
    const data = await contactCreate(req.body, ip);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
