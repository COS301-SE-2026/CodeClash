import React from "react"; //- correct file

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
                <p className = "text-xs font-semibold text-[#530A24] uppercase mb-2">{eyebrow}</p> {/*make the eyebrow text the same maroon as the bg in the pages, the other text is gray for now*/}
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
                {description && ( //only if a description exists because it is optional
                    <p className="text-gray-500 text-sm leading-relaved max-w-none">{description}</p>
                )}
            </div>
            {/* //just a spacing for better visual seperation of the page sections - need to test this layout */}
0            <div className="pt-8">{children}</div> 
        </section>
    );
};

export default SharedLayout;