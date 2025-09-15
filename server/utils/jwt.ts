// @deno-types="https://deno.land/x/typescript/lib/lib.dom.d.ts"

export interface JwtPayload {
  id: string;
  login?: string;
  exp?: number;
}

export class JwtUtils {
  private static base64UrlEncode(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '');
  }

  private static base64UrlDecode(str: string): BufferSource {
    const padded = str
      .replaceAll('-', '+')
      .replaceAll('_', '/')
      .padEnd(str.length + (4 - (str.length % 4)) % 4, '=');

    const binaryString = atob(padded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes as BufferSource;
  }

  static async sign(payload: JwtPayload, secret: string, expiresIn: string): Promise<string> {
    const payloadCopy = { ...payload };
    const header = { alg: 'HS256' };

    const now = Math.floor(Date.now() / 1000);
    const timeValue = parseInt(expiresIn);
    const timeUnit = expiresIn.replace(timeValue.toString(), '');

    let seconds = timeValue;
    if (timeUnit === 'm') seconds *= 60;
    else if (timeUnit === 'h') seconds *= 3600;
    else if (timeUnit === 'd') seconds *= 86400;
    payloadCopy.exp = now + seconds;

    const encodedHeader = this.base64UrlEncode(
      new TextEncoder().encode(JSON.stringify(header))
    );
    const encodedPayload = this.base64UrlEncode(
      new TextEncoder().encode(JSON.stringify(payloadCopy))
    );

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    );

    const encodedSignature = this.base64UrlEncode(new Uint8Array(signature));

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  static async verify(token: string, secret: string): Promise<JwtPayload> {
    const parts = token.split('.');
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    if (parts.length !== 3 || !encodedHeader || !encodedPayload || !encodedSignature) {
      throw new Error('Invalid token format.');
    }

    const signature = this.base64UrlDecode(encodedSignature);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    );

    if (!isValid) {
      throw new Error('Invalid token signature.');
    }

    const payloadBytes = this.base64UrlDecode(encodedPayload);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload: JwtPayload = JSON.parse(payloadJson);

    if (typeof payload !== 'object' || payload === null) {
      throw new Error('Invalid payload structure.');
    }
    if (!('id' in payload)) {
      throw new Error('Missing required claim: id.');
    }
    if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired.');
    }

    return payload;
  }
}
