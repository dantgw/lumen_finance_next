// import 'dotenv/config';
import {
    Contract, SorobanRpc,
    TransactionBuilder,
    Networks,
    BASE_FEE,
    Address,
    nativeToScVal
} from "@stellar/stellar-sdk";
import { userSignTransaction } from './freighter';
import { getAddress } from '@stellar/freighter-api';


let rpcUrl = "https://soroban-testnet.stellar.org";
let contractAddress = 'CDLCXVC4JPATLFEOQGY736RQLT3MWMM2QC46CRI36FL4HZA35UU3E5UO';
let usdcAddress = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"

let tokenWasmHash = "c6fe61fb6c64cbe3e23cb52b059d43545875cf1bc2d396c6d901cfa51a712033"
let customUsdcAddress = "CD7DUUEY7CJ3K62T5N3WD7KMGKJMMRRKLH3B27Z2MHQT2VR2IPQABZHM"

const stringToSymbol = (value) => {
    return nativeToScVal(value, { type: "symbol" })
}

const accountToScVal = (account) => new Address(account).toScVal();


let params = {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
}

async function contractInt(caller, functName, values) {
    const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
    const contract = new Contract(contractAddress);
    const sourceAccount = await provider.getAccount(caller);
    let buildTx;
    if (values == null) {
        buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName))
        .setTimeout(30).build();
    }
    else {
        buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName, ...values))
        .setTimeout(30).build();
    }
    let _buildTx = await provider.prepareTransaction(buildTx);
    let prepareTx = _buildTx.toXDR();
    let signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);
    let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);
    try {
        let sendTx = await provider.sendTransaction(tx).catch(function (err) {
            return err;
        });
        if (sendTx.errorResult) {
            throw new Error("Unable to submit transaction");
        }
        if (sendTx.status === "PENDING") {
            let txResponse = await provider.getTransaction(sendTx.hash);
            while (txResponse.status === "NOT_FOUND") {
                txResponse = await provider.getTransaction(sendTx.hash);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            if (txResponse.status === "SUCCESS") {
                let result = txResponse.returnValue;
                return result;
            }
        }
    } catch (err) {
        return err;
    }
}

async function fetchPoll() {
    let caller = await getPublicKey();
    let result = await contractInt(caller, 'view_poll', null);
    let no = (result._value[0]._attributes.val._value).toString();
    let total = (result._value[1]._attributes.val._value).toString();
    let yes = (result._value[2]._attributes.val._value).toString()
    return [no, total, yes]
}

async function fetchVoter() {
    let caller = await getPublicKey();
    let voter = accountToScVal(caller);
    let result = await contractInt(caller, 'view_voter', [voter]);
    let selected = (result._value[0]._attributes.val._value).toString();
    let time = (result._value[1]._attributes.val._value).toString();
    let votes = (result._value[2]._attributes.val._value).toString();
    return [selected, time, votes]
}

async function vote(value) {
    let caller = await getPublicKey();
    let selected = stringToSymbol(value);
    let voter = accountToScVal(caller);
    let values = [voter, selected];
    let result = await contractInt(caller, 'record_votes', values);
    return result;
}

async function deposit(value) {
    let caller = await getAddress();
    // let selected = stringToSymbol(value);
    // let voter = accountToScVal(caller);
    // let values = [voter];
    let result = await contractInt(caller.address, 'record_votes');
    return result;
}

async function initializeContract(value) {
    let caller = await getAddress();
    // token_wasm_hash: BytesN<32>, 
    // usdc: Address, 
    // admin: Address, 
    // insurance: Address
    let hash = stringToSymbol(tokenWasmHash);
    let admin = accountToScVal(caller.address);
    let insurance = accountToScVal(caller.address)
    let usdc = accountToScVal(customUsdcAddress);
    let values = [hash, usdc, admin, insurance];
    let result = await contractInt(caller.address, 'initialize', values);
    return result;
}

async function getBalance() {
    let caller = await getAddress();
    let result = await contractInt(caller.address, 'get_balance_usdc', null);
    console.log("result",result);
    return result;
}

export { fetchPoll, fetchVoter, vote, deposit, initializeContract,getBalance };