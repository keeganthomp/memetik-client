/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  GetTokenMetaPresignedUrlQuery,
  GetTokenMetaPresignedUrlQueryVariables,
  FileUploadType,
} from '@/graphql/__generated__/graphql';
import { GET_TOKEN_META_PRESIGNED_URL } from '@/graphql/queries';

const TOKEN_METADATA_BUCKET = 'memetik-token-meta';

interface UseAwsResult {
  uploadTokenImage: (
    mintAddress: UploadTokenAssetProps['mintAddress'],
    file: File
  ) => Promise<string | null>;
  uploadTokenMetadata: (
    mintAddress: UploadTokenAssetProps['mintAddress'],
    tokenMetadata: Record<string, string>
  ) => Promise<string | null>;
  uploading: boolean;
  error: string | null;
}

interface UploadTokenAssetProps {
  mintAddress: string;
  fileType: string;
  assetType: FileUploadType;
  file: Blob;
}

const getAssetUrl = (key: string) => {
  return `https://${TOKEN_METADATA_BUCKET}.s3.us-west-1.amazonaws.com/${key}`;
};

const useAws = (): UseAwsResult => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [getTokenMetaPresignedUrl] = useLazyQuery<GetTokenMetaPresignedUrlQuery>(
    GET_TOKEN_META_PRESIGNED_URL,
    {
      fetchPolicy: 'network-only',
    }
  );

  const uploadTokenAsset = async ({
    mintAddress,
    fileType,
    assetType,
    file,
  }: UploadTokenAssetProps): Promise<string | null> => {
    setUploading(true);
    setError(null);
    try {
      const variables: GetTokenMetaPresignedUrlQueryVariables = {
        mintAddress,
        fileType,
        assetType,
      };
      const { data: presignedResponse } = await getTokenMetaPresignedUrl({ variables });
      if (!presignedResponse?.getTokenMetaPresignedUrl) {
        throw new Error('Failed to get presigned URL');
      }
      const { key, url } = presignedResponse.getTokenMetaPresignedUrl;
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': fileType,
        },
      });
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }
      const assetUrl = getAssetUrl(key);
      return assetUrl;
    } catch (err: any) {
      setError(err?.message || 'Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadTokenImage = (
    mintAddress: UploadTokenAssetProps['mintAddress'],
    file: File
  ): Promise<string | null> => {
    const fileType = file.type;
    const assetType = FileUploadType.TokenImage;
    return uploadTokenAsset({
      mintAddress,
      fileType,
      assetType,
      file,
    });
  };

  const uploadTokenMetadata = async (
    mintAddress: UploadTokenAssetProps['mintAddress'],
    tokenMetadata: Record<string, string>
  ): Promise<string | null> => {
    const fileType = 'application/json';
    const assetType = FileUploadType.TokenMetadataJson;
    const jsonString = JSON.stringify(tokenMetadata, null, 2); // Pretty-print with 2-space indentation
    const blob = new Blob([jsonString], { type: fileType });
    return uploadTokenAsset({
      mintAddress,
      fileType,
      assetType,
      file: blob,
    });
  };

  return { uploadTokenImage, uploadTokenMetadata, uploading, error };
};

export default useAws;
