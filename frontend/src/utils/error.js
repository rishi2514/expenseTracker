// Extracts a user-facing message from anything the API layer can throw.
// The axios client rejects with the backend body ({ message, statusCode, ... })
// when a response is present, otherwise with the raw error.
export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  return (
    error?.message || error?.response?.data?.message || fallback
  );
};
