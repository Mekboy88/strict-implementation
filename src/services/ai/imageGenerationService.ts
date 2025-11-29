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
