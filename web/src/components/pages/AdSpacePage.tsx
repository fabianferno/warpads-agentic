"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { contractsConfig } from "@/lib/const";
import { WarpadsABI } from "@/lib/abi/Warpads";
import { useAccount } from "wagmi";
import type { PinataSDK } from "pinata-web3";
import { useChainId } from "wagmi";
import MainLayout from "../layouts/MainLayout";

export default function AdspaceForm() {
  const [agentName, setAgentName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { address } = useAccount();
  const [pinata, setPinata] = useState<PinataSDK | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletClient, setWalletClient] = useState<any>(null);

  const chainId = useChainId();

  useEffect(() => {
    const initPinata = async () => {
      try {
        const { PinataSDK } = await import("pinata-web3");
        setPinata(
          new PinataSDK({
            pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
            pinataGateway: "orange-select-opossum-767.mypinata.cloud",
          })
        );
      } catch (error) {
        console.error("Failed to initialize Pinata:", error);
      }
    };
    initPinata();
  }, []);

  useEffect(() => {
    const initWalletClient = async () => {
      const { walletClient } = await import("@/lib/config");
      setWalletClient(walletClient);
    };
    initWalletClient();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToPinata = async () => {
    try {
      if (!imageFile || !pinata) {
        throw new Error("No image file selected or Pinata not initialized");
      }
      const response = await pinata.upload.file(imageFile);
      console.log("Image uploaded to Pinata: ", response);
      return response.IpfsHash;
    } catch (error) {
      console.error("Error uploading image to Pinata: ", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinata || !walletClient) {
      console.error("Pinata or wallet client not initialized");
      return;
    }
    const cid = await uploadImageToPinata();
    const formData = {
      name: agentName,
      purpose: purpose,
      description: description,
      stakeAmount: stakeAmount,
      imageCID: cid,
    };
    const response = await pinata.upload.json(formData);
    console.log("Form data uploaded to Pinata: ", response);
    console.log("Make Contract Call");

    const tx = await walletClient.writeContract({
      address: contractsConfig[chainId].warpadsAddress,
      abi: WarpadsABI,
      functionName: "registerAgent",
      args: [response.IpfsHash, BigInt(parseFloat(stakeAmount) * 10 ** 18)],
      account: address as `0x${string}`,
    });
    console.log(tx);
    console.log("Submitting form: ", formData);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-xl overflow-hidden p-[1px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <Card className="backdrop-blur-xl bg-slate-950/90 relative z-10">
              <CardContent className="p-6">
                <div className="mb-8 text-center">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Agent Adspace
                  </h1>
                  <p className="text-gray-300">
                    List your agent and reach thousands of potential users
                  </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Agent Name
                    </Label>
                    <Input
                      id="name"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="Enter your agent's name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose" className="text-white">
                      Purpose
                    </Label>
                    <Input
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="What does your agent do?"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us more about your agent..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stake" className="text-white">
                      Stake Amount (ETH)
                    </Label>
                    <Input
                      id="stake"
                      type="number"
                      step="0.01"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-white">
                      Agent Image
                    </Label>
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-full h-48 relative border-2 border-dashed border-white/20 rounded-lg overflow-hidden">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Upload className="w-8 h-8 mb-2" />
                            <p>Drop your image here or click to upload</p>
                          </div>
                        )}
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    List Agent
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
