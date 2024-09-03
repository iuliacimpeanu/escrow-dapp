import { Address, SmartContractTransactionsFactory, Token, TokenTransfer } from "@multiversx/sdk-core/out";
import { ContractAddressEnum } from "../../../utils/enums";
import { parseAmount } from "@multiversx/sdk-dapp/utils/operations";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const initialValues = {
  selectToken: '',
  amount: ''
}
const validationSchema = Yup.object({
    selectToken: Yup.string().required('Please select a token!'),
    amount: Yup.string().required('Please insert amount!')
});

export const LockTokensSection = ({wallet_address, factory, tokenOptions, checkAvailableAmount, whitelistedTokens}: {wallet_address: string, factory: SmartContractTransactionsFactory, tokenOptions: { identifier: string, balance: string }[], checkAvailableAmount: (token: string) => string, whitelistedTokens: string[]}) => {

  const lockTransaction = async (token: string, amount: string) => {

    let availableAmount: string = checkAvailableAmount(token)
    if(!whitelistedTokens.includes(token)) {
        alert('Token is not whitelisted!')
        return
    } else if (Number(amount) > Number(availableAmount)){
      alert('Insufficient funds! Transaction is cancelled!')
      return;
    }

    let _lockAmount: bigint = BigInt(parseAmount(amount));
    const tx = factory.createTransactionForExecute({
        sender: Address.fromBech32(wallet_address),
        contract: Address.fromBech32(ContractAddressEnum.liquidLockingContract),
        function: "lock",
        gasLimit: 30000000n,
        arguments: [],
        tokenTransfers: [
            new TokenTransfer({
                token: new Token({ identifier: token }),
                amount: _lockAmount
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
              lockTransaction(values.selectToken, values.amount)
              resetForm();
            }}
    >
      {({ handleSubmit }) => (  
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col p-6 px-10 rounded-xl m-2 bg-mvx-bg-gray justify-center">
            <h2 className="flex font-medium group text-sm text-gray-300">Lock Tokens</h2>
            <div className="mt-5">
              <div className="flex items-center gap-5">
                <Field 
                as="select"
                name="selectToken"
                className="w-1/2 px-6 py-3 rounded-md text-sm font-medium bg-mvx-button-bg-gray text-mvx-text-gray"
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
                <Field as="input" name="amount" type="text" placeholder="Amount" className="w-1/2 rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300"></Field>
              </div>
              <div className="flex items-center gap-5">
                <ErrorMessage name="selectToken" render={msg => <div className="w-1/2 flex justify-start ml-2 text-red-500 text-xs mt-2">{msg}</div>} />
                <ErrorMessage name="amount" render={msg => <div className="w-1/2 flex justify-start ml-2 text-red-500 text-xs mt-2">{msg}</div>} />
              </div>
              <button type="submit" className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm font-normal">Lock Token</button>
            </div>
          </div>
        </Form>
      )}
    </Formik>    
  )
}