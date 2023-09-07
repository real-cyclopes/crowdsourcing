import { TLangCodes } from './types';
const N_PLACEHOLDER = '-n-Qh_Q1A-';

export function createToken(length = 64): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getBearer(req: any): string | undefined {
  const headers = req?.req?.rawHeaders as Array<string>;
  if (!headers) {
    return undefined;
  }
  const Bearer = headers
    .find((value) => value.includes('Bearer'))
    ?.replace('Bearer', '')
    .trim();
  if (Bearer) return Bearer;
  const bearer = headers
    .find((value) => value.includes('bearer'))
    ?.replace('bearer', '')
    .trim();
  if (bearer) return bearer;
}

export function validateEmail(email: string): boolean {
  if (email.includes('@') && email.includes('.')) {
    return true;
  }
  return false;
}

export function justBearerHeader(bearer: string): any {
  return {
    req: {
      rawHeaders: [`Bearer ${bearer}`],
    },
  };
}

export function get_avatar_image_url(object_key: string | null): string | null {
  if (object_key) {
    return `https://[TODO]-public.s3.us-east-2.amazonaws.com/${object_key}`;
  }
  return null;
}

export function calc_vote_weight(upvotes: number, downvotes: number): number {
  return upvotes * 2 - downvotes;
}

export const putLangCodesToFileName = (
  file_name: string,
  langCodes: TLangCodes,
): string => {
  if (!langCodes.language_code) {
    throw new Error(`language_code insn't provided!`);
  }
  const nameParts = file_name.split('.');
  const suffixes = nameParts.slice(1);
  let fname = nameParts[0];
  if (langCodes.language_code) {
    fname += `.${langCodes.language_code}`;
  }
  if (langCodes.dialect_code) {
    fname += `-${langCodes.dialect_code}`;
  }
  if (langCodes.geo_code) {
    fname += `-${langCodes.geo_code}`;
  }
  fname += '.' + suffixes.join('.');
  return fname;
};

export function substituteN<T extends string | Array<string>>(inStr: T): T {
  if (Array.isArray(inStr)) {
    return inStr.map((chunk) => chunk.replaceAll('\n', N_PLACEHOLDER)) as T;
  } else {
    return inStr.replaceAll('\n', N_PLACEHOLDER) as T;
  }
}
export function unSubstituteN<T extends string | Array<string>>(inStr: T): T {
  if (Array.isArray(inStr)) {
    return inStr.map((chunk) => chunk.replaceAll(N_PLACEHOLDER, '\n')) as T;
  } else {
    return inStr.replaceAll(N_PLACEHOLDER, '\n') as T;
  }
}
