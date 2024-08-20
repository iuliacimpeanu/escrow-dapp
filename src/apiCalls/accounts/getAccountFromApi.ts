import { ACCOUNTS_ENDPOINT } from '../endpoints';
import { axiosInstance, getCleanApiAddress } from '../utils';

export const accountFetcher = (address: string | null) => {
  const apiAddress = getCleanApiAddress();
  const url = `${apiAddress}/${ACCOUNTS_ENDPOINT}/${address}?withGuardianInfo=true`;
  return axiosInstance.get(url);
};

export const getAccountFromApi = async (address?: string) => {
  if (!address) {
    return null;
  }

  try {
    const { data } = await accountFetcher(address);
    return data;
  } catch (err) {
    console.error('error fetching configuration for ', address, err);
  }

  return null;
};
