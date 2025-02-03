export const parseMetadata = (metadata: string) => {
  try {
    const metadataObject = JSON.parse(metadata);

    const ad = metadataObject.ad || "Unknown Ad";
    const name = metadataObject.name || "No name provided";
    const description =
      metadataObject.description || "No description available";
    const stakeAmount = metadataObject.stakeAmount || 0;
    const imageHash = metadataObject.imageHash || "No image available";
    const categories = metadataObject.categories?.join(", ") || "Uncategorized";

    return `The ad name is **${name}**. They are advertising **${ad}**. 
            They have a staked amount of **${stakeAmount}** for prioritizing their ad.
            Here is a brief description of the product:  
            "${description}"  
            They are in the following categories: **${categories}**  
            Image Hash: **${imageHash}**`;
  } catch (error) {
    console.error("Error parsing metadata:", error);
    return "Invalid metadata format.";
  }
};
