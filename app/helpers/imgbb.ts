// Purpose: Helper function to get the imgbb url for a given image url || base64 encoded image.

// Imports
import axios from 'axios';

// API Details
// URL : https://api.imgbb.com/1/upload
// Method : POST
// Parameters:
// - key (required): The API key.
// - image (required): A binary file, base64 data, or a URL for an image. (up to 32 MB)
// - name (optional): The name of the file, this is automatically detected if uploading a file with a POST and multipart/form-data
// - expiration (optional): Enable this if you want to force uploads to be auto deleted after certain time (in seconds 60-15552000)

// Constants
const api_url = "https://api.imgbb.com/1/upload?key=";

// Types
// Request types
type Image = string;
// Response types
type IMGBBResponse = {
    success: boolean;
    imageURL: IMGBB | null;
}

export type IMGBB = {
    url: string | null;
    thumb: string | null;
}

export default async function getImgbbUrl(image : Image) : Promise<IMGBBResponse> {
    // API Key
    const api_key = process.env.NEXT_PUBLIC_IMBB_API_KEY;
    
    // Request Body - Form Data
    const formData = new FormData();
    formData.append('image', image);


    try {
        // Fetch Request
        const res = await axios.post(api_url+`${api_key}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const data = res.data;
        if(!data.success){
            console.error("Error uploading image to imgbb:", data.error.message);
            throw new Error("Image upload failed");
        }
        const imgdata = data.data;
        
        return {
            success: true,
            imageURL: {
                url: imgdata.image?.url || null,
            thumb: imgdata.thumb?.url || null
            }
        };
    } catch (error) {
        console.error("Error uploading image to imgbb:", error);
        return {
            success: false,
            imageURL: null
        };
    }

}