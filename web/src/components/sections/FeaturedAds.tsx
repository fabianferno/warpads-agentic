import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import Tweets from './Tweets';

interface AdCampaign {
  id: string;
  owner: string;
  metadata: {
    name: string;
    ad: string;
    description: string;
    imageHash: string;
    categories: string[];
  };
  priorityStake: number;
  expiry: number;
  active: boolean;
  chainId: number;
  createdAt: string;
  updatedAt: string;
  insights: Array<{
    id: string;
    adId: string;
    adSpaceId: string;
    requestedAt: string;
  }>;
}

export default function Ads() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/get-all-ads`)
      .then(res => res.json())
      .then(data => {
        // Filter unique ads by name (case-insensitive)
        const uniqueAds = data.reduce((unique: AdCampaign[], campaign: AdCampaign) => {
          const exists = unique.some(ad =>
            ad.metadata.name.toLowerCase().trim() === campaign.metadata.name.toLowerCase().trim()
          );
          if (!exists) {
            unique.push(campaign);
          }
          return unique;
        }, []);
        setCampaigns(uniqueAds);
      })
      .catch(console.error);
  }, []);

  if (campaigns.length === 0) return null;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Transform <span className="text-red-400">boring</span> ads into <span className="text-cyan-500">engaging agentic ads</span> with impact</h2>
        <p className="text-gray-400 text-lg text-center mb-8">These are actual ads live from the protocol</p>
      </div>

      <div className='flex justify-center items-center'>
        <Tweets direction='left' />
        <Marquee
          gradient={true}
          gradientColor="#0f172a"
          speed={40}
          pauseOnHover={true}
        >
          <div className="flex gap-6 py-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex-none w-[350px] bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-700/50 hover:border-slate-600"
              >
                <div className="relative h-[200px] w-full">
                  <Image
                    src={`https://gateway.pinata.cloud/ipfs/${campaign.metadata.imageHash}`}
                    alt={campaign.metadata.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {campaign.metadata.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {campaign.metadata.ad}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {campaign.metadata.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-slate-700 text-gray-300"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span>{campaign.insights.length} views</span>
                    </div>
                    <span className="text-emerald-400">
                      {campaign.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
} 