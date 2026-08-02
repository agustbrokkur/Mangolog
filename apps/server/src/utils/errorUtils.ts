import { type Response } from "express";

export function handleError(res: Response, error: unknown, message: string) {
    console.error(error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
        message: `${message}: ${errorMessage}`,
    });
}