import React from "react";
import ReactDOM from 'react-dom/client';
import './styles/global.css';

import BrandStyleGuide from "./Views/BrandStyleGuide";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrandStyleGuide/>
    </React.StrictMode>
);