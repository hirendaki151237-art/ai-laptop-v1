import { Request, Response, NextFunction } from 'express';
import { ERROR_CODES } from '../../shared/constants/index.ts';

export function getAdminApiKey(): string {
  if (process.env.ADMIN_API_KEY?.trim()) {
    return process.env.ADMIN_API_KEY.trim();
  }
  if (process.env.NODE_ENV !== 'production') {
    return 'v2-dev-admin-key';
  }
  return '';
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const headerKey = req.headers['x-admin-key'];
  const configuredKey = getAdminApiKey();

  if (typeof headerKey === 'string' && configuredKey && headerKey.trim() === configuredKey) {
    next();
    return;
  }

  res.status(403).json({
    error: {
      code: ERROR_CODES.FORBIDDEN,
      message: 'Admin authorization required.',
    },
  });
}
