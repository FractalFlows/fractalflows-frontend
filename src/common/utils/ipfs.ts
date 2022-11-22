export const getCIDFromIPFSURI = (uri: string) => uri.split("/")?.[2];
export const getFilenameFromIPFSURI = (uri: string) => uri.split("/")?.[3];
export const getCIDAndFilenameFromIPFSURI = (uri: string) =>
  uri.replace(/^ipfs:\/\//, "");
export const getGatewayFromIPFSURI = (uri: string) =>
  `https://${getCIDFromIPFSURI(uri)}.ipfs.w3s.link/${getFilenameFromIPFSURI(
    uri
  )}`;
