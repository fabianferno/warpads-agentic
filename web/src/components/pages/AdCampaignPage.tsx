"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Upload, Loader2, ExternalLink } from "lucide-react";
import { useAccount, useChainId, useWriteContract, useWatchContractEvent } from "wagmi";
import Image from "next/image";
import { contractsConfig } from "@/lib/const";
import { WarpadsABI } from "@/lib/abi/Warpads";
import type { PinataSDK } from "pinata-web3";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import { addTokenToWallet } from "@/lib/addTokenToWallet";

export default function AdCampaignForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ad, setAd] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { address } = useAccount();
  const [pinata, setPinata] = useState<PinataSDK | null>(null);
  const chainId = useChainId();
  const { writeContract, isPending: isSubmitting, error: submitError } = useWriteContract();

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
        toast.error("Failed to initialize file upload service");
      }
    };
    initPinata();
  }, []);

  // Handle submit errors
  useEffect(() => {
    if (submitError) {
      console.error(submitError);
      toast.error(submitError?.message || "Failed to process transaction. Please try again.");
    }
  }, [submitError]);

  // Watch for CampaignRegistered events
  useWatchContractEvent({
    address: contractsConfig[chainId]?.warpadsAddress,
    abi: WarpadsABI,
    eventName: 'CampaignRegistered',
    onLogs(logs) {
      const event = logs[0];
      if (event && event.transactionHash) {
        toast.success(
          <div className="space-y-2">
            <div>Campaign registered successfully!</div>
            <div className="flex flex-col gap-2">
              <a
                href={`${contractsConfig[chainId]?.blockExplorerUrl}/tx/${event.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                View transaction <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => addTokenToWallet(chainId)}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                Add WARP to wallet <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      }
    },
  });

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
      toast.error("Failed to upload image");
      throw error;
    }
  };

  const handleAddCategory = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentCategory.trim()) {
      e.preventDefault();
      setCategories([...categories, currentCategory.trim()]);
      setCurrentCategory("");
    }
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const calculateDaysRemaining = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const today = new Date();
    const timeDifference = selectedDate.getTime() - today.getTime();
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
    setDaysRemaining(days);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!pinata) {
      toast.error("File upload service not initialized");
      return;
    }

    const contractConfig = contractsConfig[chainId];
    if (!contractConfig?.warpadsAddress) {
      toast.error("Contract not deployed on this network");
      return;
    }

    try {
      const imageHash = await uploadImageToPinata();
      const formData = {
        name,
        ad,
        description,
        stakeAmount,
        imageHash,
        categories,
      };
      const metadataURI = await pinata.upload.json(formData);

      writeContract({
        address: contractConfig.warpadsAddress,
        abi: WarpadsABI,
        functionName: "registerCampaign",
        args: [
          BigInt(daysRemaining),
          BigInt(parseFloat(stakeAmount) * 10 ** 18),
          metadataURI.IpfsHash,
        ],
      });
    } catch (error) {
      console.error("Error submitting campaign:", error);
      toast.error("Failed to submit campaign");
    }
  };

  return (
    <MainLayout>
      <div className="relative isolate min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 md:p-8">
        <div
          className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-20"
          aria-hidden="true"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-500 to-cyan-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-4xl">
          <Card className="backdrop-blur-xl bg-slate-900/50 border-slate-800/50 ring-1 ring-white/10">
            <CardContent className="p-6">
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 text-transparent bg-clip-text">
                  Post an Ad
                </h1>
                <p className="text-slate-400">
                  Start your ad campaign today and reach your target audience
                </p>
              </div>


              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Campaign Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your campaign name"
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 ring-1 ring-slate-700/50 focus:ring-cyan-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categories" className="text-white">
                    Categories (Press Enter to add)
                  </Label>
                  <Input
                    id="categories"
                    value={currentCategory}
                    onChange={(e) => setCurrentCategory(e.target.value)}
                    onKeyDown={handleAddCategory}
                    placeholder="Add campaign categories"
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 ring-1 ring-slate-700/50 focus:ring-cyan-500/30"
                  />
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center gap-2"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="text-xs hover:text-cyan-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad" className="text-white">
                    Advertisement
                  </Label>
                  <Input
                    id="ad"
                    value={ad}
                    onChange={(e) => setAd(e.target.value)}
                    placeholder="What are you advertising?"
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 ring-1 ring-slate-700/50 focus:ring-cyan-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Detailed Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product or service in detail..."
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 ring-1 ring-slate-700/50 focus:ring-cyan-500/30 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stake" className="text-white">
                    Stake Amount (WARP)
                  </Label>
                  <Input
                    id="stake"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter amount to prioritize your ad"
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 ring-1 ring-slate-700/50 focus:ring-cyan-500/30"
                  />
                  <p className="text-sm text-slate-400">
                    Staking WARP tokens will prioritize your ad in our platform
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-white">
                    Campaign Deadline
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full bg-slate-800/40 border-slate-700/50 text-white hover:bg-slate-700/50 ring-1 ring-slate-700/50"
                      >
                        {deadline
                          ? deadline.toLocaleDateString()
                          : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700/50">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={(date) => {
                          setDeadline(date);
                          calculateDaysRemaining(date);
                        }}
                        fromDate={new Date()}
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  {daysRemaining > 0 && (
                    <p className="text-sm text-cyan-400">
                      {daysRemaining} days remaining
                    </p>
                  )}
                  {daysRemaining === 0 && deadline && (
                    <p className="text-sm text-yellow-500">
                      Deadline is today!
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-white">
                    Campaign Image
                  </Label>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-full h-48 relative border-2 border-dashed border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/40">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
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
                  disabled={isSubmitting}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 hover:text-white h-12 text-lg font-semibold transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Confirm in Wallet...
                    </div>
                  ) : (
                    "Launch Campaign"
                  )}
                </Button>

                <div className="mt-4 text-center text-sm text-slate-400">
                  <p>Make sure you have enough WARP tokens for staking</p>
                  <p className="mt-1">
                    Please allow a few moments for the transaction to process
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
