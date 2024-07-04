import { Request, Response, NextFunction } from 'express';

function myMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    next(); // Pasa el control al siguiente middleware o ruta
}

export default myMiddleware;