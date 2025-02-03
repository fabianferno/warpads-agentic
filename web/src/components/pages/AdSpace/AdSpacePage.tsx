"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function AdspaceForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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

              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Agent Name
                  </Label>
                  <Input
                    id="name"
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
                          src={imagePreview || "/placeholder.svg"}
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
  );
}
