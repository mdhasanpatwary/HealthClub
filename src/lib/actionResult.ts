/**
 * Standardized typed envelope for all Server Action responses.
 */

export type ActionResult<T = unknown> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      error: string;
      code?: string;
    };

/**
 * Creates a successful ActionResult envelope.
 */
export function actionSuccess<T>(data: T, message?: string): ActionResult<T> {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
}

/**
 * Creates a failed ActionResult envelope.
 */
export function actionError(error: string, code?: string): ActionResult<never> {
  return {
    success: false,
    error,
    ...(code ? { code } : {}),
  };
}
