export const denominateValue = (input: string) : bigint => {
    return BigInt(parseFloat(input) * 10**18)
}