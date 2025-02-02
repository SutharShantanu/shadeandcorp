import Image from 'next/image';
import React from 'react'

const TrustedBrand = () => {

    const logos = [
        {
            name: "Google",
            logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg",
        },
        {
            name: "Vercel",
            logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg",
        },
        {
            name: "Github",
            logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
        },
        {
            name: "Linkedin",
            logo: "https://www.vectorlogo.zone/logos/linkedin/linkedin-ar21.svg",
        },
        {
            name: "Microsoft",
            logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg",
        },
        {
            name: "Apple",
            logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg",
        },
        {
            name: "Tesla",
            logo: "https://www.vectorlogo.zone/logos/tesla/tesla-ar21.svg",
        },
    ]
    return (
        <div className="border border-red-500 mx-auto py-4">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-title font-forum">Trusted by these companies</h1>
                <p className="text-description mt-1 text-muted-foreground">Used by the world's leading companies</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
                    {logos.map((logo, index) => (
                        <Image
                            key={index}
                            src={logo.logo}
                            alt={`${logo.name} logo`}
                            width={100}
                            height={100}
                            className="w-36 max-w-[144px]"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrustedBrand;
