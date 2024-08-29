export const status = {
  ok: 200,
  badRequest: 400,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
} as const;

export type StatusCode = keyof typeof status;
