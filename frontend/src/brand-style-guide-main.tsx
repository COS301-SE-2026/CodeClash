import React from "react";
import ReactDOM from 'react-dom/client';
import './styles/global.css';

import IntroSection from "./Views/BrandStyleGuide/IntroductionSection";
import { brandStyleGuideContent } from "./Models/BrandStyleGuideModel";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className="max-w-[860px] mx-auto px-6 py-12 bg-white min-h-screen">
            <IntroSection content={brandStyleGuideContent}/>
        </div>
    </React.StrictMode>
);