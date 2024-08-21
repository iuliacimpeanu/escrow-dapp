export const nominateValue = (input: string) : number => {
        return Number(BigInt(input)) / (10**18)
}
