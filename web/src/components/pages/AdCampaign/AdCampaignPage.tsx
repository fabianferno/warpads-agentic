"use client";

import { useState } from "react";
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

export default function AdCampaignForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [daysRemaining, setDaysRemaining] = useState(0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-xl overflow-hidden p-[1px]">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

          <Card className="backdrop-blur-xl bg-slate-950/90 relative z-10">
            <CardContent className="p-6">
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Create Ad Campaign
                </h1>
                <p className="text-gray-300">
                  Reach your target audience effectively
                </p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Ad Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your campaign name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
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
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full flex items-center gap-2"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="text-xs hover:text-primary/80"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Detailed Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your ad campaign in detail..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oneLiner" className="text-white">
                    One-liner
                  </Label>
                  <Input
                    id="oneLiner"
                    value={oneLiner}
                    onChange={(e) => setOneLiner(e.target.value)}
                    placeholder="Short catchy phrase for your ad"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stake" className="text-white">
                    Stake Amount (Optional)
                  </Label>
                  <Input
                    id="stake"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter amount to prioritize your ad"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-400">
                    Staking tokens will prioritize your ad in our platform
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
                        className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        {deadline
                          ? deadline.toLocaleDateString()
                          : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
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
                    <p className="text-sm text-primary">
                      {daysRemaining} days remaining
                    </p>
                  )}
                  {daysRemaining === 0 && deadline && (
                    <p className="text-sm text-yellow-500">
                      Deadline is today!
                    </p>
                  )}
                  <p className="text-sm text-gray-400">
                    Select the end date for your campaign
                  </p>
                </div>

                {/* Rest of the form fields... */}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Launch Ad Campaign
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
