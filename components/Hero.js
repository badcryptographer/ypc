import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStatus } from "../context/statusContext";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import Head from "next/head";




import {
  getMaxMintAmount,
  getTotalSupply,
  getNftPrice,
  mintNFT,
  getSaleState,
} from "../utils/interact";

import {
  Box,
  Center,
  Heading,
  HStack,
  Link,
  Img,
  Text,
  VStack,
} from '@chakra-ui/react'

const Hero = () => {
  const { status, setStatus } = useStatus();
  const [count, setCount] = useState(1);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxAmount] = useState(500);
  const [nftPrice, setNftPrice] = useState("0.01");
  const [isSaleActive, setIsSaleActive] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWalletAddress(walletResponse.address);
    setStatus(walletResponse.status);
  };


  useEffect(() => {
    
    const prepare = async () => {
      setMaxMintAmount(await getMaxMintAmount());
      setNftPrice(await getNftPrice());
      setIsSaleActive(await getSaleState());
      await updateTotalSupply();
      const walletResponse = await getCurrentWalletConnected();
      setWalletAddress(walletResponse.address);
      setStatus(walletResponse.status);

      addWalletListener();
      
    };

    prepare();
  });
  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setStatus("");
        } else {
          setWalletAddress("");
          setStatus("🦊 Connect to Metamask using Connect Wallet button.");
        }
      });
    }
  };

  const updateTotalSupply = async () => {
    const mintedCount = await getTotalSupply();
    setTotalSupply(mintedCount);
  };

  const incrementCount = () => {
    if (count < maxMintAmount) {
      setCount(count + 1);
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const mintYPC = async () => {
    const { status } = await mintNFT(count);
    setStatus(status);

    // We minted a new emoji face, so we need to update the total supply
    updateTotalSupply();
  };

  return (
    <>
    <Head>
        <title>YummyPandasClan-Minting-DAPP</title>
        <meta name="description" content="YPC Minting Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <main id="main" className="bg-pattern">
      
      <div className="container max-w-6xl mx-auto flex flex-col items-center pt-4">
        <div className="flex flex-col items-center">
          
          <Box
          mx="auto"
          w="50vh"
          alignItems="center"
          background="rgba(0, 0, 0, 0.4)"
          border="2px solid rgba(0, 0, 0, 0.2)"
          backdropFilter="blur(30px)"
          borderRadius="25px"
          textAlign="center"
          color="white"
          fontFamily={"Nunito"}
        >   
        <Image
            src="/images/previeww.png"
            width="150"
            height="130"
            alt=""
            className="rounded-md"
          />
          <Center alignItems="center" mx="auto" py={4}>
          <Link href="https://twitter.com/YummyPandas/" px={6}>
          <Image
            src="/images/twitter.png"
            width="45"
            height="45"
            alt=""
            className="rounded-md"
          />
          </Link>
          <Link href="https://discord.com/invite/GcDWuFjwtN" px={6}>
          <Image
            src="/images/discord.png"
            width="45"
            height="45"
            alt=""
            className="rounded-md"
          />
          </Link>
           <Link href="https://www.instagram.com/yummy_pandas_nft/" px={6}>
          <Image
            src="/images/instagram.png"
            width="45"
            height="45"
            alt=""
            className="rounded-md"
          />
          </Link>
          </Center>
         
            <>
              <Heading fontSize={"x-large"} fontFamily="Nunito" py={6}>
            MINT ONE NOW!
          </Heading>
              {/* Minted NFT Ratio */}
              <p className="bg-gray-800 rounded-md text-white-100 font-extrabold text-lg my-4 py-1 px-3">
                Remaining = <span className="text-purple-600">{`${maxAmount}` - `${totalSupply}`}</span>
                <Text textAlign="center" color={"orange"} fontFamily="Nunito">
                  LIVE
                  <Text as="span" color="red" ml={2}>
                    •
                  </Text>
                </Text>
              </p>
             
              <h4 className="mt-2 font-semibold text-center text-dark">
                {nftPrice} ETH{" "}
                
              </h4>

              {`${totalSupply}` === `${maxAmount}` ? (
              <button className="mintButton" disabled>
                Sold Out!
              </button>
            ) : walletAddress ? (
              <button className="mintButton" onClick={mintYPC}>
                Mint
              </button>
            ) : (
              <button className="mintButton" onClick={connectWalletPressed}>
                Continue with MetaMask
              </button>
            )}
            </>
          </Box>
          {/* Status */}
          {status && (
            <div className="flex items-center justify-center px-4 py-4 mt-8 font-semibold text-white bg-red-400 rounded-md ">
              {status}
            </div>
          )}
        </div>
      </div>
    </main>
    </>
  );
};

export default Hero;
