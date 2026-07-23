import React from "react";

interface SharedLayoutProps {
    id: string;
    eyebrow: string;
    title: string;
    description?: string; //optional description
    children: React.ReactNode;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({
    id, eyebrow, title, description, children,
}) => {
    return (
        <section id={id} className="mb-20 scroll-mt-20">
            <div className="mb-8">
                {/* //make the eyebrow text the same maroon as the bg in the pages, the other text is gray for now */}
                <p className = "text-xs font-semibold text-[#530A24] uppercase mb-2">{eyebrow}</p> 
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
                {description && ( //only if a description exists because it is optional
                    <p className="text-gray-500 text-sm max-w-[560px]">{description}</p>
                )}
            </div>
            {/* //just a spacing for better visual seperation of the page sections - need to test this layout */}
            <div className="pt-8">{children}</div> 
        </section>
    );
};

export default SharedLayout;