import { PeraWalletConnect } from '@perawallet/connect';
import { SignerTransaction } from '@perawallet/connect/dist/util/model/peraWalletModels';
import { Modes, Ultrade, WalletKeys, useProvideWallet } from '@ultrade/react-embed';
import React, { useEffect, useMemo, useState } from 'react'

export const App = () => {
    const [accountAddress, setAccountAddress] = useState< string | null>(null);

    const peraWallet = useMemo(() => new PeraWalletConnect({
        chainId: 416002,
        shouldShowSignTxnToast: true,
    }), []);
    
    const { setSignFunction, clearSignFunction } = useProvideWallet();

    /////////
    //You need this code to allow us to sign transactions from Ultrade App
    //You need it only if you going to use Wallet Inheritance
    useEffect(() => {
        setSignFunction(WalletKeys.Pera, (tx: SignerTransaction[][]) => peraWallet.signTransaction(tx));
        return () => clearSignFunction(WalletKeys.Pera);
    }, [setSignFunction, clearSignFunction, peraWallet]);
    ///////////

    /////////
    //Default pera wallet functions
    function handleDisconnectWalletClick() {
        peraWallet.disconnect();
        setAccountAddress(null);
    }
    
    function handleConnectWalletClick() {
        peraWallet
            .connect()
            .then((newAccounts) => {
                peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
                setAccountAddress(newAccounts[0]);
            })
            .catch((error) => {
                if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                    console.log(error);
                }
            });
    }
    
    useEffect(() => {
        peraWallet.reconnectSession().then(async (accounts) => {
            peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
            if (accounts.length) {
                setAccountAddress(accounts[0]);
            }
        });
    }, []);
    /////////
           
    return (
        <>
            <button
                onClick={Boolean(accountAddress) ? handleDisconnectWalletClick : handleConnectWalletClick}>
                {Boolean(accountAddress) ? "Disconnect" : "Connect to Pera Wallet"}
            </button>

            <div>account address {accountAddress}</div>
            
            {/* This is how you can add Ultrade embed. To use widget moe add mode={Modes.WIDGET} in Ultrade attributes */}
            <div style={{height: '1200px', width: '100%'}}><Ultrade walletInheritance={true} src={'https://testnet.ultrade.org'} /></div>
        </>
    );
}