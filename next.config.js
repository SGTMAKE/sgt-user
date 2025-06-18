/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com","pagedone.io","images.unsplash.com"]
    },
    redirects: async () => {
        return [
            {
                source: '/store/c',
                destination: '/store',
                permanent: true,
            },
        ]
    }
}

module.exports = nextConfig
