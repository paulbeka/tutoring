// Web3Forms form access keys are public identifiers, not secret API credentials.
export const web3formsAccessKey =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? "";
