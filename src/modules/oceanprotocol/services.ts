export const OceanProtocolService = {
  _providerURL: process.env.NEXT_PUBLIC_OCEAN_PROVIDER_URL,

  _getURL(service: string) {
    return `${process.env.NEXT_PUBLIC_OCEAN_PROVIDER_URL}/api/services/${service}`;
  },

  async encrypt(data: any): Promise<string> {
    try {
      const response = await fetch(this._getURL("encrypt"), {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/octet-stream" },
        // signal,
      });
      return await response.text();
    } catch (e) {
      throw new Error("HTTP request failed calling Provider");
    }
  },
};
