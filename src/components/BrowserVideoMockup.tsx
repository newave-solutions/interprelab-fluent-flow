import { useState } from 'react';

interface BrowserVideoMockupProps {
    videoSrc?: string;
    posterSrc: string;
    alt: string;
    className?: string;
}

export const BrowserVideoMockup = ({
    videoSrc,
    posterSrc,
    alt,
    className = ''
}: BrowserVideoMockupProps) => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    return (
        <div className={`relative rounded-2xl shadow-lg p-2 h-full border border-border/50 flex flex-col overflow-hidden bg-background w-full max-w-6xl mx-auto ${className}`}>
            {/* Browser Chrome - Three Dots */}
            <div className="w-full px-2 pt-1 pb-3 relative flex items-center gap-1.5 lg:gap-2">
                <div className="w-2 h-2 bg-border rounded-full"></div>
                <div className="w-2 h-2 bg-border rounded-full"></div>
                <div className="w-2 h-2 bg-border rounded-full"></div>
            </div>

            {/* Video/Image Container */}
            <div className="h-full w-full aspect-video border border-border/30 overflow-hidden rounded-lg">
                <div className="relative w-full max-w-full h-full">
                    <div className="relative h-full w-full">
                        {videoSrc ? (
                            <>
                                {/* Video Element */}
                                <video
                                    className="relative z-10 block w-full h-full"
                                    height="100%"
                                    width="100%"
                                    loop
                                    autoPlay
                                    playsInline
                                    muted
                                    poster={posterSrc}
                                    onLoadedData={() => setIsVideoLoaded(true)}
                                >
                                    <source src={videoSrc} type="video/webm" />
                                    <source src={videoSrc.replace('.webm', '.mp4')} type="video/mp4" />
                                </video>

                                {/* Fallback Image (shown until video loads or if video fails) */}
                                {!isVideoLoaded && (
                                    <img
                                        alt={alt}
                                        loading="lazy"
                                        width="1920"
                                        height="1080"
                                        decoding="async"
                                        className="absolute inset-0 w-full h-full object-cover"
                                        src={posterSrc}
                                    />
                                )}
                            </>
                        ) : (
                            /* Static Image if no video */
                            <img
                                alt={alt}
                                loading="lazy"
                                width="1920"
                                height="1080"
                                decoding="async"
                                className="relative z-0 w-full h-full object-cover"
                                src={posterSrc}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
