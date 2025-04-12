/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: false, // Disables body parsing, as we'll handle streaming manually
    responseLimit: false, // Removes the response size limit
  },
};

module.exports = nextConfig;
