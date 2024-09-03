import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { SmartContractTransactionsFactory} from "@multiversx/sdk-core"
import { Address, TokenTransfer, Token } from "@multiversx/sdk-core/out";
import { ContractAddressEnum  } from "../../../utils";
import { parseAmount } from "@multiversx/sdk-dapp/utils";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const initialValues = {
  selectToken: '',
  offeredAmount: '',
  acceptedToken: '',
  acceptedAmount: '',
  acceptedAddress: ''
}
const validationSchema = Yup.object({
    selectToken: Yup.string().required('Please select offered token!'),
    offeredAmount: Yup.string().required('Please insert offered amount!'),
    acceptedToken: Yup.string().required('Please insert accepted token!'),
    acceptedAmount: Yup.string().required('Please insert accepted amount!'),
    acceptedAddress: Yup.string().required('Please insert accepted address!')
});

export const CreateOfferSection = ({ wallet_address, tokenOptions, checkAvailableAmount, escrow_factory }: { wallet_address: string, tokenOptions: { identifier: string, balance: string }[], checkAvailableAmount: (token: string) => string, escrow_factory: SmartContractTransactionsFactory }) => {

    const createOffer = async (offeredToken: string, offeredAmount: string, acceptedToken: string, acceptedAmount: string, acceptedAddress: string) => {

      let availableAmount = checkAvailableAmount(offeredToken)
      if(Number(offeredAmount) > Number(availableAmount)){
        alert('Insufficient funds! Check available amount!\nTransaction is cancelled!')
        return;
      }

      let _acceptedAmount: bigint = BigInt(parseAmount(acceptedAmount));
      let _offeredAmount: bigint = BigInt(parseAmount(offeredAmount));

      let args = [acceptedToken, 0, _acceptedAmount, acceptedAddress]

      const tx = escrow_factory.createTransactionForExecute({
          sender: Address.fromBech32(wallet_address),
          contract: Address.fromBech32(ContractAddressEnum.escrowContract),
          function: "createOffer",
          gasLimit: 30000000n,
          arguments: args,
          tokenTransfers: [
              new TokenTransfer({
                  token: new Token({ identifier: offeredToken }),
                  amount: _offeredAmount
              })
          ]
      });

      if (tx == null) {
        console.error("Transaction not found");
        return;
      }
  
      await sendTransactions({
        transactions: [tx],
        transactionsDisplayInfo: {
          processingMessage: "Processing transaction",
          errorMessage: "An error has occured",
          successMessage: "Transaction successful",
        },
        signWithoutSending: false,
      });
    }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} 
            onSubmit={(values, { resetForm }) => {
              createOffer(values.selectToken, values.offeredAmount, values.acceptedToken, values.acceptedAmount, values.acceptedAddress)
              resetForm();
            }}
    >
      {({ handleSubmit }) => (  
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col p-4 px-10 rounded-xl m-2 justify-center bg-mvx-bg-gray">
              <h2 className="flex font-medium group text-sm text-gray-300">Create Offer</h2>
              <div className="flex flex-col items-center my-5 font-normal">
                <div className="w-full flex flex-col gap-5">
                  <div className="flex items-center gap-5 w-full">
                    <div className="flex flex-col items-start gap-1 w-1/2">
                      <label htmlFor="offered_token" className="text-xs text-mvx-lighter-gray">Offered Token</label>
                      <Field 
                        as="select"
                        name="selectToken" 
                        className="px-6 py-3 rounded-lg text-sm font-medium bg-mvx-button-bg-gray text-mvx-text-gray w-full"
                        >
                          <option value="" disabled>
                            Select token
                          </option>
                          {tokenOptions.map((tokenOption, index) => (
                            <option key={index} value={tokenOption.identifier}>
                              {tokenOption.identifier}
                            </option>
                          ))}
                      </Field>
                    </div>
                    <div className="flex flex-col items-start gap-1 w-1/2">
                      <label htmlFor="offered_amount" className="text-xs text-mvx-lighter-gray">Offered Amount</label>
                      <Field as="input" id="offered_amount" name="offeredAmount" type="text" className="rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300 w-full"></Field>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <ErrorMessage name="selectToken" render={msg => <div className="w-1/2 flex justify-start ml-2 text-red-500 text-xs -mt-5">{msg}</div>} />
                    <ErrorMessage name="offeredAmount" render={msg => <div className="w-1/2 flex justify-start ml-2 text-red-500 text-xs -mt-5">{msg}</div>} />
                  </div>

                  <div className="flex items-center gap-5 w-full">
                    <div className="flex flex-col items-start gap-1 w-1/2">
                      <label htmlFor="accepted_token" className="text-xs text-mvx-lighter-gray">Accepted Token</label>
                      <Field name="acceptedToken" id="accepted_token" type="text" className="rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300 w-full"></Field>
                    </div>

                    <div className="flex flex-col items-start gap-1 w-1/2">
                      <label htmlFor="accepted_amount" className="text-xs text-mvx-lighter-gray">Accepted Amount</label>
                      <Field name="acceptedAmount" id="accepted_amount" type="text" className="rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300 w-full"></Field>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <ErrorMessage name="acceptedToken" render={msg => <div className="w-1/2 flex justify-start ml-2 text-red-500 text-xs -mt-5">{msg}</div>} />
                    <ErrorMessage name="acceptedAmount" render={msg => <div className="w-1/2 flex justify-start ml-2 text-red-500 text-xs -mt-5">{msg}</div>} />
                  </div>

                  <div className="flex flex-col items-start gap-1 w-full">
                    <label htmlFor="accepted_address" className="text-xs text-mvx-lighter-gray">Accepted Address</label>
                    <Field name="acceptedAddress" id="accepted_address" type="text" className="rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300 w-full"></Field>
                  </div>
                  <ErrorMessage name="acceptedAddress" render={msg => <div className="w-1/2 flex justify-start ml-2 text-red-500 text-xs -mt-5">{msg}</div>} />
                </div>
                <button
                type="submit"
                className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm"
                >
                Create offer
                </button>
              </div>
          </div>
        </Form>
      )}
    </Formik>      
  );
};
