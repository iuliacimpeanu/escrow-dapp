import axios from 'axios';


import { ACCOUNTS_ENDPOINT } from '../endpoints';
import { networkConfigSelector } from '../../reduxStore/selectors';
import { store } from '../../reduxStore/store';
import { ScamInfoType } from '../../types/account.types';

export async function getScamAddressData(addressToVerify: string) {
  const {
    network: { apiAddress, apiTimeout }
  } = networkConfigSelector(store.getState());

  const { data } = await axios.get<{
    scamInfo?: ScamInfoType;
    code?: string;
  }>(`${apiAddress}/${ACCOUNTS_ENDPOINT}/${addressToVerify}`, {
    timeout: Number(apiTimeout)
  });

  return data;
}
