/**
 * AI Image Generation Service
 * 
 * Handles automatic image generation for app builds using OpenAI's gpt-image-1 model
 */

import { supabase } from "@/integrations/supabase/client";

export interface GenerateImageParams {
  prompt: string;
  size?: "1024x1024" | "1536x1024" | "1024x1536";
}

export interface ImageGenerationResult {
  imageUrl: string;
  prompt: string;
}

/**
 * Generate an image using OpenAI's gpt-image-1 model
 */
export async function generateImage(params: GenerateImageParams): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt: params.prompt,
        size: params.size || "1024x1024"
      }
    });
    
    if (error) {
      console.error('Image generation error:', error);
      throw error;
    }
    
    if (!data?.imageUrl) {
      throw new Error('No image URL returned from generation service');
    }
    
    return data.imageUrl;
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw error;
  }
}

/**
 * Detect placeholder image URLs in content
 * Returns array of placeholder URLs with descriptions
 */
export function extractPlaceholderImages(content: string): Array<{url: string, description: string}> {
  const placeholders: Array<{url: string, description: string}> = [];
  
  // Match via.placeholder.com URLs
  const viaPlaceholderRegex = /https?:\/\/via\.placeholder\.com\/\d+(?:\?text=([^"'\s)]+))?/g;
  let match;
  while ((match = viaPlaceholderRegex.exec(content)) !== null) {
    const url = match[0];
    const text = match[1] ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : 'Image';
    placeholders.push({ url, description: enhanceImagePrompt(text) });
  }
  
  // Match placehold.co URLs
  const placeholdCoRegex = /https?:\/\/placehold\.co\/\d+x?\d*(?:\?text=([^"'\s)]+))?/g;
  while ((match = placeholdCoRegex.exec(content)) !== null) {
    const url = match[0];
    const text = match[1] ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : 'Image';
    placeholders.push({ url, description: enhanceImagePrompt(text) });
  }
  
  return placeholders;
}

/**
 * Enhance a simple placeholder text into a better image generation prompt
 */
function enhanceImagePrompt(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Bakery-related keywords
  if (lowerText.includes('bread') || lowerText.includes('bakery')) {
    return `Fresh artisan ${text}, professional bakery photography, warm natural lighting, high quality`;
  }
  if (lowerText.includes('croissant') || lowerText.includes('pastry')) {
    return `Delicious ${text}, bakery setting, golden brown, appetizing food photography`;
  }
  if (lowerText.includes('cake') || lowerText.includes('dessert')) {
    return `Beautiful ${text}, elegant presentation, bakery display, professional food photography`;
  }
  
  // Generic enhancement
  return `Professional photo of ${text}, high quality, well-lit`;
}

/**
 * Parse AI response for image generation requests
 * Returns array of prompts that need images generated
 */
export function extractImageRequests(content: string): string[] {
  const regex = /GENERATE_IMAGE:\s*([^\n]+)/g;
  const matches = [...content.matchAll(regex)];
  return matches.map(m => m[1].trim());
}

/**
 * Process content and generate all requested images
 * Replaces GENERATE_IMAGE: commands with actual image URLs
 */
export async function processImageRequests(
  content: string,
  onProgress?: (prompt: string) => void
): Promise<string> {
  const imageRequests = extractImageRequests(content);
  
  if (imageRequests.length === 0) {
    return content;
  }

  let processedContent = content;
  
  // Generate images sequentially to avoid rate limits
  for (const prompt of imageRequests) {
    try {
      if (onProgress) {
        onProgress(prompt);
      }
      
      const imageUrl = await generateImage({ prompt });
      
      // Replace the GENERATE_IMAGE command with the actual image URL in markdown format
      const placeholder = `GENERATE_IMAGE: ${prompt}`;
      const replacement = `![${prompt}](${imageUrl})`;
      processedContent = processedContent.replace(placeholder, replacement);
      
      console.log(`Generated image for: ${prompt}`);
    } catch (error) {
      console.error(`Failed to generate image for "${prompt}":`, error);
      // Keep the placeholder if generation fails
    }
  }
  
  return processedContent;
}

/**
 * Detect if content contains image generation requests
 */
export function hasImageRequests(content: string): boolean {
  return /GENERATE_IMAGE:\s*[^\n]+/i.test(content);
}
