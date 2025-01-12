declare module 'crypto-browserify' {
  const crypto: {
    getRandomValues<T extends ArrayBufferView>(array: T): T;
    subtle: {
      importKey(
        format: 'raw' | 'pkcs8' | 'spki' | 'jwk',
        keyData: BufferSource | JsonWebKey,
        algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm,
        extractable: boolean,
        keyUsages: KeyUsage[]
      ): Promise<CryptoKey>;
      encrypt(
        algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
        key: CryptoKey,
        data: BufferSource
      ): Promise<ArrayBuffer>;
      decrypt(
        algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
        key: CryptoKey,
        data: BufferSource
      ): Promise<ArrayBuffer>;
      generateKey(
        algorithm: RsaHashedKeyGenParams | EcKeyGenParams,
        extractable: boolean,
        keyUsages: readonly KeyUsage[]
      ): Promise<CryptoKeyPair>;
    };
  };
  export = crypto;
}
