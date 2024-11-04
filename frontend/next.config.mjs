/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "minerva-s3-images.s3.ap-southeast-1.amazonaws.com",
          port: "",
          pathname: "/**",
        }
      ]
    }
  };
  
  export default nextConfig;